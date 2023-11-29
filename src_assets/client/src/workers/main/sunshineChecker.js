const log = require("electron-log/main");
const { EventNamesMap } = require("../../constants/constant");
const { checkIsRunning, delay } = require("../../main/utils");
const { parentPort } = require("worker_threads");

log.initialize({ preload: true });

(async () => {
  log.info("[sunshineChecker] worker started");
  while (await checkIsRunning(`sunshine`)) {
    await delay(1000);
  }

  log.info("[sunshineChecker] sunshine process is not running");
  parentPort.postMessage(EventNamesMap.SUNSHINE_KILLED);
})();
