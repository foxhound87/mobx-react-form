# Validation Hooks

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)
* [Override on Manual Submit](override.md)

---

## Override on Manual Submit

#### onSuccess(form) & onError(form)

Override Validation Hooks at submit time or via the `onSubmit` Event Handler.

```javascript
const hooks = {
  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    console.log('Form Values!', form.values());
  },
  onError(form) {
    console.log('All form errors', form.errors());
    form.invalidate('This is a generic error message!');
  },
};
```

> They take the form/field instance as parameter in input.

Pass as first argument to `submit()`:

```javascript
form.submit({ onSuccess: hooks.onSuccess, onError: hooks.onError });
```

Or as second argument to `onSubmit()` Event Handler:

```html
<button
  type="submit"
  onClick={e => form.onSubmit(e, {
    onSuccess: hooks.onSuccess,
    onError: hooks.onError,
  })}
>Submit</button>
```

