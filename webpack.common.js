// webpack.config.js
const path = require('path');

module.exports = {
  entry: {
    background: './src/background.ts',
    content_script: './src/content_script.ts',
    popup: './src/popup.ts',
    redirect: './src/redirect.ts',
    toolbar: './src/toolbar.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
};
