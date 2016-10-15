## Defining Nested Fields as Unified Properties

### Define Fields

You can define each nested object property in one place:

A Field can handle a collection of Nested Fields using the `fields` property.

```javascript
const fields = [{
  name: 'address',
  label: 'Address',
  fields: [{
    name: 'street',
    label: 'Street',
    value: 'Broadway',
  }, {
    name: 'city',
    label: 'City',
    value: 'New York',
  }],
}];

new Form({ fields, ... });
```

Validation properties `rules` (DVR) and `validation` (VJF) can be defined as well.
