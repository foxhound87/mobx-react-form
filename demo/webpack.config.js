const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaders = [{
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel',
}, {
  test: /\.json$/,
  loader: 'json-loader',
}];

module.exports = {
  devtool: 'eval-source-map',
  entry: path.resolve('.', 'src', 'main.jsx'),
  resolve: {
    root: path.resolve('.', 'src'),
    modulesDirectories: ['node_modules'],
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
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html',
    }),
  ],
  module: { loaders },
};
