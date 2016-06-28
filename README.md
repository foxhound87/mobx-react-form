# MobX Ajv Form

##### Easly manage Forms with MobX and automatic validation with AJV json-schema rules.

---

## API Documentation
See the [Changelog](https://github.com/foxhound87/mobx-ajv-form/blob/master/CHANGELOG.md) or the [Documentation](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md) for all the details.

## Install

```bash
npm i --save mobx-ajv-form
```

## Demo

http://www.webpackbin.com/E1khFEBrZ

## Usage

```
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

````
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

```
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
}
```
