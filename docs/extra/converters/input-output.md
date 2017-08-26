# Converters

## Input & Output functions

Convert Fields `value` property:

* **input**: from `input` to `store`.
* **output**: from `store` to `output`.

The functions can be defined when defining the fields properties.

> Both converters functions takes in input the field value and must return it.

###### Example

```javascript
  new Form({
    fields: {
      devSkills: {
        value: 5,
        input: value => value.toString(),   // (from input to store)
        output: value => Number(value),     // (from store to output)
      },
    },
  }):
```

> The converters can be defined for the separated mode and nested fields as well.

In the example above, the provided value will be converted from number to string, to be used in a `text` input.

`form.$('devSkills').value; // string`

Afterward, when you serialize the form values using `get()`, the returned value will be converted back to a number.

`form.$('devSkills').get('value'); // number`
