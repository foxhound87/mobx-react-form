## Defining Fields

### Define Empty Fields

> The `label` will be automatically named using the field `name`

as an array with empty values:

```javascript
const fields = ['username', 'password']
```

or as an object of values:

```javascript
const fields = {
  username: '',
  password: '',
};
```

then pass it to the Form constructor:

```javascript
new Form({ fields });
```

## Defining Fields with Unified propreties using an Object

### Define Fields with Initial State

```javascript
const fields = {
  username: 'SteveJobs',
  password: 'thinkdifferent',
};
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
```

### Define Fields with Default Value (on reset)

> The initial state will be re-setted on form `reset` using the `default` value.

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    default: '...',
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
    default: '...',
  }
};
```

In this case the fields will be filled with the `value` property when the form is initialized, and will be filled with the default only on form `reset`.

### Set `related` fields to be validated at the same time

```javascript
const fields = {
  email: {
    label: 'Email',
    validate: isEmail,
    related: ['emailConfirm'], // <<---
  },
  emailConfirm: {
    label: 'Confirm Email',
    validate: [isEmail, shouldBeEqualTo('email')],
  },
};
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
```

<br>

## Define Fields Properties Separately

### Defining Values

If you want to provide a simple `values` object with only the initial state (for example by directly passing an object of a DB query):

> The form values provided will implicitly initialize a new field.

```javascript
const values = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
};

new Form({ values });
```

### Defining Labels

you can set the Labels for each fields separately creating a `labels` object and passing it to the form costructor:

```javascript
...

const labels = {
  username: 'Username',
  email: 'Email',
};

new Form({ values, labels });
```

If you need to initialize fields **without initial state** you have to define a `fields` object as an array with the additional `fields`, otherwise the field will not be created:

```javascript
const fields = ['username', 'email', 'password', 'passwordConfirm'];

const values = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
};

const labels = {
  username: 'Username',
  email: 'Email',
  password: 'Password',
};

new Form({ fields, values, labels });
```

### Defining Defaults

You can pass **default values** separately defining a `defaults` object to pass to the form initializer.

In the example below, the fields does not have initial state, so when the form is initialized, the fields value will be empty.

> The initial state will be re-setted on form `reset` using the `default` value.

```javascript
const fields = ['username', 'email'];

const defaults = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
};

new Form({ fields, defaults, ... });
```


### Defining Disabled

You can pass **disabled fields** separately defining a `disabled` object to pass to the form initializer:

```javascript
const fields = ['username', 'email'];

const disabled = {
  username: true,
  email: false,
};

new Form({ fields, disabled, ... });
```

### Defining Related

You can also define **related fields** to validate at the same time defining a `related` object to pass to the form initializer:

```javascript
const fields = ['email', 'emailConfirm'];

const related = {
  email: ['emailConfirm'], // <<---
};

new Form({ fields, related, ... });
```

<br>

## Define Separated Validation Objects

### Using Vanilla Javascript Validation Functions (VJF)

```javascript
const fields = ['email', 'emailConfirm'];

const validate = {
  email: isEmail,
  emailConfirm: [isEmail, shouldBeEqualTo('email')],
};

new Form({ fields, validate, ... });
```

> Read more about how to [Enable Vanilla Javascript Validation Functions (VJF)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingVJFValidation.md)

### Using Declarative Validation Rules (DVR)

```javascript
const fields = ['email', 'password'];

const rules = {
  email: 'required|email|string|between:5,25',
  password: 'required|string|between:5,25',
};

new Form({ fields, rules, ... });
```
> Read more about how to [Enable Declarative Validation Rules (DVR)](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingDVRValidation.md)

### Using Json Schema Validation Keywords (SVK)

```javascript
const fields = ['username', 'password'];

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 }
  }
};

new Form({ fields, schema, ... });
```
> Read more about how to [Enable Json Schema Validation Keywords (SVK)
](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingSVKValidation.md)
