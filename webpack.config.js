const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const { join } = require("path");

const MINIFY = process.env.MINIFY === "YES";

const rules = [
  {
    test: /\.ts$/,
    loader: "ts-loader",
    include: join(__dirname, "src"),
  },
  {
    test: /\.json$/,
    loader: "json-loader",
  },
];

module.exports = {
  mode: MINIFY ? "production" : "development",
  devtool: "source-map",
  entry: {
    MobxReactForm: "./src/index",
    MobxReactFormComposer: "./src/composer",
    MobxReactFormValidatorVJF: "./src/validators/VJF",
    MobxReactFormValidatorDVR: "./src/validators/DVR",
    MobxReactFormValidatorSVK: "./src/validators/SVK",
    MobxReactFormValidatorYUP: "./src/validators/YUP",
    MobxReactFormValidatorZOD: "./src/validators/ZOD",
  },
  output: {
    path: join(__dirname, "umd"),
    filename: MINIFY ? "[name].umd.min.js" : "[name].umd.js",
    library: "[name]",
    libraryTarget: "umd",
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".json"],
  },
  externals: {
    mobx: "mobx",
    lodash: "_",
  },
  module: { rules },
  plugins: [new LodashModuleReplacementPlugin()],
};
