## Validation Plugins

The validation functionalities are optional and you can choose which kind of library to import to achieve it, based on your own style preferences or needs. You can even mix plugins to achieve more flexibility.

All package listed below are not included in the mobx-formikit package and must be installed and passed to the constructor for the Form Initialization using the plugins object.

| Driver | Description | Install | Links |
|---|---|---|---|
| **VJF** | Vanilla Javascript Functions | `npm i validator` | [UMD](https://unpkg.com/mobx-formikit/umd/MobxFormikitValidatorVJF.umd.min.js) · [GitHub](https://github.com/validatorjs/validator.js) · [NPM](https://www.npmjs.com/package/validator) |
| **DVR** | Declarative Validation Rules | `npm i validatorjs` | [UMD](https://unpkg.com/mobx-formikit/umd/MobxFormikitValidatorDVR.umd.min.js) · [GitHub](https://github.com/mikeerickson/validatorjs) · [NPM](https://www.npmjs.com/package/validatorjs) |
| **AJV** | Schema Validation Keywords | `npm i ajv` | [UMD](https://unpkg.com/mobx-formikit/umd/MobxFormikitValidatorAJV.umd.min.js) · [GitHub](https://github.com/ajv-validator/ajv) · [NPM](https://www.npmjs.com/package/ajv) |
| **YUP** | Object Schema Validator | `npm i yup` | [UMD](https://unpkg.com/mobx-formikit/umd/MobxFormikitValidatorYUP.umd.min.js) · [GitHub](https://github.com/jquense/yup) · [NPM](https://www.npmjs.com/package/yup) |
| **JOI** | Object Schema Validator | `npm i joi` | [UMD](https://unpkg.com/mobx-formikit/umd/MobxFormikitValidatorJOI.umd.min.js) · [GitHub](https://github.com/hapijs/joi) · [NPM](https://www.npmjs.com/package/joi) |
| **ZOD** | TypeScript-first schema validation | `npm i zod` | [UMD](https://unpkg.com/mobx-formikit/umd/MobxFormikitValidatorZOD.umd.min.js) · [GitHub](https://github.com/colinhacks/zod) · [NPM](https://www.npmjs.com/package/zod) |
| **VALIBOT** | Tiny TypeScript-first schema validation | `npm i valibot` | [UMD](https://unpkg.com/mobx-formikit/umd/MobxFormikitValidatorVALIBOT.umd.min.js) · [GitHub](https://github.com/fabian-hiller/valibot) · [NPM](https://www.npmjs.com/package/valibot) |
| **VINEJS** | Sync rules, async validation API | `npm i @vinejs/vine` | [UMD](https://unpkg.com/mobx-formikit/umd/MobxFormikitValidatorVINEJS.umd.min.js) · [GitHub](https://github.com/vinejs/vine) · [NPM](https://www.npmjs.com/package/@vinejs/vine) |

###### INFO

* The `validator` package when setting up `VJF` is optional.
* VALIBOT requires no `package` (bundled); VINEJS requires a Vine instance via `package`.
* To setup custom error messages, see the related plugin repo, each package has a different implementation.

###### SETUP
- [Setup VJF - Vanilla Javascript Validation Functions](plugins/VJF/setup.md)
- [Setup DVR - Declarative Validation Rules](plugins/DVR/setup.md)
- [Setup AJV - Schema Validation Keywords](plugins/AJV/setup.md)
- [Setup YUP - Object Schema Validator](plugins/YUP/setup.md)
- [Setup JOI - Object Schema Validator](plugins/JOI/setup.md)
- [Setup ZOD - TypeScript-first schema validation](plugins/ZOD/setup.md)
- [Setup VALIBOT - Tiny TypeScript-first schema validation](plugins/VALIBOT/setup.md)
- [Setup VINEJS - Sync rules, async validation API](plugins/VINEJS/setup.md)
