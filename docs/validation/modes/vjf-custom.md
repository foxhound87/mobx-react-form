## Custom Vanilla Javascript Validation Functions (VJF)

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

