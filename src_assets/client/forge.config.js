const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
const archiver = require("archiver");
const package = require("./package.json");

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: path.resolve(__dirname, "./images/icon.png"),
          desktopTemplate: path.resolve(
            __dirname,
            "./linux/gac-streaming-client.desktop"
          ),
        },
      },
    },
    // {
    //   name: "@electron-forge/maker-rpm",
    //   config: {},
    // },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        port: 47991,
        mainConfig: "./webpack.main.config.js",
        devServer: {
          historyApiFallback: true,
          hot: true,
        },
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/renderer/index.html",
              js: "./src/renderer/index.js",
              name: "main_window",
              preload: {
                js: "./src/renderer/preload.js",
              },
            },
          ],
        },
      },
    },
  ],
  hooks: {
    postMake: async (...args) => {
      console.log("[postMake] postMake called");
      const outDir = path.resolve(__dirname, "out");
      const combineDir = path.resolve(outDir, "combine");
      const desktopFile = path.resolve(
        __dirname,
        "linux/gac-streaming-client.desktop"
      );
      const installFile = path.resolve(__dirname, "scripts/install.sh");
      const sunshineDeb = path.resolve(
        __dirname,
        "../../",
        "build/cpack_artifacts/Sunshine.deb"
      );
      const clientDeb = path.resolve(
        outDir,
        `make/deb/x64/${package.productName}_${package.version}_amd64.deb`
      );
      shell.rm("-rf", combineDir);
      shell.mkdir("-p", combineDir);
      shell.cp(
        desktopFile,
        path.resolve(combineDir, "gac-streaming-client.desktop")
      );
      shell.cp(installFile, path.resolve(combineDir, "install.sh"));
      shell.cp(sunshineDeb, path.resolve(combineDir, "Streamer.deb"));
      shell.cp(clientDeb, path.resolve(combineDir, "Client.deb"));
      shell.chmod("a+x", path.resolve(combineDir, "install.sh"));

      {
        const p = new Promise((r, rj) => {
          console.log("[postMake] start to generate .zip");
          const output = fs.createWriteStream(outDir + "/combine.zip");
          const archive = archiver("zip", {
            zlib: { level: 1 },
          });
          archive.on("error", function (err) {
            rj(err);
            throw err;
          });
          output.on("close", function () {
            r();
            console.log("[postMake] finish generating .zip");
          });
          archive.pipe(output);
          archive.directory(combineDir, false);
          archive.finalize();
        });

        await p;
      }
    },
  },
};
