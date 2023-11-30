const log = require("electron-log/main");
const {
  EventNamesMap,
  SunshineHttpAddress,
} = require("../../constants/constant");
const {
  checkIsRunning,
  delay,
  checkIsHttpServiceAlive,
} = require("../../main/utils");
const { parentPort } = require("worker_threads");

log.initialize({ preload: true });

(async () => {
  log.info("[sunshineChecker] worker started");
  while (true) {
    if (await checkIsHttpServiceAlive(SunshineHttpAddress, true)) {
      parentPort.postMessage(EventNamesMap.SUNSHINE_READY);
      log.info("[sunshineChecker] sunshine http service is ready");
      break;
    }

    await delay(1000);
  }

  while (await checkIsRunning(`sunshine`)) {
    await delay(1000);
  }

  log.info("[sunshineChecker] sunshine process is not running");
  parentPort.postMessage(EventNamesMap.SUNSHINE_KILLED);
})();
