## Defining Flat Fields as Unified Properties

Define a `fields` object, then you can define these properties in each field definition:

`value`, `label`, `placeholder`, `default`, `initial`, `disabled`, `deleted`, `type`, `related`, `rules`,  `options`, `bindings`, `extra`, `hooks`, `handlers`, `validatedWith`, `validators`, `observers`, `interceptors`, `input`, `output`, `autoFocus`, `inputMode`, `ref`.

Validation properties `rules` (DVR) and `validators` (VJF) can be defined as well.

<br>

### Define Empty Fields

```javascript
const fields = {
  username: '',
  password: '',
};

new Form({ fields, ... });
```

### Define Empty Fields with Labels

```javascript
const fields = {
  username: {
    label: 'Username',
  },
  password: {
    label: 'Password',
  }
};

new Form({ fields, ... });
```

### Define Fields with Labels and Initial State

> The initial state will be re-setted on form `reset` using `value`.

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
  }
};

new Form({ fields, ... });
```

### Define Specific Fields Options

Create an `option` object inside a field definition.

The availables options are the same of the [Form Options](../../form/form-options.md)

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    options: {
      validateOnChange: true,
    }
  },
};

new Form({ fields, ... });
```

### Define Fields with Default Value (on reset)

> The initial state will be re-setted on form `reset` using the `default` value.

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    default: '',
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
    default: '',
  }
};

new Form({ fields, ... });
```

> In this case on `reset` will set the fields to empty values (istead of the initial values).

In this case the fields will be filled with the `value` property when the form is initialized, and will be filled with the default only on form `reset`.

### Set `related` fields to be validated at the same time

```javascript
const fields = {
  email: {
    label: 'Email',
    validators: isEmail,
    related: ['emailConfirm'], // <<---
  },
  emailConfirm: {
    label: 'Confirm Email',
    validators: [isEmail, shouldBeEqualTo('email')],
  },
};

new Form({ fields, ... });
```

## Define Fields as Array of Objects

> You must define a `name` property for each object.

The `name` property will set the `key` of the fields, if you don't specify it the field will not be created.

```javascript
const fields = [{
  name: 'username',
  label: 'Username',
  value: 'SteveJobs',
}, {
  name: 'email',
  label: 'Email',
  value: 's.jobs@apple.com',
}];

new Form({ fields, ... });
```

<br>
