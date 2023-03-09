const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isFirefoxSafari = process.env.TARGET == 'firefox-safari'
const isProduction = process.env.NODE_ENV == 'production';

const TARGET_FOLDER = ['dist', isFirefoxSafari ? 'firefox-safari' : 'chromium'];

const config = {
  entry: {
    options: path.join(__dirname, 'src', 'options', 'options'),
    contentScript: path.join(
      __dirname,
      'src',
      'contentScript',
      'contentScript'
    ),
    backgroundScript: path.join(
      __dirname,
      'src',
      'backgroundScript',
      'backgroundScript'
    ),
  },
  output: {
    filename: '[name].bundle.js',
    clean: true,
    path: path.resolve(__dirname, ...TARGET_FOLDER),
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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2)$/i,
        include: [
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
        ],
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      }
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
  function getModifiedManifest(content) {

    const manifest = JSON.parse(content.toString());

    if (isFirefoxSafari) {
      // for Firefox/Safari, background scripts are declared in the manifest differently
      const backgroundScript = manifest.background.service_worker;
      manifest.background = {scripts: [ backgroundScript ]};
    } else {
      // for Chromium based browsers browser_specific_settings is not supported
      delete manifest['browser_specific_settings'];
    }

    return JSON.stringify(
      {
        description: process.env.npm_package_description,
        version: process.env.npm_package_version,
        ...manifest,
      },
      null,
      isProduction ? null : 2
    );
  }

  return new CopyWebpackPlugin({
    patterns: [
      {
        from: 'manifest.json',
        to: path.join(__dirname, ...TARGET_FOLDER),
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
        to: path.join(__dirname, ...TARGET_FOLDER),
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
