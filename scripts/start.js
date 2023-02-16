const webpack = require("webpack");
const config = require("../config/webpack.config");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const chalk = require("react-dev-utils/chalk");
const Mode = "development";
start();

function start() {
  config.mode = Mode;
  const compiler = webpack(config);

  // watch 集成 run 方法
  const watching = compiler.watch(
    {
      // 示例
      aggregateTimeout: 300,
      ignored: ["/dist"],
    },
    (err, stats) => {
      let messages = formatWebpackMessages(
        stats.toJson({ all: false, warnings: true, errors: true })
      );
      if (messages.errors.length) {
        console.log(
          messages.errors.join("\n\n").split("Error").join(chalk.red("Error"))
        );
        return new Error(messages.errors.join("\n\n"));
      }
      if (messages.warnings.length) {
        // Ignore sourcemap warnings in CI builds. See #8227 for more info.
        const filteredWarnings = messages.warnings.filter(
          (w) => !/Failed to parse source map/.test(w)
        );
        if (filteredWarnings.length) {
          console.log(
            chalk.yellow(
              "\nTreating warnings as errors because process.env.CI = true.\n" +
                "Most CI servers set it automatically.\n"
            )
          );
          console.log(filteredWarnings.join("\n\n"));
          return new Error(filteredWarnings.join("\n\n"));
        }
      }
    }
  );
}
