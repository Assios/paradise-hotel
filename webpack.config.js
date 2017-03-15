const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, process.env.npm_package_config_build_path || 'dist')
  },
  module: {
    rules: [
      {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
              presets: ["es2015"]
          }
      },
      {
        test:  /\.css$/,
        use: [
          'style-loader',
          {loader: 'css-loader', options: {import: false, url: false}}
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'app/index.html')
    }),
    new CopyWebpackPlugin([
      {from: 'app/img', to: 'img'},
      {from: 'app/butterfly.obj'},
    ]),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      jquery: 'jquery',
      $: 'jquery'
    })
  ],
  devtool: 'source-map'
};