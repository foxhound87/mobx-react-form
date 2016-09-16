# MobX React Form
> A.K.A. `mobx-ajv-form` (deprecated). Use `mobx-react-form` instead.

##### Automagically manage React forms state with MobX and automatic validation.

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

https://mobx-react-form-demo-zgltrpjjwi.now.sh/

## Features

- Automatic Reactive Form State Management with MobX Magic
- Automatic Reactive Validation & Error Messages
- Validation Plugins & Multiple Validation Styles
- Support for Sync & Async Validation functions
- Support for Material UI, React Widgets, React Select

## Usage

#### Define the form fields

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs'
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com'
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent'
  }
};
```

#### Choose and Setup a Validation Plugin

Below we are creating a `plugins` object using the `validatorjs` package to enable `DVR` functionalities (Declarative Validation Rules).

> See [Validation Plugins](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#validation-plugins)
 and [Supported Validation Packages](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#supported-validation-packages) for more info.


```javascript
import validatorjs from 'validatorjs';

const plugins = { dvr: validatorjs };
```

#### Create the form

Simply pass the `fields` and `plugins` objects to the constructor

```javascript
import Form from 'mobx-react-form';

export default new Form({ fields, plugins });
```

Now define a `rules` property on the form fields as shown [here](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingDVRValidation.md#add-the-rules-property-to-the-form-fields).

#### Pass the form to a react component

```javascript
import React from 'react';
import { observer } from 'mobx-react';

const FormComponent = ({ form, events }) => (
  <form>
    <input
      type="text"
      name={form.$('username').name}
      value={form.$('username').value}
      placeholder={form.$('username').label}
      onChange={form.$('username').sync}
    />
    <p>{form.$('username').error}</p>

    ...

    <button
      type="submit"
      disabled={!form.isValid}
      onClick={events.handleOnSubmit}
    >Submit</button>

    <button
      type="submit"
      onClick={events.handleOnReset}
      >Reset</button>

    <button
      type="submit"
      onClick={events.handleOnClear}
      >Clear</button>

    <p>{form.error}</p>
  </form>
);

export default observer(FormComponent);
```

> `form.$('fieldkey')` is a shortcut to `form.fields.fieldkey`

#### Deal with events

###### handleOnSubmit

```javascript
  handleOnSubmit = (e) => {
    e.preventDefault();

    form.validate()
      .then((isValid) => isValid
        ? onSuccess()
        : onError());
  };

  onError() {
    // get all form errors
    console.log('All form errors', form.errors());
    // invalidate the form with a custom error message
    form.invalidate('This is a generic error message!');
  }

  onSuccess() {
    alert('Form is valid! Send the request here.');
    // get field values
    console.log('Form Values!', form.values());
  }
```

###### handleOnClear

```javascript
handleOnClear = (e) => {
  e.preventDefault();
  // clear the form
  form.clear();
}
```

###### handleOnReset

```javascript
handleOnReset = (e) => {
  e.preventDefault();
  // reset to the default initial values
  form.reset();
}
```

<br>

## Documentation Index

- [Defining the Form Fields](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md)
- [Form Initialization](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#form-initialization)
- [Form Actions](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormActions.md)
- [Validation Plugins](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#validation-plugins)
- [Form Options](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#form-options)
- [Form API List](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FormApi.md)
- [Fields API List](https://github.com/foxhound87/mobx-react-form/blob/master/docs/FieldsApi.md)
- [Supported Validation Packages](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#supported-validation-packages)
- [Remove AJV Warnings from webpack](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#remove-ajv-warnings-from-webpack)

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
- [Async Json Schema Validation Keywords](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationKeywords.md#async-validation-keywords)
- [Async Declarative Validation Rules](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationRules.md#async-validation-rules)
- [Async Vanilla Javascript Validation Functions](https://github.com/foxhound87/mobx-react-form/blob/master/docs/CustomValidationFunctions.md#async-validation-functions)

## Contributing

If you want to contribute to the development, do not hesitate to fork the repo and send pull requests.

And don't forget to star the repo, I will ensure more frequent updates! Thanks!

