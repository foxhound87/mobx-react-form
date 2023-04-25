# Computed Field Props

Before version `< 6.3`, to implement computed props you had to [extend](../form/extend/generic.md) a `Form` or `Field` class.
Form the version `6.3` and above, computed props can be defined providing functions in [Fields Definitions](../fields/README.md).

> The computed function will get an object with `form` and `field` instances in input.

#### Avaliable Computed Field Props

`computed`: special field prop to handle computed values (defined as function).

or functions can be defined on: `value`, `label`, `placeholder`, `disabled`, `rules`, `related`, `deleted`, `validatedWith`, `validators`, `bindings`, `extra`, `options`, `autoFocus`, `inputMode`.

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

#### Handle Computed Nested Array of fields value

If we want to handle computed props for nested array of fields we can use the special `computed` field prop which accepts a full field `path` and will be applied when using the `add()` action.

```javascript

const fields = [
    "products[].name",
    "products[].qty",
    "products[].amount",
    "products[].total",
    "total"
];

const computed = {
    "products[].total": ({ field }) => {
        const qty = field.container()?.$("qty")?.value;
        const amount = field.container()?.$("amount")?.value;
        return qty * amount;
    },

    total: ({ form }) =>
        form.$("products")?.reduce((acc, field) => acc + field.$("total")?.value, 0)
},

const form = new Form({ fields, computed, ... }, {
    options: {
      strictSelect: false,
      autoParseNumbers: true
    },
    hooks: {
      onInit(form) {
        form.$("products").add();
      },
      onSubmit(form) {
        alert(prettyPrint(form.values()));
      }
    }
  })

```

## Examples

- [Nested Computed Field (with constructor)](https://codesandbox.io/s/mobx-react-form--computed-constructor-jeg5b7)
- [Nested Computed Field (extending classes)](https://codesandbox.io/s/mobx-react-form--computed-ee5kl1)
