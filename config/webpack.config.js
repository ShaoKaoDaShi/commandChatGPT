const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[contenthash].main.js',
    path: path.resolve(__dirname, '../dist'),
    clean:true,
  },
  target:'node',
  mode: 'development',
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
};