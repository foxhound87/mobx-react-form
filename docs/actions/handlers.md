# Form Actions

The following actions can be used on the form instance.

---

### Init the fields

The `init()` method will re-init the form with empty or new values and all previous data will be discarded.

If you don't need to re-init the form fields and values, just use the `update()` method.

It works like passing the pasising the `fields` or `values` to the [Form Constructor](../api-reference/form-initialization.md).

It accept the **fields struct** if using `separated props` or **fields values** if using `unified props`.

<br>

Re-init the form with empty values:

```javascript
.init();
```

Use an object to Re-Init the form with **new values** (`unified props`):

```javascript
form.init({
  username: 'NewUsername',
  password: 'NewPassword',
});
```

Use the fields struct to Re-Init with **empty fields** (`separated props`):

```javascript
form.init([
  'members[]'
  ...
]);
```

then you can update the fields values normally using the `update()` method.

> You can use the `init()` method if you need to add new fields too, for this purpose you have to provide the new complete **fields struct** or **fields values** or the missing fields will be lost.

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
