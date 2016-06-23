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
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include,
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },
};
