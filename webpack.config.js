const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const TARGET_FOLDER = 'dist';
const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : 'style-loader';

const config = {
  entry: {
    options: path.join(__dirname, 'src', 'options', 'options.ts'),
    contentScript: path.join(
      __dirname,
      'src',
      'contentScript',
      'contentScript.ts'
    ),
    backgroundScript: path.join(
      __dirname,
      'src',
      'backgroundScript',
      'backgroundScript.ts'
    ),
  },
  output: {
    filename: '[name].bundle.js',
    clean: true,
    path: path.resolve(__dirname, TARGET_FOLDER),
  },
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  plugins: [
    copyManifestToDist(),
    copyIconsToDist(),
    copyOptionsHtmlToDist(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';

    config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = 'development';
  }
  return config;
};

function copyManifestToDist() {
  function getModifiedManifest(manifest) {
    return JSON.stringify(
      {
        description: process.env.npm_package_description,
        version: process.env.npm_package_version,
        ...JSON.parse(manifest.toString()),
      },
      null,
      isProduction ? null : 2
    );
  }

  return new CopyWebpackPlugin({
    patterns: [
      {
        from: 'manifest.json',
        to: path.join(__dirname, TARGET_FOLDER),
        force: true,
        transform: function (content, path) {
          return Buffer.from(getModifiedManifest(content));
        },
      },
    ],
  });
}

function copyIconsToDist() {
  return new CopyWebpackPlugin({
    patterns: [
      {
        from: 'src/assets/icons',
        to: path.join(__dirname, TARGET_FOLDER),
        force: true,
      },
    ],
  });
}

function copyOptionsHtmlToDist() {
  return new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src', 'options', 'options.html'),
    filename: 'options.html',
    chunks: ['options'],
  });
}
