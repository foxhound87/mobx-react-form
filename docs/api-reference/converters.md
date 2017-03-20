# Converters

## Parsers & Formatters

Convert Fields `value` property:

* **parse**: from `input` to `store`.
* **format**: from `store` to `output`.

The functions can be defined when defining the fields properties.

> Both converters functions takes in input the field value and must return it.

###### Example

```javascript
  ...
  devSkills: {
    value: 5,
    parse: value => value.toString(),   // (user to store)
    format: value => Number(value),     // (store to user)
  },
  ...
```

> The converters can be defined for the separated mode and nested fields as well.

In the example above, the provided value will be `parsed` from number to string, to be used in a `text` input.

`form.$('devSkills').value; // string`

Afterward, when you serialize the form values using `get()`, the returned value will be `formatted` back to a number.

`form.$('devSkills').get('value'); // number`
