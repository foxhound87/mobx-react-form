import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

const external = ["mobx", /^lodash(\/|$)/];
const umdExternal = ["mobx", "lodash"];
const umdGlobals = { mobx: "mobx", lodash: "_" };

const tsOptions = (outDir, extra = {}) => ({
  compilerOptions: { module: "esnext", declaration: false, declarationMap: false, outDir, ...extra },
});

const babelPlugin = babel({
  babelHelpers: "bundled",
  plugins: ["lodash"],
  extensions: [".ts"],
});

const libEntries = [
  "src/index.ts",
  "src/composer.ts",
  "src/validators/VJF.ts",
  "src/validators/DVR.ts",
  "src/validators/SVK.ts",
  "src/validators/YUP.ts",
  "src/validators/JOI.ts",
  "src/validators/ZOD.ts",
];

const umdEntries = {
  MobxReactForm: "./src/index.ts",
  MobxReactFormComposer: "./src/composer.ts",
  MobxReactFormValidatorVJF: "./src/validators/VJF.ts",
  MobxReactFormValidatorDVR: "./src/validators/DVR.ts",
  MobxReactFormValidatorSVK: "./src/validators/SVK.ts",
  MobxReactFormValidatorYUP: "./src/validators/YUP.ts",
  MobxReactFormValidatorJOI: "./src/validators/JOI.ts",
  MobxReactFormValidatorZOD: "./src/validators/ZOD.ts",
};

export default [
  // CJS — with declarations
  {
    input: libEntries,
    output: {
      dir: "lib",
      format: "cjs",
      exports: "named",
      preserveModules: true,
      preserveModulesRoot: "src",
      sourcemap: true,
    },
    external,
    plugins: [
      resolve(),
      commonjs(),
      typescript(tsOptions("lib", { declaration: true, declarationMap: true, declarationDir: "lib" })),
      babelPlugin,
    ],
  },

  // ESM
  {
    input: libEntries,
    output: {
      dir: "lib/esm",
      format: "esm",
      preserveModules: true,
      preserveModulesRoot: "src",
      sourcemap: true,
    },
    external,
    plugins: [resolve(), commonjs(), typescript(tsOptions("lib/esm")), babelPlugin],
  },

  // UMD (dev + min)
  ...Object.entries(umdEntries).flatMap(([name, input]) => [
    {
      input,
      output: { file: `umd/${name}.umd.js`, format: "umd", name, globals: umdGlobals, sourcemap: true },
      external: umdExternal,
      plugins: [resolve(), commonjs(), typescript(tsOptions("umd"))],
    },
    {
      input,
      output: { file: `umd/${name}.umd.min.js`, format: "umd", name, globals: umdGlobals, sourcemap: true },
      external: umdExternal,
      plugins: [resolve(), commonjs(), typescript(tsOptions("umd")), terser()],
    },
  ]),
];
