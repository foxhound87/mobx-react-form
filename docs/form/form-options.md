# Form Options

* [Options Object Properties](#options-object-properties)
* [Set Options On Form Constructor](#set-options-on-form-constructor)
* [Set Options On Extended Form Class](#set-options-on-extended-form-class)
* [Set Options After Form Initialization](#set-options-after-form-initialization)
* [Get Current Form Options](#get-current-form-options)
* [Get Form Option by key](#get-form-option-by-key)

---

### Options Object Properties

| Option | Type | Default | Info |
|---|---|---|---|
| **defaultGenericError** | string | null | Set e default message to show when a generic error occurs. |
| **alwaysShowDefaultError** | boolean | false | The `defaultGenericError` is shown only when `invalidate()` is called. Set this to `true` and it will be always shown on validation errors. |
| **submitThrowsError** | boolean | true | If true and `defaultGenericError` is defined throws error and invalidate if validation fails on submit. |
| **showErrorsOnInit** | boolean | false | Show or hide error messages `on init` for `validateOnInit`. |
| **showErrorsOnSubmit** | boolean | true | Show or hide error messages `on submit`. |
| **showErrorsOnBlur** | boolean | true | Show or hide error messages `on blur`. |
| **showErrorsOnUpdate** | boolean | false | Show or hide errors `on update`. |
| **showErrorsOnClear** | boolean | false | Show or hide errors `on clear`. |
| **showErrorsOnReset** | boolean | true | Show or hide errors `on clear`. |
| **validateOnInit** | boolean | true | Validate of the whole form on initilization. |
| **validateOnChange** | boolean | true | Validate fields when their value changes. |
| **strictUpdate** | boolean | false | Throw an error if trying to update an undefined field. |
| **strictDelete** | boolean | true | Throw an error if trying to delete an undefined field. |
| **validationDebounceWait** | int | 250 | The number of milliseconds to delay. |
| **validationDebounceOptions** | object | { leading: true } | Lodash [_.debounce](https://lodash.com/docs/4.17.4#debounce) options. |
| **autoParseNumbers** | boolean | false | Try to parse strings to numbers automatically if the initial value of the field is a number. |
| **allowRequired** | boolean | false | The json-schema `required` property can work only if the object does not contain the field key/value pair, `allowRequired` can remove it when needed to make `required` work properly. Be careful because enabling it will make `minLength` uneffective when the `string` is `empty`. |
| **ajv** | object | - | Additional options for AJV. See all the details of [ajv options](https://github.com/epoberezkin/ajv#options) on the official github page of AJV. |

### Set Options On Form Constructor

```javascript
import Form from 'mobx-react-form';

const options = {
  showErrorsOnInit: true,
  showErrorsOnUpdate: false,
  autoParseNumbers: false,
  allowRequired: true,
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
  validateOnInit: `false,
  validateOnChange: true,
  strictUpdate: false,
  showErrorsOnUpdate: false,
  defaultGenericError: true,
  allowRequired: false,
}
```

### Get Form Option by key

```javascript
form.state.options.get('showErrorsOnInit');
```
```
=> true
```
