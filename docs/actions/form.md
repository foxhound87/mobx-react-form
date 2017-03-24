# Form Actions

The form actions can be used only on the form instance.

* [Validate the Form](#validate-the-form)
* [Validate Single Field](#validate-single-field)
* [Re-Initialize all Fields](#re-initialize-all-fields)

---

### Validate the Form

The `validate()` action returns a `promise`.

The callback takes the **Field Instance** with its `isValid` prop, which is the validation state of the **Form**.

```javascript
form.validate()
  .then(({ isValid }) => {
    ... // Use `isValid` to check the validation status
  });
```

> The validation promise resolves the validated instance (Form or Field).

---

### Validate Single Field

The `validate(path)` action get an optional field `path` in input and returns a `promise`.

The callback takes a `boolean` (`isValid`) with the validation state of the **Field**.

```javascript
form.validate('email')
  .then(({ isValid }) => {
    ... // Use `isValid` to check the validation status
  });
```

> The validation promise resolves the validated instance (Form or Field).

> This is an alternative syntax to [Actions - Validate a Field](https://foxhound87.github.io/mobx-react-form/docs/actions/shared.html#validate-a-field).

---

### Re-Initialize all Fields

The `init()` method will re-init the form with empty or new values and all previous data will be discarded.

> If you don't need to re-init the form fields and values, just use the [update()](shared.md#update-the-fields) method.

It works like passing the passing the `fields` or `values` to the [Form Constructor](../api-reference/form-initialization.md).

It accept the **fields struct** if using `separated properties definition` or **fields values** if using `unified properties definition`.

<br>

Re-init the form with empty values:

```javascript
.init();
```

Use an object to Re-Init the form with **new values** (`unified properties definition`):

```javascript
form.init({
  username: 'NewUsername',
  password: 'NewPassword',
});
```

Use the fields struct to Re-Init with **empty fields** (`separated properties definition`):

```javascript
form.init([
  'members[]'
  ...
]);
```

then you can update the fields values normally using the `update()` method.

> You can use the `init()` method if you need to add new fields too, for this purpose you have to provide the new complete **fields struct** or **fields values** or the missing fields will be lost.
