# Computed Field Props

Before version `< 6.3`, to implement computed props you had to [extend](../form/extend/generic.md) a `Form` or `Field` class.
Form the version `6.3` and above, computed props can be defined providing functions in [Fields Definitions](../fields/README.md).

> The computed function will get an object with `form` and `field` instances in input.

#### Avaliable Field Computed Props

`value`, `label`, `placeholder`, `disabled`, `rules`, `related`, `deleted`, `validatedWith`, `validators`, `bindings`, `extra`, `options`, `autoFocus`, `inputMode`.

#### How to implement Computed Props

An assumption has to be made before using computed props: the function gets the `form` instance that can be used to acess other form fields **before they are created**. For this reason, to access a field before its creation, we need to set `strictSelect: false` as form `option`, otherwise an error will be thrown when trying to access an undefined field.

```javascript
const fields = [
    'myComputedField', // will be computed
    'mySwitch', // assume it is a boolean
];

const types = {
    mySwitch: 'checkbox',
};

const values = {
    // we define the value of the field as a function which can return a computed value
    myComputedField: ({ form, field }) => form.$('mySwitch')?.value ? 'a' : 'b';
};

const form = new Form({ fields, types, values, ... }, {
    options: { strictSelect: false }
});
```

> Example using Separated Mode Definition. Unified Mode also supported.