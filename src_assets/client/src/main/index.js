import path from "path";
import { Worker } from "worker_threads";
import log from "electron-log/main";
const { app, BrowserWindow, ipcMain } = require("electron");
const { exec, execSync } = require("node:child_process");
const { checkIsRunning, checkIsDev, delay, loadURL } = require("./utils/utils");
const { EventNamesMap, SunshineHttpAddress } = require("./constants/constant");

log.initialize({ preload: true });

const setWifiOn = async () => {
  const p = new Promise((r, rj) => {
    const cmd0 = `nmcli radio wifi on`;
    exec(cmd0, (error, stdout, stderr) => {
      log.info(`[setWifiOn] (no sudo) stdout: ${stdout}`);
      if (stderr != "") {
        log.error(`[setWifiOn] (no sudo) stderr: ${stderr}`);
        const cmd1 = `sudo nmcli radio wifi on`;
        exec(cmd1, (error, stdout, stderr) => {
          log.info(`[setWifiOn] (try sudo) stdout: ${stdout}`);
          if (stderr != "") {
            log.error(`[setWifiOn] (try sudo) stderr: ${stderr}`);

            r(false);

            return;
          }

          r(true);
        });

        return;
      }

      r(true);
    });
  });

  return p;
};

let mainWindow = null;
app.commandLine.appendSwitch("ignore-certificate-errors");
let isSingleInstance = app.requestSingleInstanceLock();
log.info(`[main] isSingleInstance:`, isSingleInstance);
if (!isSingleInstance) {
  app.quit();
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

ipcMain.on("relaunch", (evt, arg) => {
  app.relaunch({ args: process.argv.slice(1).concat(["--relaunch"]) });
  app.exit(0);
});

let sunshinePid = "";
const createWindow = async () => {
  log.info(`[main] createWindow called`);
  setWifiOn();
  if (mainWindow) {
    return;
  }

  {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      fullscreen: false,
      width: 800,
      height: 600,
      title: "广汽串流",
      icon: new URL("../../images/icon.png", import.meta.url).href,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    mainWindow.maximize();

    if (checkIsDev()) {
      mainWindow.webContents.openDevTools();
    } else {
      mainWindow.removeMenu();
    }

    const isRunning = await checkIsRunning(`sunshine`);
    log.info(`[main] isRunning:`, isRunning);
    if (isRunning) {
      const stdout = execSync(`pidof sunshine`).toString();
      if (stdout != null) {
        sunshinePid = stdout;
        log.info(`[main] sunshinePid:`, sunshinePid);
      }
    } else {
      const p = new Promise((r, rj) => {
        // launch sunshine
        exec(
          `sunshine 1> /tmp/streamer_info.log 2> /tmp/streamer_error.log &`,
          (code, stdout, stderr) => {
            r(code);
            if (stderr != "") {
              log.error(`[main] launch Streamer occurs error: `, stderr);

              return;
            }

            const pidofStdout = execSync(`pidof sunshine`).toString();
            if (pidofStdout != null) {
              sunshinePid = pidofStdout;
              log.info(`[main] streamer pid:`, sunshinePid);
            }
          }
        );
      });

      const result = await p;

      log.info(`[main] launch streamer result:`, result);
    }

    {
      loadURL(mainWindow, MAIN_WINDOW_WEBPACK_ENTRY, "loading");
      log.info(`MAIN_WINDOW_WEBPACK_ENTRY: `, MAIN_WINDOW_WEBPACK_ENTRY);

      {
        const worker = new Worker(
          new URL("./workers/sunshineChecker.js", import.meta.url)
        );
        worker.on("message", (message) => {
          if (message === EventNamesMap.SUNSHINE_KILLED) {
            loadURL(mainWindow, MAIN_WINDOW_WEBPACK_ENTRY, "error");
          }
          if (message === EventNamesMap.SUNSHINE_READY) {
            // loadURL(mainWindow, MAIN_WINDOW_WEBPACK_ENTRY, "error");
            mainWindow.loadURL(SunshineHttpAddress);
          }
        });

        worker.on("error", (error) => {
          log.error(`[main] error in worker thread: ${error}`);
          loadURL(mainWindow, MAIN_WINDOW_WEBPACK_ENTRY, "error");
        });

        worker.on("exit", (code) => {
          log.info(`[main] worker thread exited with code: ${code}`);
        });
      }
    }
  }
};

app.on("ready", createWindow);

app.on("second-instance", (event, argv, cwd) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

app.on("before-quit", () => {
  log.info(`[main] before-quit called`);
  if (sunshinePid !== "") {
    log.info(`[main] will kill Streamer process: `, sunshinePid);
    try {
      const result = process.kill(sunshinePid);
      if (!result) {
        process.abort(sunshinePid);
      }
    } catch (err) {
      log.error(`[main] kill Streamer process occurs error: `, err);
      process.abort(sunshinePid);
    } finally {
      log.info(`[main] kill Streamer process done`);
    }
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
