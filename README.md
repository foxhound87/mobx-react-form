# MobX React Form

##### Automagically manage React forms state and automatic validation with MobX.

[![Travis Build](https://img.shields.io/travis/foxhound87/mobx-react-form/master.svg)](https://travis-ci.org/foxhound87/mobx-react-form)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/foxhound87/mobx-react-form/master.svg)](https://codecov.io/gh/foxhound87/mobx-react-form)
[![Downloads](https://img.shields.io/npm/dt/mobx-ajv-form.svg)]()
[![npm](https://img.shields.io/npm/v/mobx-react-form.svg)]()
[![node](https://img.shields.io/node/v/mobx-react-form.svg)]()
[![GitHub license](https://img.shields.io/github/license/foxhound87/mobx-react-form.svg)]()

[![NPM](https://nodei.co/npm/mobx-react-form.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mobx-react-form/)

---

<br>

## Changelog & Documentation
See the [Changelog](https://github.com/foxhound87/mobx-react-form/blob/master/CHANGELOG.md) or the [Documentation](https://foxhound87.github.io/mobx-react-form) for all the details.

## Demo

https://mobx-react-form-demo-bbtfrgtrzh.now.sh

## Tutorial
[Automagically manage React forms state and automatic validation with MobX](https://medium.com/@foxhound87/automagically-manage-react-forms-state-with-mobx-and-automatic-validation-2b00a32b9769)

## Features

- Automatic Reactive Form State Management with MobX Magic
- Automatic Reactive Validation & Error Messages
- Validation Plugins & Multiple Validation Styles
- Nested Fields (w/ Validation)
- Sync & Async Validation functions
- Support for Material UI, React Widgets, React Select

## Install

```bash
npm install --save mobx-react-form
```

## Usage

#### Choose and Setup a Validation Plugin

> See [Validation Plugins](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#validation-plugins)
 and [Supported Validation Packages](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#supported-validation-packages) for more info.

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

`onSubmit(e)`, `onSuccess(e)`, `onError(e)`.

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

<br>

## Contributing

If you want to contribute to the development, do not hesitate to fork the repo and send pull requests.

And don't forget to star the repo, I will ensure more frequent updates! Thanks!

