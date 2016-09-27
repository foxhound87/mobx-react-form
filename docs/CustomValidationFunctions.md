## Custom Validation Functions

### Define custom functions

> they must return an array with: [boolean, string];

```javascript
export function shouldBeEqualTo(target) {
  return ({ field, form }) => {
    const fieldsAreEquals = (form.$(target).value === field.value);
    return [fieldsAreEquals, `The ${field.label} should be equals to ${form.$(target).label}`];
  };
}

export function isEmail({ field }) {
  const isValid = (field.value.indexOf('@') > 0);
  return [isValid, `The ${field.label} should be an email address.`];
}
```

### Pass them to the field's `validate` property as function or as an array of functions

> You can set `related` fields that you want to be validated at the same time.

```javascript
const fields = {
  ...
  email: {
    label: 'Email',
    related: ['emailConfirm'],
  },
  emailConfirm: {
    label: 'Confirm Email',
    validate: [isEmail, shouldBeEqualTo('email')],
  },
  ...
};
```

<br>

## Async Validation Functions

### Define a function that returns a `promise`

After the promise is done, we get the result and pass them to a function which returns an array with two items: The first item is the validation condition, the second is a string with the error message.

```javascript
export function checkUser({ field }) {
  const msg = `Hey! The username ${field.value} is already taken.`;
  // show error if the call does not returns entries
  return simulateAsyncFindUserCall({ user: field.value })
    .then((items) => [(items.length === 0), msg]);
}
```
