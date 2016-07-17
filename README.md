# MobX Ajv Form

##### Easly manage Forms with MobX and automatic validation with AJV json-schema rules.

[![Travis Build](https://img.shields.io/travis/foxhound87/mobx-ajv-form.svg)](https://travis-ci.org/foxhound87/mobx-ajv-form)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/foxhound87/mobx-ajv-form/master.svg)](https://codecov.io/gh/foxhound87/mobx-ajv-form)
[![Package Version](https://img.shields.io/npm/v/mobx-ajv-form.svg)]()
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
npm i --save mobx-ajv-form
```

## Demo

http://www.webpackbin.com/E1khFEBrZ

## Usage

```javascript
import Form from 'mobx-ajv-form';

// define a json schema

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 }
  }
};

// define fields

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

// create the form

export default new Form({ fields, schema });
```

Pass the form to a react component:

```javascript
import React from 'react';
import { observer } from 'mobx-react';

const FormComponent = ({ form, handleOnSubmit }) => (
  <form>
    <input
      type="text"
      name={form.fields.username.name}
      value={form.fields.username.value}
      placeholder={form.fields.username.label}
      onChange={form.syncValue}
    />
    <p>{form.fields.username.errorMessage}</p>

    ...

    <button
      type="submit"
      disabled={!form.valid}
      onClick={handleOnSubmit}
    >Register</button>

    <p>{form.genericErrorMessage}</p>
  </form>
);

export default observer(FormComponent);
````

Deal with events:

```javascript
import form from './form';

export const handleOnSubmit = (e) => {
  e.preventDefault();

  if (!form.validate()) return;

  alert('Form is valid! Send the request here.');

  // get fields values
  console.log('Form Values', form.values());

  // clear the form
  form.clear();

  // or reset to the default initial values
  // form.reset();

  // or show a custom generic error
  form.invalidate('The user already exist.')

  // or update with new values
  // form.update({ username: 'Jonathan Ive' });
}
```

Use a custom validation function:

```javascript
const fields = {
  username: {
    label: 'Username',
    validate: (field, fields) => {
      // field.value() // get current field value
      // fields.anotherfield.value(); // get anotherfield value
      // do some validation stuff
      // return true / false
    },
  },
}
```
