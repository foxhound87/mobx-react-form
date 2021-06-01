module.exports = {
  sourceType: "unambiguous",
  presets: [
    "@babel/preset-env"
  ],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true
      }
    ],
    "@babel/plugin-proposal-class-properties",
    "add-module-exports"
  ]
};
