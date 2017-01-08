# Getting Started

## Install

```bash
npm install --save mobx-react-form
```

#### Choose and Setup a Validation Plugin

> See [Validation Plugins & Modes](https://foxhound87.github.io/mobx-react-form/docs/validation/plugins.html)
 and [Supported Validation Packages](https://foxhound87.github.io/mobx-react-form/docs/validation/supported-packages.html) for more info.

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
  placeholder: 'Insert Email',
  rules: 'required|email|string|between:5,25',
}, {
  name: 'password',
  label: 'Password',
  placeholder: 'Insert Password',
  rules: 'required|string|between:5,25',
}, {
  name: 'passwordConfirm',
  label: 'Password Confirmation',
  placeholder: 'Confirm Password',
  rules: 'same:password',
}];
```

> You can also define `fields` as an `object`.

#### Define the Validation Handlers

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

> The Validation Handlers can be decoupled from the class as well.

#### Initialize the Form

Simply pass the `fields` and `plugins` objects to the constructor

```javascript
export default new MyForm({ fields, plugins });
```

#### Pass the form to a react component

The package provide some built-in and ready to use Event Handlers:

`onSubmit(e)`, `onClear(e)`, `onReset(e)` & [more...](https://foxhound87.github.io/mobx-react-form/docs/events/events-handlers.html)

```javascript
import React from 'react';
import { observer } from 'mobx-react';

export default observer(({ form, events }) => (
  <form onSubmit={form.onSubmit}>
    <label htmlFor={form.$('username').id}>
      {form.$('username').label}
    </label>
    <input {...form.$('username').bind()} />
    <p>{form.$('username').error}</p>

    ...

    <button type="submit" onClick={form.onSubmit}>Submit</button>
    <button type="button" onClick={form.onClear}>Clear</button>
    <button type="button" onClick={form.onReset}>Reset</button>

    <p>{form.error}</p>
  </form>
));
```

> Other Field Props are available. See the [docs](https://foxhound87.github.io/mobx-react-form/docs/api-reference/fields-properties.html) for more details.

