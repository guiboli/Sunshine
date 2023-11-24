import log from "electron-log/main";
import path from "path";

const { app, BrowserWindow } = require("electron");
const { exec, execSync } = require("node:child_process");

const checkIsRunning = async (query) => {
  let platform = process.platform;
  let cmd = "";
  switch (platform) {
    case "win32":
      cmd = `tasklist`;
      break;
    case "darwin":
      cmd = `ps -ax | grep ${query}`;
      break;
    case "linux":
      cmd = `ps -A`;
      break;
    default:
      break;
  }

  const p = new Promise((r, rj) => {
    exec(cmd, (error, stdout, stderr) => {
      if (stderr != "") {
        r(false);

        return;
      }

      if (stdout.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        r(true);

        return;
      }

      r(false);
    });
  });

  return await p;
};

const delay = async (duration) => {
  return new Promise((r) => setTimeout(r, duration));
};

const checkIsDev = () => {
  return process.env.NODE_ENV === "development";
};

log.initialize({ preload: true });
app.commandLine.appendSwitch("ignore-certificate-errors");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let sunshinePid = -1;
const createWindow = async () => {
  log.info(`[main] createWindow called`);
  {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
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

    await delay(5000);
    const isStillRunning = await checkIsRunning(`sunshine`);
    log.info(`[main] isStillRunning:`, isStillRunning);
    if (isStillRunning) {
      mainWindow.loadURL("https://0.0.0.0:47990");
    } else {
      mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    }
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  log.info(`[main] before-quit called`);
  if (sunshinePid !== -1) {
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
