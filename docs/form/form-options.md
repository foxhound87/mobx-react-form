# Form Options

- [Options Object Properties](#options-object-properties)
- [Set Options On Form Constructor](#set-options-on-form-constructor)
- [Set Options On Extended Form Class](#set-options-on-extended-form-class)
- [Set Options After Form Initialization](#set-options-after-form-initialization)
- [Get Current Form Options](#get-current-form-options)
- [Get Form Option by key](#get-form-option-by-key)

[![Edit form-options](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/x7omz8rv9o)

---

### Options Object Properties

| Option | Type | Default | Info |
|---|---|---|---|
| **fallback** | boolean | true | Fields props definition fallback when using `mixed` definition mode (unified + separated). |
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
| **strictUpdate** | boolean | false | Throw an error if trying to update an undefined field. |
| **strictDelete** | boolean | true | Throw an error if trying to delete an undefined field. |
| **softDelete** | boolean | false | When using `del()` the field will not be deleted, instead its `deleted` prop will be switched to `true`. |
| **retrieveOnlyEnabledFieldsErrors** | boolean | false | Get only Enabled Fields Errors when using `get('error')` or the `errors()` helper. |
| **retrieveOnlyEnabledFieldsValues** | boolean | false | Get only Enabled Fields Values when using `get('value')` or the `values()` helper. |
| **retrieveOnlyDirtyFieldsValues** | boolean | false | Get only Dirty Fields Values when using `get('value')` or the `values()` helper. |
| **removeNullishValuesInArrays** | boolean | false | Remove nullish values from arrays when using `get('value')` or the `values()` helper. |
| **preserveDeletedFieldsValues** | boolean | false | After deleting and adding same field, the defined initial values will be preserverd if this option is activated. |
| **autoParseNumbers** | boolean | false | Try to parse strings to numbers automatically if the initial value of the field is a number. |
| **validationDebounceWait** | int | 250 | The number of milliseconds to delay. |
| **validationDebounceOptions** | object | { leading: false, trailing: true } | Lodash [_.debounce](https://lodash.com/docs/4.17.4#debounce) options. |
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
