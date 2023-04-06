# Form Actions

The form actions can be used only on the form instance.

* [Validate the Form](#validate-the-form)
* [Validate Single Field](#validate-single-field)
* [Validation Errors](#validation-errors)

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

### Validation Errors

The `validate()` method will not show errors by default.

If you need to show errors after a validation you do:

```javascript
form.validate({ showErrors: true });
```

or on single field:

```javascript
form.validate('email', { showErrors: true });
```
