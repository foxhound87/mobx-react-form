# Getting Started (class)

[![Edit form-quickstart-class](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lyj5p91x5z)

## Install

```bash
npm install --save mobx-react-form
```

#### Choose and Setup a Validation Plugin

> See [Validation Plugins & Modes](validation/plugins.html)
 and [Supported Validation Packages](validation/supported-packages.html) for more info.

#### Define the Form Class

```javascript
import { Form } from 'mobx-react-form';
import validatorjs from 'validatorjs';

export default class MyForm extends Form {

  /*
    Below we are returning a `plugins` object using the `validatorjs` package
    to enable `DVR` functionalities (Declarative Validation Rules).
  */
  plugins() {
    return { dvr: validatorjs };
  }

  /*
    Return the `fields` as a collection into the `setup()` method
    with a `rules` property for the validation.
  */
  setup() {
    return {
      fields: [{
        name: 'email',
        label: 'Email',
        placeholder: 'Insert Email',
        rules: 'required|email|string|between:5,25',
        value: 's.jobs@apple.com'
      }, {
        name: 'password',
        label: 'Password',
        placeholder: 'Insert Password',
        rules: 'required|string|between:5,25',
      }, {
        name: 'passwordConfirm',
        label: 'Password Confirmation',
        placeholder: 'Confirm Password',
        rules: 'required|string|same:password',
      }],
    };
  }

  /*
    Event Hooks
  */
  hooks() {
    return {
      /*
        Success Validation Hook
      */
      onSuccess(form) {
        alert('Form is valid! Send the request here.');
        // get field values
        console.log('Form Values!', form.values());
      },
      /*
        Error Validation Hook
      */
      onError(form) {
        alert('Form has errors!');
        // get all form errors
        console.log('All form errors', form.errors());
      }
    };
  }
}
```

#### Initialize the Form

Now we can create our form instance:

```javascript
const form = new MyForm();
```

#### Pass the form to a react component

The package provide some built-in and ready to use Event Handlers:

`onSubmit(e)`, `onClear(e)`, `onReset(e)` & [more...](events/event-handlers.html)

```javascript
import React from 'react';
import { observer } from 'mobx-react';

export default observer(({ form }) => (
  <form onSubmit={form.onSubmit}>
    <label htmlFor={form.$('username').id}>
      {form.$('username').label}
    </label>
    <input {...form.$('username').bind()} />
    <p>{form.$('username').error}</p>

    {/* ... other inputs ... */}

    <button type="submit" onClick={form.onSubmit}>Submit</button>
    <button type="button" onClick={form.onClear}>Clear</button>
    <button type="button" onClick={form.onReset}>Reset</button>

    <p>{form.error}</p>
  </form>
));
```

> Other Field Props are available. See the [docs](api-reference/fields-properties.html) for more details.
