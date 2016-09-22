# Documentation Index

- [Defining the Form Fields](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md)
- [Form Initialization](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormInit.md)
- [Form Actions](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormActions.md)
- [Form Events](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormEvents.md)
- [Form Options](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#form-options)
- [Validation Plugins](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#validation-plugins)
- [Form API List](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormApi.md)
- [Fields API List](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FieldsApi.md)
- [Supported Validation Packages](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#supported-validation-packages)
- [Remove AJV Warnings from webpack](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingSVKValidation.md#remove-ajv-warnings-from-webpack)


<br>

## Validation Plugins

> Some plugins can be `extended` with custom functionalities (see below).

| Modes | Description | Default | Provider Library |
|---|---|---|---|
| **VJF** | Vanilla Javascript Validation Functions | YES | chriso's **validator** (optional) |
| **DVR** | Declarative Validation Rules | NO | skaterdav85's **validatorjs** |
| **SVK** | Json Schema Validation Keywords | NO | epoberezkin's **ajv** |


###### VALIDATION MODES
- [Enabling Vanilla Javascript Validation Functions (VJF)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingVJFValidation.md)
- [Enabling Json Schema Validation Keywords (SVK)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingSVKValidation.md)
- [Enabling Declarative Validation Rules (DVR)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingDVRValidation.md)

###### EXTEND VALIDATION
- [Custom Vanilla Javascript Validation Functions](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationFunctions.md)
- [Custom Json Schema Validation Keywords (extend)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationKeywords.md)
- [Custom Declarative Validation Rules (extend)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationRules.md)

###### ASYNC VALIDATION
- [Async Vanilla Javascript Validation Functions](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationFunctions.md#async-validation-functions)
- [Async Json Schema Validation Keywords](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationKeywords.md#async-validation-keywords)
- [Async Declarative Validation Rules](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationRules.md#async-validation-rules)

---

<br>

## Form Options

| Option | Type | Default | Info |
|---|---|---|---|
| **showErrorsOnInit** | boolean | false | Show or hide error messages for `validateOnInit`. |
| **validateOnInit** | boolean | true | Validate of the whole form on initilization. |
| **validateOnChange** | boolean | true | Validate fields when their value changes. |
| **strictUpdate** | boolean | false | Throw an error if trying to `update an undefined field. |
| **showErrorsOnUpdate** | boolean | true | Show validation errors after an update. |
| **defaultGenericError** | string | null | Set e default message to show when a generic error occurs. |
| **loadingMessage** | string | null | Set a global loading message to show during async calls. |
| **allowRequired** | false | boolean | The json-schema `required` property can work only if the object does not contain the field key/value pair, `allowRequired` can remove it when needed to make `required` work properly. Be careful because enabling it will make `minLength` uneffective when the `string` is `empty`. |
| **ajv** | object | - | Additional options for AJV. See all the details of [ajv options](https://github.com/epoberezkin/ajv#options) on the official github page of AJV. |


<br>

## Supported Validation Packages

The validation functionalities are optional and you can choose which kind of library to import to achieve it, based on your own style preferences or needs. You can even mix these styles to achieve more flexibility.

All package listed below are not included in the `mobx-react-form` and must be installed and passed to the [- [Form Initialization](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormInit.md)
 using the `plugins` object.


| Package | Author | | | Description |
|---|---|---|---|---|
| **ajv** | [epoberezkin](https://github.com/epoberezkin) | [GitHub&#10140;](https://github.com/epoberezkin/ajv) | [NPM&#10140;](https://www.npmjs.com/package/ajv) | A v5 compliant JSON Schema Validator with custom validation keywords support and automatic error messages |
| **validatorjs** | [skaterdav85](https://github.com/skaterdav85) | [GitHub&#10140;](https://github.com/skaterdav85/validatorjs) | [NPM&#10140;](https://www.npmjs.com/package/validatorjs) | Validation library inspired by Laravel's Validator with readable and declarative validation rules and error messages with multilingual support |
| **validator** | [chriso](https://github.com/chriso) | [GitHub&#10140;](https://github.com/chriso/validator.js) | [NPM&#10140;](https://www.npmjs.com/package/validator) | String validation and sanitization, useful for enhance custom validation functions |

