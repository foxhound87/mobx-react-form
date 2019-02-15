## Validation Plugins

The validation functionalities are optional and you can choose which kind of library to import to achieve it, based on your own style preferences or needs. You can even mix plugins to achieve more flexibility.

All package listed below are not included in the mobx-react-form package and must be installed and passed to the constructor for the Form Initialization using the plugins object.

| Driver | Description | Package | | |
|---|---|---|---|
| **VJF** | Vanilla Javascript Functions | **chriso/validator.js** | [GitHub &#10140;](https://github.com/chriso/validator.js) | [NPM &#10140;](https://www.npmjs.com/package/validator) |
| **DVR** | Declarative Validation Rules | **skaterdav85/validatorjs** | [GitHub &#10140;](https://github.com/skaterdav85/validatorjs) | [NPM &#10140;](https://www.npmjs.com/package/validatorjs) |
| **SVK** | Schema Validation Keywords | **epoberezkin/ajv** | [GitHub &#10140;](https://github.com/epoberezkin/ajv) | [NPM &#10140;](https://www.npmjs.com/package/ajv) |
| **YUP** | Object Schema Validator | **jquense/yup** | [GitHub &#10140;](https://github.com/jquense/yup) | [NPM &#10140;](https://www.npmjs.com/package/yup)

###### INFO

* The `chriso/validator` package when setting up `VJF` is optional.
* `SVK` plugin supports only `flat` or nested `objects` fields, not nested `arrays` of fields.
* To setup custom error messages, see the related plugin repo, each package has a different implementation.

###### SETUP
- [Setup Vanilla Javascript Validation Functions (VJF)](plugins/VJF/setup.md)
- [Setup Declarative Validation Rules (DVR)](plugins/DVR/setup.md)
- [Setup Schema Validation Keywords (SVK)](plugins/SVK/setup.md)
- [Setup YUP Object Schema Validator (YUP)](plugins/YUP/setup.md)
