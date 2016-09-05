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
    default: '',
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
    default: '',
  }
};
```

### Update the Fields State

```javascript
form.update({
  username: 'NewUsername',
  password: 'NewPassword',
});
```

### Reset the Fields State

```javascript
form.reset();
```

### Clear the Fields State

```javascript
form.clear();
```

