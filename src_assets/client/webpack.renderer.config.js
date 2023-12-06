const rules = require("./webpack.rules");
const { resolveFromRoot } = require("./utils");

rules.push({
  test: /\.(s?css)$/,
  use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
});

module.exports = {
  resolve: {
    alias: {
      // to distinguish node_modules packages, we use '~' alias in [.js, .jsx, .ts, .tsx]
      // but '~' not work in [.css, .scss, .less], we use '@' alias in [.css, .scss, .less]
      "~": resolveFromRoot("src/renderer"),
      "@": resolveFromRoot("src/renderer"),
    },
    extensions: [".json", ".js", ".jsx", ".ts", ".tsx"],
  },
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
