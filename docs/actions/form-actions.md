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

The `validate(path)` action get an optional field `path` in input and returns a `promise`.

The callback takes a `boolean` (`isValid`) with the validation state of the **field**.

```javascript
form.validate('email')
  .then((isValid) => {
    ... // Use `isValid` to check the validation status
  });
```

> This is an alternative syntax to [Actions - Validate a Field](https://foxhound87.github.io/mobx-react-form/docs/actions/actions.html#validate-a-field).

### Manual Form Submit

Perform fields validation. After successful validation triggers `onSuccess` event or `onError` event in case of validation error.

```javascript
form.submit();
```

Provide an object with `onSuccess(form)` and `onError(form)` functions if not implemented in the Form class.

```javascript
form.submit({
  onSuccess: (form) => {},
  onError: (form) => {},
});
```

> This is not an Event Handler.
> If you need the `onSubimt(e)` read the [Event Handlers](../events/events-handlers.md) section.

You can use it, for example, if you want to reimplement the `onSubimt(e)` Event Handler.
