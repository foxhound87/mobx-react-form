import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import { join } from 'path';

const MINIFY = (process.env.MINIFY === 'YES');

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
  entry: {
    MobxReactForm: './src/index',
    MobxReactFormValidatorVJF: './src/validators/VJF',
    MobxReactFormValidatorDVR: './src/validators/DVR',
    MobxReactFormValidatorSVK: './src/validators/SVK',
    MobxReactFormValidatorYUP: './src/validators/YUP',
  },
  output: {
    path: join(__dirname, 'umd'),
		filename: MINIFY ? '[name].umd.min.js' : '[name].umd.js',
    library: '[name]',
    libraryTarget: 'umd',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
  },
  externals: {
    mobx: 'mobx',
    lodash: '_',
  },
  module: { loaders },
  plugins: [new LodashModuleReplacementPlugin]
};
