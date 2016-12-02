# Getting Started

#### Choose and Setup a Validation Plugin

> See [Validation Plugins & Modes](validation/plugins)
 and [Supported Validation Packages](validation/supported-packages) for more info.

Below we are creating a `plugins` object using the `validatorjs` package to enable `DVR` functionalities (Declarative Validation Rules).

```javascript
import validatorjs from 'validatorjs';

const plugins = { dvr: validatorjs };
```

#### Define the Form Fields

Define the `fields` as a collection with a `rules` property for the validation.

```javascript
const fields = [{
  name: 'email',
  label: 'Email',
  rules: 'required|email|string|between:5,25',
}, {
  name: 'password',
  label: 'Password',
  rules: 'required|string|between:5,25',
}];
```

> You can also define `fields` as an `object`.

#### Define the Validation Events Handlers

```javascript
import MobxReactForm from 'mobx-react-form';

class MyForm extends MobxReactForm {

  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    // get field values
    console.log('Form Values!', form.values());
  }

  onError(form) {
    // get all form errors
    console.log('All form errors', form.errors());
    // invalidate the form with a custom error message
    form.invalidate('This is a generic error message!');
  }
}
```

> The Events Handler can be decoupled from the class as well.

#### Initialize the Form

Simply pass the `fields` and `plugins` objects to the constructor

```javascript
export default new MyForm({ fields, plugins });
```

#### Pass the form to a react component

The package provide those built-in and ready to use Event Handlers:

`onSubmit(e)`, `onClear(e)`, `onReset(e)`.

```javascript
import React from 'react';
import { observer } from 'mobx-react';

const FormComponent = ({ form, events }) => (
  <form onSubmit={form.onSubmit}>
    <input
      type="text"
      name={form.$('username').name}
      value={form.$('username').value}
      placeholder={form.$('username').label}
      onChange={form.$('username').sync}
    />
    <p>{form.$('username').error}</p>

    ...

    <button type="submit" onClick={form.onSubmit}>Submit</button>
    <button type="button" onClick={form.onClear}>Clear</button>
    <button type="button" onClick={form.onReset}>Reset</button>

    <p>{form.error}</p>
  </form>
);

export default observer(FormComponent);
```
