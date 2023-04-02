## Defining Nested Fields as Unified Properties

### Define Fields

You can define each nested object property in one place:

A Field can handle a collection of Nested Fields using the `fields` property.

You can define these properties in each field definition:

`name`, `value`, `label`, `placeholder`, `default`, `initial`, `disabled`, `deleted`, `type`, `related`, `rules`,  `options`, `bindings`, `extra`, `hooks`, `handlers`, `validatedWith`, `validators`, `observers`, `interceptors`, `input`, `output`, `autoFocus`, `inputMode`, `ref`.

Validation properties `rules` (DVR) and `validators` (VJF) can be defined as well.

```javascript
const fields = [{
  name: 'address',
  label: 'Address',
  fields: [{
    name: 'street',
    label: 'Street',
    value: 'Broadway',
    default: '5th Avenue',
  }, {
    name: 'city',
    label: 'City',
    value: 'New York',
  }],
}];

new Form({ fields, ... });
```

> The `name` property is required, it will be the field `key`.

### Set `related` Nested Fields to be validated at the same time

A Nested Field can be checked as well using its `path`.

```javascript
const fields = [{
  name: 'user',
  label: 'User',
  fields: [{
    name: 'email',
    label: 'Email',
    validators: isEmail,
    related: ['user.emailConfirm'], // <<---
  }, {
    name: 'emailConfirm',
    label: 'Confirm Email',
    validators: [isEmail, shouldBeEqualTo('email')],
  }],
}];
```
