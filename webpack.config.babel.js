import { join } from 'path';

const include = join(__dirname, 'src');

export default {
  devtool: 'source-map',
  entry: './src/index',
  output: {
    path: join(__dirname, 'umd'),
    libraryTarget: 'umd',
    library: 'ReactiveForm',
  },
  externals: {
    lodash: '_',
    mobx: 'mobx',
    ajv: 'Ajv',
  },
  module: {
    loaders: [{
      query: {
        presets: ['es2015', 'stage-0'],
        plugins: [
          'add-module-exports',
          'transform-decorators-legacy',
          'transform-decorators',
          'transform-class-properties',
          'transform-es2015-modules-umd',
        ],
      },
      test: /\.js$/,
      loader: 'babel-loader',
      include,
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },
};
