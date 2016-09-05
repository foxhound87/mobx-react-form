const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaders = [{
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel',
}, {
  test: /\.json$/,
  loader: 'json-loader',
}, {
  test: /\.css$/,
  loader: 'style-loader!css-loader',
}, {
  test: /\.less$/,
  loader: 'style-loader!css-loader!less-loader',
}, {
  test: /\.gif$/,
  loader: 'url-loader?mimetype=image/png',
}, {
  test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
  loader: 'url-loader?mimetype=application/font-woff',
}, {
  test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
  loader: 'file-loader?name=[name].[ext]',
}];

module.exports = {
  devtool: 'eval-source-map',
  entry: path.resolve('.', 'src', 'main.jsx'),
  resolve: {
    root: path.resolve('.', 'src'),
    modulesDirectories: ['node_modules', path.resolve('.', 'node_modules')],
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      react: path.resolve('.', 'node_modules', 'react'),
    },
  },
  output: {
    path: path.resolve('.', 'build'),
    filename: '[name].js',
    publicPath: '',
  },
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'bluebird',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'index.html'),
    }),
  ],
  module: { loaders },
};
