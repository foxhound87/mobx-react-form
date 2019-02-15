## Custom Vanilla Javascript Validation Functions (VJF)

#### Define custom functions

The validation functions takes in input an object with the following props:

* the `form` instance
* the `field` instance
* the `validator` instance

```javascript
export function shouldBeEqualTo(target) {
  return ({ field, form }) => {
    const fieldsAreEquals = (form.$(target).value === field.value);
    return [fieldsAreEquals, `The ${field.label} should be equal to ${form.$(target).label}`];
  };
}

export function isEmail({ field }) {
  const isValid = (field.value.indexOf('@') > 0);
  return [isValid, `The ${field.label} should be an email address.`];
}
```

> the validation functions must return an array with: [boolean, string];

#### Use the validation functions on the field's `validators` property

```javascript
const fields = {
  ...
  email: {
    label: 'Email',
    related: ['emailConfirm'],
  },
  emailConfirm: {
    label: 'Confirm Email',
    validators: [isEmail, shouldBeEqualTo('email')], // <<<
  },
  ...
};
```

* The validation functions can be used individually or as an array of functions.
* The `related` property can be defined to validate other fields at the same time.

---

## Tips

The functions can be also written using arrow functions:

```javascript
export const isEmail = ({ field, validator }) => ([
  validator.isEmail(field.value),
  `The ${field.label} should be an email address.`,
]);
```

or can be invalidated using the `field.invalidate()` method:

```javascript
export function isEmail({ field, validator }) {
  if (validator.isEmail(field.value)) return true;
  return field.invalidate(`The ${field.label} should be an email address.`);
}
```
