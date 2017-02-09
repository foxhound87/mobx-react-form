# Form Options

| Option | Type | Default | Info |
|---|---|---|---|
| **showErrorsOnUpdate** | boolean | true | Show validation errors after an update. |
| **showErrorsOnInit** | boolean | false | Show or hide error messages for `validateOnInit`. |
| **validateOnInit** | boolean | true | Validate of the whole form on initilization. |
| **validateOnChange** | boolean | true | Validate fields when their value changes. |
| **strictUpdate** | boolean | false | Throw an error if trying to update an undefined field. |
| **strictDelete** | boolean | true | Throw an error if trying to delete an undefined field. |
| **autoParseNumbers** | boolean | false | Try to parse strings to numbers automatically if the initial value of the field is a number. |
| **alwaysShowDefaultError** | boolean | false | The `defaultGenericError` is shown only when `invalidate()` is called. Set this to `true` and it will be always shown on validation errors. |
| **defaultGenericError** | string | null | Set e default message to show when a generic error occurs. |
| **loadingMessage** | string | null | Set a global loading message to show during async calls. |
| **allowRequired** | false | boolean | The json-schema `required` property can work only if the object does not contain the field key/value pair, `allowRequired` can remove it when needed to make `required` work properly. Be careful because enabling it will make `minLength` uneffective when the `string` is `empty`. |
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

> The object returned from the method will be deep-merged to the object provieded to the constructor when initializing the instance.


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
  loadingMessage: null,
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
