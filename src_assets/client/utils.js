const { resolve } = require("path");

const resolveFromRoot = (...args) => resolve(__dirname, ...args);

module.exports = {
  resolveFromRoot,
};
