# Form Options

- [Form Options](#form-options)
    - [Options Object Properties](#options-object-properties)
    - [Set Options On Form Constructor](#set-options-on-form-constructor)
    - [Set Options On Extended Form Class](#set-options-on-extended-form-class)
    - [Set Options After Form Initialization](#set-options-after-form-initialization)
    - [Get Current Form Options](#get-current-form-options)
    - [Get Form Option by key](#get-form-option-by-key)

[![Edit form-options](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/x7omz8rv9o)

---

### Options Object Properties

> All options can also be used on a single instance of a Field.

| Option | Type | Default | Info |
|---|---|---|---|
| **fallback** | boolean | true | Fields props definition fallback when using `mixed` definition mode (unified + separated). |
| **fallbackValue** | any | "" | This is the default fallback field value applied by `defaultValue()` internal funciton when the field is created, cleared or resetted. It is defaulted as an empty string but can be anything if you need. |
| **defaultGenericError** | string | null | Set e default message to show when a generic error occurs. |
| **submitThrowsError** | boolean | true | If true and `defaultGenericError` is defined throws error and invalidate if validation fails on submit. |
| **showErrorsOnInit** | boolean | false | Show or hide error messages `on init` for `validateOnInit`. |
| **showErrorsOnSubmit** | boolean | true | Show or hide error messages `on submit`. |
| **showErrorsOnBlur** | boolean | true | Show or hide error messages `on blur`. |
| **showErrorsOnChange** | boolean | true | Show or hide errors `on change`. |
| **showErrorsOnClear** | boolean | false | Show or hide errors `on clear`. |
| **showErrorsOnReset** | boolean | true | Show or hide errors `on reset`. |
| **validateOnInit** | boolean | true | Validate of the whole form `on init`. |
| **validateOnSubmit** | boolean | true | Validate fieldset `on submit`. If disabled, Validation Hooks will not be triggered (`onSuccess`/`onError`) |
| **validateOnBlur** | boolean | true | Validate fields value `on blur`. |
| **validateOnChange** | boolean | false | Validate fields value `on change`. |
| **validateOnChangeAfterSubmit** | boolean | false | Validate fields value `on change` after form submit. |
| **validateOnChangeAfterInitialBlur** | boolean | false | Validate fields value `on blur` and then also `on change` only if already blurred. |
| **validateDeletedFields** | boolean | false | Enable or disable field validation based on their `deleted` property. |
| **validateDisabledFields** | boolean | false | Enable or disable field validation based on their `disabled` property. |
| **validatePristineFields** | boolean | true | Enable or disable field validation based on their `isPristine` property. |
| **validateTrimmedValue** | boolean | false | If enabled, it applies `trim()` to the field value before `validate` |
| **strictSelect** | boolean | true | Throw an error if trying to select an undefined field when using `select()` or the helper `$()`. |
| **strictSet** | boolean | false | Throw an error if trying to update an undefined field when using `set()`. |
| **strictUpdate** | boolean | false | Throw an error if trying to update an undefined field when using `update()`. |
| **strictDelete** | boolean | true | Throw an error if trying to delete an undefined field. |
| **softDelete** | boolean | false | When using `del()` the field will not be deleted, instead its `deleted` prop will be switched to `true`. |
| **retrieveOnlyEnabledFieldsErrors** | boolean | false | Get only Enabled Fields Errors when using `get('error')` or the `errors()` helper. |
| **retrieveOnlyEnabledFieldsValues** | boolean | false | Get only Enabled Fields Values when using `get('value')` or the `values()` helper. |
| **retrieveOnlyDirtyFieldsValues** | boolean | false | Get only Dirty Fields Values when using `get('value')` or the `values()` helper. |
| **removeNullishValuesInArrays** | boolean | false | Remove nullish values from arrays when using `get('value')` or the `values()` helper. |
| **retrieveNullifiedEmptyStrings** | boolean | false | Convert empty strings to `null` when using `get('value')` or the `values()` helper. |
| **preserveDeletedFieldsValues** | boolean | false | After deleting and adding same field, the defined initial values will be preserverd if this option is activated. |
| **autoTrimValue** | boolean | false | Trim field value if is a string. |
| **autoParseNumbers** | boolean | false | Try to parse strings to numbers automatically if the initial value of the field is a number. |
| **stopValidationOnError** | boolean | false | If enabled, the validation stops to validate the field with new validation driver (and its functions) if has alredy marked invalid. |
| **resetValidationBeforeValidate** | boolean | true | If disabled, the validation state will not be resetted to its initials before `validate` (experimental) |
| **validationPluginsOrder** | string[] | undefined | Specify an array of strings with the validation plugins order. Accepted Plugins: `vjf`, `dvr`, `svk`, `yup`. |
| **validationDebounceWait** | int | 250 | The number of milliseconds to delay. |
| **validationDebounceOptions** | object | { leading: false, trailing: true } | Lodash [_.debounce](https://lodash.com/docs/4.17.4#debounce) options. |
| **applyInputConverterOnInit** | boolean | true | If enabled, apply `input` converter on field `initialization` |
| **applyInputConverterOnSet** | boolean | true | If enabled, apply `input` converter on field `set()` |
| **applyInputConverterOnUpdate** | boolean | true | If enabled, apply `input` converter on field `update()` |
| **uniqueId** | function | - | Implement a function to create custom Fields IDs. Useful for SSR. Takes the fields instance in input. |


%accordion% **VERSION < 1.37** %accordion%

All the `AJV` options are moved into the plugin initialization.

For the previous version **< 1.37** you can use these in the constructor:

| Option | Type | Default | Info |
|---|---|---|---|
| **ajv** | object | - | Additional options for AJV. See all the details of [ajv options](https://github.com/epoberezkin/ajv#options) on the official github page of AJV. |
| **allowRequired** | boolean | false | The AJV json-schema `required` property can work only if the object does not contain the field key/value pair, `allowRequired` can remove it when needed to make `required` work properly. Be careful because enabling it will make `minLength` uneffective when the `string` is `empty`. |


%/accordion%

### Set Options On Form Constructor

```javascript
import Form from 'mobx-react-form';

const options = {
  showErrorsOnInit: true,
  showErrorsOnChange: false,
  autoParseNumbers: false,
  allowRequired: true,
  ...
};

new Form({ ... }, { options });
```

### Set Options On Extended Form Class

Using the `options()` method you can initialize the form options:

```javascript
class MyForm extends MobxReactForm {

  options() {
    return {
      showErrorsOnInit: true,
      autoParseNumbers: false,
      ...
    };
  }
}
```

> The object returned from the method will be merged to the object provieded to the constructor when initializing the instance.


### Set Options After Form Initialization

```javascript
form.state.options.set({
  validateOnInit: false,
  validateOnChange: false,
  strictUpdate: true,
});
```

### Get Current Form Options

```javascript
form.state.options.get();
```
```
=> {
  showErrorsOnInit: true,
  validateOnInit: false,
  validateOnChange: true,
  strictUpdate: false,
  showErrorsOnChange: false,
  defaultGenericError: true,
  allowRequired: false,
  ...
}
```

### Get Form Option by key

```javascript
form.state.options.get('showErrorsOnInit');
```
```
=> true
```

