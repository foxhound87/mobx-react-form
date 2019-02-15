# Getting Started

[![Edit form-quickstart](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/nrrZgG8y4)

## Install

```bash
npm install --save mobx-react-form
```

#### Choose and Setup a Validation Plugin

> See [Validation Plugins](validation/plugins.html) for more info on supported packages.

Below we are creating a `plugins` object using the `validatorjs` package to enable `DVR` functionalities (Declarative Validation Rules).

```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

const plugins = {
  dvr: dvr(validatorjs),
};
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
  rules: 'required|string|same:password',
}];
```

> You can also define `fields` as an `object`.

#### Define the Validation Hooks

```javascript
const hooks = {
  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    // get field values
    console.log('Form Values!', form.values());
  },
  onError(form) {
    alert('Form has errors!');
    // get all form errors
    console.log('All form errors', form.errors());
  }
}
```

#### Initialize the Form

Simply pass the `fields`, `plugins` and `hooks` objects to the constructor

```javascript
import MobxReactForm from 'mobx-react-form';

const form = new MobxReactForm({ fields }, { plugins, hooks });
```

#### Pass the form to a react component

The package provide some built-in and ready to use Event Handlers:

`onSubmit(e)`, `onClear(e)`, `onReset(e)` & [more...](events/event-handlers.html)

```javascript
import React from 'react';
import { observer } from 'mobx-react';


export default observer(({ form }) => (
  <form>
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

###### Extending the Form class

[See how to implement the same configuration of this quickstart extending the Form class](quick-start-class.html)

