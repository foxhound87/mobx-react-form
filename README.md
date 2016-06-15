# [Mobx](https://www.npmjs.com/package/mobx)-Form

Simple helper for state management

TODO:

- Add examples
- Add unit tests
- Add better documentation

## Install

```bash
npm i --save mobx mobx-form
```

## Usage

```bash
import { createModel } from 'mobx-form';

createModel({
  email: '',
}, {
  email: {
    fn(field) {
      // return true/false
      // return Promise.reject({ error: 'some error '}) // will be used as error message
    }
  }
})

```

## Example:

```javascript
import { createModel } from 'mobx-form';

const model = this.model = createModel({
  email: '', // initial value for email
  password: '', // initial value for password
}, {
  // validator for email
  email: {
    interactive: false,
    // validator function
    fn(field) {
      const email = trim(field.value);
      // super simple and naive email validation
      if (!email || !(email.indexOf('@') > 0)) {
        return Promise.reject({
          error: 'Please provide an error message'
        });
      }
    },
  },
  // validator for password
  password: {
    interactive: false,
    // validator function
    fn(field) {
      if (!trim(field.value)) {
        return Promise.reject({
          error: 'Please provide your password'
        });
      }
    },
  },
});
```