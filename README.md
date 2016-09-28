# MobX React Form
> A.K.A. `mobx-ajv-form` (deprecated). Use `mobx-react-form` instead.

##### Automagically manage React forms state and automatic validation with MobX.

[![Travis Build](https://img.shields.io/travis/foxhound87/mobx-react-form.svg)](https://travis-ci.org/foxhound87/mobx-react-form)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/foxhound87/mobx-react-form/master.svg)](https://codecov.io/gh/foxhound87/mobx-react-form)
[![Downloads](https://img.shields.io/npm/dt/mobx-ajv-form.svg)]()
[![npm](https://img.shields.io/npm/v/mobx-react-form.svg)]()
[![node](https://img.shields.io/node/v/mobx-react-form.svg)]()
[![GitHub license](https://img.shields.io/github/license/foxhound87/mobx-react-form.svg)]()

[![NPM](https://nodei.co/npm/mobx-react-form.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mobx-react-form/)

---

<br>

## Changelog & Documentation
See the [Changelog](https://github.com/foxhound87/mobx-react-form/blob/master/CHANGELOG.md) or the [Documentation](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md) for all the details.

## Install

```bash
npm install --save mobx-react-form
```

## Demo

https://mobx-react-form-demo-bbtfrgtrzh.now.sh

## Tutorial
[Automagically manage React forms state and automatic validation with MobX](https://medium.com/@foxhound87/automagically-manage-react-forms-state-with-mobx-and-automatic-validation-2b00a32b9769)

## Features

- Automatic Reactive Form State Management with MobX Magic
- Automatic Reactive Validation & Error Messages
- Validation Plugins & Multiple Validation Styles
- Support for Sync & Async Validation functions
- Support for Material UI, React Widgets, React Select

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

    <button type="submit">Submit</button>
    <button onClick={form.onReset}>Reset</button>
    <button onClick={form.onClear}>Clear</button>

    <p>{form.error}</p>
  </form>
);

export default observer(FormComponent);
```

<br>

## Documentation Index

- [Defining the Form Fields](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md)
- [Form Initialization](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormInit.md)
- [Form Actions](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormActions.md)
- [Form Events](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormEvents.md)
- [Form Options](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#form-options)
- [Validation Plugins](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#validation-plugins)
- [Form API List](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormApi.md)
- [Fields API List](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FieldsApi.md)
- [Supported Validation Packages](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#supported-validation-packages)
- [Remove AJV Warnings from webpack](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingSVKValidation.md#remove-ajv-warnings-from-webpack)

<br>

## Plugins Extensions

###### VALIDATION MODES
- [Enabling Vanilla Javascript Validation Functions (VJF)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingVJFValidation.md)
- [Enabling Json Schema Validation Keywords (SVK)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingSVKValidation.md)
- [Enabling Declarative Validation Rules (DVR)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingDVRValidation.md)

###### EXTEND VALIDATION
- [Custom Vanilla Javascript Validation Functions](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationFunctions.md)
- [Custom Json Schema Validation Keywords (extend)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationKeywords.md)
- [Custom Declarative Validation Rules (extend)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationRules.md)

###### ASYNC VALIDATION
- [Async Vanilla Javascript Validation Functions](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationFunctions.md#async-validation-functions)
- [Async Json Schema Validation Keywords](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationKeywords.md#async-validation-keywords)
- [Async Declarative Validation Rules](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationRules.md#async-validation-rules)

<br>

## Contributing

If you want to contribute to the development, do not hesitate to fork the repo and send pull requests.

And don't forget to star the repo, I will ensure more frequent updates! Thanks!

