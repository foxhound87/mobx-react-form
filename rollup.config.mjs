import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import terser from "@rollup/plugin-terser";

const external = ["mobx", /^lodash(\/|$)/];
const esmExternal = ["mobx", /^lodash-es(\/|$)/];
const umdExternal = ["mobx", "lodash"];
const umdGlobals = { mobx: "mobx", lodash: "_" };

const tsOptions = (outDir, extra = {}) => ({
  compilerOptions: { module: "esnext", declaration: false, declarationMap: false, outDir, ...extra },
});

const lodashToEsm = alias({
  entries: [{ find: /^lodash$/, replacement: "lodash-es" }],
});

const umdEntries = {
  MobxFormikit: { input: "./src/index.ts", exports: "named" },
  MobxFormikitComposer: { input: "./src/composer.ts", exports: "named" },
  MobxFormikitValidatorVJF: { input: "./src/validators/VJF.ts", exports: "default" },
  MobxFormikitValidatorDVR: { input: "./src/validators/DVR.ts", exports: "default" },
  MobxFormikitValidatorAJV: { input: "./src/validators/AJV.ts", exports: "default" },
  MobxFormikitValidatorYUP: { input: "./src/validators/YUP.ts", exports: "default" },
  MobxFormikitValidatorJOI: { input: "./src/validators/JOI.ts", exports: "default" },
  MobxFormikitValidatorZOD: { input: "./src/validators/ZOD.ts", exports: "default" },
  MobxFormikitValidatorVALIBOT: { input: "./src/validators/VALIBOT.ts", exports: "default" },
  MobxFormikitValidatorVINEJS: { input: "./src/validators/VINEJS.ts", exports: "default" },
};

const libEntries = Object.values(umdEntries).map(({ input }) => input);

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
      typescript(tsOptions("lib", { declaration: true, declarationMap: true, declarationDir: "lib" })),
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
    external: esmExternal,
    plugins: [lodashToEsm, typescript(tsOptions("lib/esm"))],
  },

  // UMD (dev + min)
  ...Object.entries(umdEntries).flatMap(([name, { input, exports: umdExports }]) => [
    {
      input,
      output: { file: `umd/${name}.umd.js`, format: "umd", name, exports: umdExports, globals: umdGlobals, sourcemap: true },
      external: umdExternal,
      plugins: [resolve(), commonjs(), typescript(tsOptions("umd"))],
    },
    {
      input,
      output: { file: `umd/${name}.umd.min.js`, format: "umd", name, exports: umdExports, globals: umdGlobals, sourcemap: true },
      external: umdExternal,
      plugins: [resolve(), commonjs(), typescript(tsOptions("umd")), terser()],
    },
  ]),
];
