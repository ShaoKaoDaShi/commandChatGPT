const path = require("path");
const WebpackBar = require("webpackbar");
let progressPlugin = new WebpackBar({
  color: "#85d", // 默认green，进度条颜色支持HEX
  basic: true, // 默认true，启用一个简单的日志报告器
  profile: false, // 默认false，启用探查器。
});
module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "[contenthash].main.js",
    path: path.resolve(__dirname, "../dist"),
    clean: true,
  },
  target: "node",
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
  plugins: [
    progressPlugin,
  ],
};
