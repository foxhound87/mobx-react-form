## Enabling Declarative Validation Rules

We are using [ValidatorJS](https://github.com/skaterdav85/validatorjs) to enable Declarative Validation Rules with automatic Error Messages.

### Install ValidatorJS
`ValidatorJS` it's not included in the package, so you have to install it manually.

```bash
npm install --save validatorjs
```

### Define a plugins object

We use `ValidatorJS` as **DVR** plugin.

```javascript
import validatorjs from 'validatorjs';

const plugins = {
  dvr: validatorjs,
};
```

### Add the `rules` property to the form fields

> Check the [Available Rules](https://github.com/skaterdav85/validatorjs#available-rules)

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'claudio',
    rules: 'required|string|between:5,15',
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
    rules: 'required|email|string|between:5,15',
  },
};
```

### Create the form passing all the objects

```javascript
new Form({ fields, plugins });
```
