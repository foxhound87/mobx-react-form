# Form Actions

### Init the fields

You can create the fields after the form is initialized too, or you can re-init them.

```javascript
form.init({
  username: 'NewUsername',
  password: 'NewPassword',
});
```

It works like passing the `fields` or the `structure` to the [Form Constructor](../api-reference/form-initialization.md).

Nested fields can be initalized as well.

---

# Validation

### Validate the Form

The `validate()` action returns a `promise`.

The callback takes a `boolean` (`isValid`) with the validation state of the **form**.

```javascript
form.validate()
  .then((isValid) => {
    ... // Use `isValid` to check the validation status
  });
```

### Validate Single Field

The `validate(key)` action get an optional field `key` in input and returns a `promise`.

The callback takes a `boolean` (`isValid`) with the validation state of the **field**.

```javascript
form.validate('email')
  .then((isValid) => {
    ... // Use `isValid` to check the validation status
  });
```

### Invalidate the Form

> Takes a `string` in input for the error message.

```javascript
form.invalidate('This is a generic error message!');
```

### Manual Form Submit

Provide an object with `onSuccess()` and `onError()` functions.

```javascript
form.submit({
  onSuccess: (form) => {},
  onError: (form) => {},
});
```
