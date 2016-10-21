# Form Options

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

### Set Options On Form Initialization

```javascript
import Form from 'mobx-react-form';

// these are the default options
const options = {
  showErrorsOnInit: false,
  validateOnInit: true,
  validateOnChange: true,
  strictUpdate: false,
  showErrorsOnUpdate: true,
  defaultGenericError: null,
  loadingMessage: null,
  allowRequired: false,
};

new Form({ options, ... });
```

### Set Options After Form Initialization

```javascript
form.options({
  validateOnInit: false,
  validateOnChange: false,
  strictUpdate: true,
});
```

### Get Current Form Options

```javascript
form.options();
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
form.options('showErrorsOnInit');
```
```
=> true
```
