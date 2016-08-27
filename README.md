# MobX Ajv Form

##### Easly manage Forms with MobX and automatic validation with AJV json-schema rules.

[![Travis Build](https://img.shields.io/travis/foxhound87/mobx-ajv-form.svg)](https://travis-ci.org/foxhound87/mobx-ajv-form)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/foxhound87/mobx-ajv-form/master.svg)](https://codecov.io/gh/foxhound87/mobx-ajv-form)
[![Downloads](https://img.shields.io/npm/dt/mobx-ajv-form.svg)]()
[![npm](https://img.shields.io/npm/v/mobx-ajv-form.svg)]()
[![node](https://img.shields.io/node/v/mobx-ajv-form.svg)]()
[![GitHub license](https://img.shields.io/github/license/foxhound87/mobx-ajv-form.svg)]()

[![NPM](https://nodei.co/npm/mobx-ajv-form.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mobx-ajv-form/)

---


## Changelog & Documentation
See the [Changelog](https://github.com/foxhound87/mobx-ajv-form/blob/master/CHANGELOG.md) or the [Documentation](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md) for all the details.

## Install

```bash
npm install --save mobx-ajv-form
```

## Demo

http://www.webpackbin.com/VJZUlhWc-

## Usage

#### Define the form fields

> Optionally using a `default` property, it will fill the field on `reset` instead of using the initial `value`.

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs'
    default: '',
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

#### Define a json schema

```javascript
const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 }
  }
};
```

#### Create the form

> Simply pass the `fields` and `schema` objects to the constructor

```javascript
import Form from 'mobx-ajv-form';

...

export default new Form({ fields, schema });
```

#### Pass the form to a react component:

> `form.$('fieldkey')` is a shortcut to `form.fields.fieldkey`

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
      onChange={form.syncValue}
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

#### Deal with events:

```javascript
const handleOnSubmit = (e) => {
  e.preventDefault();

  // check if the form is valid, otherwise exit
  if (!form.validate()) return;

  alert('Form is valid! Send the requrest here.');

  // get fields values
  console.log('Form Values', form.values());

  // or show a custom generic error after a beckend call
  form.invalidate('The user already exist.');
}

const handleOnClear = (e) => {
  e.preventDefault();

  // clear the form
  form.clear();
}

const handleOnReset = (e) => {
  e.preventDefault();

  // reset to the default initial values
  form.reset();
}
```

# More...

- [Form Constructor](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#form-constructor)
- [Form Options](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#form-options)
- [Form API](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#form-api)
- [Fields API](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#fields-api)
- [Custom Validation Keywords (extend AJV)](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#custom-validation-keywords-extend-ajv)
- [Custom Validation Functions (without AJV)](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#custom-validation-functions-without-ajv)
- [Remove AJV Warnings from webpack](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#remove-ajv-warnings-from-webpack)

## Contributing

If you want to contribute to the development, do not hesitate to fork the repo and send pull requests.

And don't forget to star the repo, I will ensure more frequent updates! Thanks!

