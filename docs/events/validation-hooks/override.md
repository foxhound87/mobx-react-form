# Validation Hooks

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)
* [Override on Manual Submit](override.md)

---

## Override on Manual Submit
#### onSuccess(form) & onError(form)

These methods are called when the form validation is done.

> They can return promises to wait on submit.

Define an object with `onSuccess(form)` or `onError(form)` Validation Hooks.

```javascript
const hooks = {
  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    // get field values
    console.log('Form Values!', form.values());
  },
  onError(form) {
    // get all form errors
    console.log('All form errors', form.errors());
    // invalidate the form with a custom error message
    form.invalidate('This is a generic error message!');
  },
};
```

> They takes the `form` instance as parameter in input.

Then pass the Validation Hooks as first argument to the `submit({ ... })` Action:

```javascript
instance.submit({
  onSuccess: hooks.onSuccess,
  onError: hooks.onError,
})
```

or as second argument to the `onSubmit(e, { ... })` Event Handler:

```html
<button
  type="submit"
  onClick={e => instance.onSubmit(e, {
    onSuccess: hooks.onSuccess,
    onError: hooks.onError,
  })}
>Submit</button>
```

> `instance` can be a **Form** or a **Field**

> These methods can be called on **Nested Fields** as well for **Sub-Form Submitting**.
