/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common('development'), {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    copyOptionsHtmlToDist(),
  ]
});

function copyOptionsHtmlToDist() {
    return new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'options', 'options.html'),
      filename: 'options.html',
    });
}
