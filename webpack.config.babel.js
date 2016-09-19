import path from 'path';

const loaders = [{
  test: /\.js$/,
  loader: 'babel-loader',
  include: path.join(__dirname, 'src'),
}, {
  test: /\.json$/,
  loader: 'json-loader',
}];

export default {
  devtool: 'source-map',
  entry: './src/index',
  output: {
    path: path.join(__dirname, 'umd'),
    library: 'MobxReactForm',
    libraryTarget: 'umd',
  },
  resolve: {
    root: path.resolve('.', 'src'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.json'],
  },
  externals: {
    lodash: '_',
    mobx: 'mobx',
  },
  module: { loaders },
};
