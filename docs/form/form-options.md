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
| **validateOnClear** | boolean | false | Validate fields value `on clear`. |
| **validateOnReset** | boolean | false | Validate fields value `on reset`. |
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
| **bubbleUpErrorMessages** | boolean | false | If enabled, the `error` getter on container fields and forms will return the first error message found in nested child fields, instead of `null`. |
| **stopValidationOnError** | boolean | false | If enabled, the validation stops to validate the field with new validation driver (and its functions) if has alredy marked invalid. |
| **resetValidationBeforeValidate** | boolean | true | If disabled, the validation state will not be resetted to its initials before `validate` (experimental) |
| **validationPluginsOrder** | string[] | undefined | Specify an array of strings with the validation plugins order. Accepted Plugins: `vjf`, `dvr`, `svk`, `yup`, `zod`, `joi`. |
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


%/accordion%

### Set Options On Form Constructor

```javascript
import Form from 'mobx-react-form';

const options = {
  showErrorsOnInit: true,
  showErrorsOnChange: false,
  autoParseNumbers: false,
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

---

## Practical Examples

### Debounced Validation (`validationDebounceWait`, `validationDebounceOptions`)

Control the debounce behavior of validation on change/blur. Useful for search-as-you-type or expensive validations:

```javascript
const options = {
  validateOnChange: true,
  validationDebounceWait: 500,       // wait 500ms after last change
  validationDebounceOptions: {
    leading: false,                   // don't fire immediately
    trailing: true,                   // fire after the wait period
    maxWait: 2000,                    // force execution at most every 2s
  },
};
```

### Validation Plugin Order (`validationPluginsOrder`)

When using multiple validation plugins, specify the order in which they run. The first plugin to find an error sets the message:

```javascript
const options = {
  validationPluginsOrder: ['vjf', 'dvr', 'svk'], // run VJF first, then DVR, then SVK
};
```

### Bubble Up Error Messages (`bubbleUpErrorMessages`)

When enabled, container fields (groups) will show the first error from their child fields instead of `null`:

```javascript
const options = {
  bubbleUpErrorMessages: true, // form.$('address').error shows first child error
};

// Without this, form.$('address').error is null even if child fields have errors
// With this enabled, it returns the first error found in child fields
```

### Stop Validation on First Error (`stopValidationOnError`)

Prevent further validation after a field is marked invalid — useful for performance:

```javascript
const options = {
  stopValidationOnError: true, // skip validation for already-invalid fields
};
```

### Auto Trim (`autoTrimValue`)

Automatically trim whitespace from string values on every change:

```javascript
const options = {
  autoTrimValue: true, // "  hello  " → "hello"
};
```

### Soft Delete (`softDelete` + `deleted`)

Instead of removing fields with `del()`, mark them as deleted. The field still exists in the form but is excluded from validation and serialization:

```javascript
const options = {
  softDelete: true,
  validateDeletedFields: false,   // don't validate deleted fields
};

// Later:
form.$('hobbies').del(1);  // marks field as deleted, doesn't remove it
form.$('hobbies[1]').deleted; // => true
```

### Validate Only After Initial Blur (`validateOnChangeAfterInitialBlur`)

Start validating on change only after the user has left the field at least once:

```javascript
const options = {
  validateOnChange: false,                    // don't validate on change initially
  validateOnChangeAfterInitialBlur: true,     // validate on change only after first blur
  showErrorsOnChange: true,
};
```

### Validate Only After First Submit (`validateOnChangeAfterSubmit`)

Start validating on change only after the first form submission:

```javascript
const options = {
  validateOnChangeAfterSubmit: true,          // validate on change only after first submit
  showErrorsOnChange: true,
};
```

### Auto Parse Numbers (`autoParseNumbers`)

Automatically convert string input to numbers when the initial field value is a number:

```javascript
const options = {
  autoParseNumbers: true,
};

const fields = {
  price: { value: 10, type: 'text' }, // initial is number
};
// User types "20" → stored as number 20, not string "20"
```

### Fallback Value (`fallbackValue`)

The default value used when a field is cleared or created without an explicit value:

```javascript
const options = {
  fallbackValue: null, // default is ""
};

// Now form.$('myField').clear() sets value to null instead of ""
```

### Default Generic Error (`defaultGenericError`) & `submitThrowsError`

Set a generic error message on the form when validation fails, and control whether `submit()` throws:

```javascript
const options = {
  defaultGenericError: 'Please fix the errors before submitting.',
  submitThrowsError: false,   // don't throw, just show error
};
```

### Retrieve Only Specific Field Values (`retrieveOnlyEnabledFieldsValues`, `retrieveOnlyDirtyFieldsValues`)

Filter field values when calling `form.values()` or `get('value')`:

```javascript
const options = {
  retrieveOnlyEnabledFieldsValues: true,   // exclude disabled fields
  retrieveOnlyDirtyFieldsValues: true,     // exclude unchanged fields
};
```

### Nullify Empty Strings (`retrieveNullifiedEmptyStrings`)

Convert empty strings to `null` when retrieving values:

```javascript
const options = {
  retrieveNullifiedEmptyStrings: true,     // "" → null
};
```

### Preserve Deleted Field Values (`preserveDeletedFieldsValues`)

When using `softDelete`, preserve initial values so that re-adding the same field restores its original data:

```javascript
const options = {
  softDelete: true,
  preserveDeletedFieldsValues: true,
};
```

### Custom Unique ID Generator (`uniqueId`)

Generate deterministic field IDs — useful for SSR to avoid hydration mismatches:

```javascript
const options = {
  uniqueId: (field) => `${field.path}-${Date.now()}`,
};
```

### Filter Nullish Values in Arrays (`removeNullishValuesInArrays`)

When getting field values, remove `null`, `undefined`, and `""` from arrays:

```javascript
const options = {
  removeNullishValuesInArrays: true,  // [1, null, 3, ""] → [1, 3]
};
```

### Input Converter Control (`applyInputConverterOnInit`, `applyInputConverterOnSet`, `applyInputConverterOnUpdate`)

Control when the `input` converter function is applied:

```javascript
const options = {
  applyInputConverterOnInit: true,     // apply converter on field creation
  applyInputConverterOnSet: true,      // apply converter on set()
  applyInputConverterOnUpdate: true,   // apply converter on update()
};
```
