## Defining Flat Fields as Separated Properties

You can define these properties: `fields`, `values`, `labels`, `placeholders`, `defaults`, `disabled`, `related`, `bindings`, `types`, `options`, `extra`, `hooks`, `handlers`.

Validation properties `rules` (DVR) and `validators` (VJF) can be defined as well.

You can eventuallu define the `fields` property as a fields `structure`.

<br>

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

### Defining Initials

You can pass **initials values** separately defining a `initials` object to pass to the form initializer.

The Initial values are applied on init only if the value property is not provided.

```javascript
const fields = ['username', 'email'];

const initials = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
};

new Form({ fields, initials, ... });
```

> This is useful for handling initial values for deep nested fields.

### Defining Defaults

You can pass **defaults values** separately defining a `defaults` object to pass to the form initializer.

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

### Defining Bindings

You can define the **bindings** name of a pre-defined `rewriter` or `template`.

```javascript
const fields = ['email'];

const bindings = {
  email: 'EmailBinding', // <<---
};

new Form({ fields, bindings, ... });
```

[Read more about bidings here.](https://foxhound87.github.io/mobx-react-form/docs/bindings/)


<br>

## Define Separated Validation Objects

### Using Vanilla Javascript Validation Functions (VJF)

```javascript
const fields = ['email', 'emailConfirm'];

const validators = {
  email: isEmail,
  emailConfirm: [isEmail, shouldBeEqualTo('email')],
};

new Form({ fields, validators, ... });
```

> Read more about how to [Enable Vanilla Javascript Validation Functions (VJF)](../../validation/modes/vjf-enable.md)

### Using Declarative Validation Rules (DVR)

```javascript
const fields = ['email', 'password'];

const rules = {
  email: 'required|email|string|between:5,25',
  password: 'required|string|between:5,25',
};

new Form({ fields, rules, ... });
```
> Read more about how to [Enable Declarative Validation Rules (DVR)](../../validation/modes/dvr-enable.md)

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
](../../validation/modes/svk-enable.md)
