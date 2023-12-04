const { exec } = require("node:child_process");
const http = require("http");
const https = require("https");

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

const checkIsHttpServiceAlive = async (
  address,
  isHttps = false,
  timeoutMillis = 5000
) => {
  const p = new Promise((r, rj) => {
    const options = {
      method: "GET",
      timeout: timeoutMillis,
      rejectUnauthorized: false,
    };

    const handler = isHttps ? https : http;
    const request = handler.request(address, options, (response) => {
      r(true);
    });

    request.on("timeout", () => {
      request.destroy();
      r(false);
    });

    request.on("error", (error) => {
      request.destroy();
      r(false);
    });

    request.end();
  });

  return await p;
};

module.exports = {
  checkIsRunning,
  checkIsDev,
  delay,
  checkIsHttpServiceAlive,
};
