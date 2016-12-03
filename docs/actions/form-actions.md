# Form Actions

The following actions can be used on the form instance.

---

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

Provide an object with `onSuccess(form)` and `onError(form)` functions.

```javascript
form.submit({
  onSuccess: (form) => {},
  onError: (form) => {},
});
```

> This is not an Event Handler.
> If you need the `onSubimt(e)` read the [Event Handlers](../events/events-handlers.md) section.

You can use it, for example, if you want to reimplement the `onSubimt(e)` Event Handler.
