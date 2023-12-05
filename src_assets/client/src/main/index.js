import log from "electron-log/main";
import path from "path";

const { app, BrowserWindow } = require("electron");
const { exec, execSync } = require("node:child_process");
const { checkIsRunning, checkIsDev, delay, loadURL } = require("./utils/utils");
const { EventNamesMap, SunshineHttpAddress } = require("./constants/constant");
import { Worker } from "worker_threads";

let mainWindow = null;
log.initialize({ preload: true });
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

let sunshinePid = "";
const createWindow = async () => {
  log.info(`[main] createWindow called`);
  if (mainWindow) {
    return;
  }

  {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

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
          `sunshine 1> /tmp/sunshine_info.log 2> /tmp/sunshine_error.log &`,
          (code, stdout, stderr) => {
            r(code);
            if (stderr != "") {
              log.error(`[main] launch Sunshine occurs error: `, stderr);

              return;
            }

            const pidofStdout = execSync(`pidof sunshine`).toString();
            if (pidofStdout != null) {
              sunshinePid = pidofStdout;
              log.info(`[main] sunshinePid:`, sunshinePid);
            }
          }
        );
      });

      await p;
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
            mainWindow.loadURL(SunshineHttpAddress);
          }
        });

        worker.on("error", (error) => {
          log.error(`[main] error in worker thread: ${error}`);
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
    log.info(`[main] will kill Sunshine process: `, sunshinePid);
    try {
      const result = process.kill(sunshinePid);
      if (!result) {
        process.abort(sunshinePid);
      }
    } catch (err) {
      log.error(`[main] kill Sunshine process occurs error: `, err);
      process.abort(sunshinePid);
    } finally {
      log.info(`[main] kill Sunshine process done`);
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
