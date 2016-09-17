## Defining Fields


### Define Empty Fields

> The `label` will be automatically named using the field `name`

```javascript
const fields = {
  username: '',
  password: '',
};
```

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
