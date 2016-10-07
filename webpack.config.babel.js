import { join } from 'path';

const loaders = [{
  test: /\.js$/,
  loader: 'babel-loader',
  include: join(__dirname, 'src'),
}, {
  test: /\.json$/,
  loader: 'json-loader',
}];

export default {
  devtool: 'source-map',
  entry: './src/index',
  output: {
    path: join(__dirname, 'umd'),
    library: 'MobxReactForm',
    libraryTarget: 'umd',
  },
  resolve: {
    root: join(__dirname, 'src'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      react: join(__dirname, 'node_modules', 'react'),
    },
  },
  externals: {
    mobx: 'mobx',
  },
  module: { loaders },
};
