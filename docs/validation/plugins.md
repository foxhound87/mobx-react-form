## Validation Plugins

The validation functionalities are optional and you can choose which kind of library to import to achieve it, based on your own style preferences or needs. You can even mix plugins to achieve more flexibility.

All package listed below are not included in the mobx-react-form package and must be installed and passed to the constructor for the Form Initialization using the plugins object.

| Driver | | Description | Package | | |
|---|---|---|---|---|
| **VJF** | [UMD](https://unpkg.com/mobx-react-form/umd/MobxReactFormValidatorVJF.umd.min.js) | Vanilla Javascript Functions | **npm i validator** | [GitHub](https://github.com/validatorjs/validator.js) | [NPM](https://www.npmjs.com/package/validator) |
| **DVR** | [UMD](https://unpkg.com/mobx-react-form/umd/MobxReactFormValidatorDVR.umd.min.js) | Declarative Validation Rules | **npm i validatorjs** | [GitHub](https://github.com/mikeerickson/validatorjs) | [NPM](https://www.npmjs.com/package/validatorjs) |
| **SVK** | [UMD](https://unpkg.com/mobx-react-form/umd/MobxReactFormValidatorSVK.umd.min.js) | Schema Validation Keywords | **npm i ajv** | [GitHub](https://github.com/ajv-validator/ajv) | [NPM](https://www.npmjs.com/package/ajv) |
| **YUP** | [UMD](https://unpkg.com/mobx-react-form/umd/MobxReactFormValidatorYUP.umd.min.js) | Object Schema Validator | **npm i yup** | [GitHub](https://github.com/jquense/yup) | [NPM](https://www.npmjs.com/package/yup) |
| **ZOD** | [UMD](https://unpkg.com/mobx-react-form/umd/MobxReactFormValidatorZOD.umd.min.js) | TypeScript-first schema validation | **npm i zod** | [GitHub](https://github.com/colinhacks/zod) | [NPM](https://www.npmjs.com/package/zod) |

###### INFO

* The `validator` package when setting up `VJF` is optional.
* To setup custom error messages, see the related plugin repo, each package has a different implementation.

###### SETUP
- [Setup VJF - Vanilla Javascript Validation Functions](plugins/VJF/setup.md)
- [Setup DVR - Declarative Validation Rules](plugins/DVR/setup.md)
- [Setup SVK - Schema Validation Keywords](plugins/SVK/setup.md)
- [Setup YUP - Object Schema Validator](plugins/YUP/setup.md)
- [Setup ZOD - TypeScript-first schema validation](plugins/ZOD/setup.md)
