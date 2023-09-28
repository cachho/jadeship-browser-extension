const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: 'React extension',
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}

module.exports = {
  entry: {
    index: './src/index.tsx',
    background: './src/background.ts',
    content_script: './src/content_script.ts',
    popup: './src/popup.ts',
    redirect: './src/redirect.ts',
    toolbar: './src/toolbar.ts',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        exclude: /node_modules/,
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // new CopyPlugin({
    //   patterns: [{ from: 'manifest.json', to: '../manifest.json' }],
    // }),
    ...getHtmlPlugins(['index']),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'build/js'),
    filename: '[name].js',
  },
};
