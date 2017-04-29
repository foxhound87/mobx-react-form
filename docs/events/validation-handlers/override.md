# Validation Handlers

* [Extending the Form Instance with Validation Handlers](extending.md)
* [Passing the Validation Handlers to the Form constructor](constructor.md)
* [Override the Validation Handlers with Manual Submit](override.md)

## Override the Validation Handlers
#### onSuccess(form) & onError(form)

These methods are called when the form validation is done.

> They can return promises to wait on submit.

Define an object with `onSuccess(form)` or `onError(form)` Validation Handlers.

```javascript
const validationHandlers = {
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

Then pass the Validation Handlers as first argument to the `submit({ ... })` Action:

```javascript
instance.submit({
  onSuccess: validationHandlers.onSuccess,
  onError: validationHandlers.onError,
})
```

or as second argument to the `onSubmit(e, { ... })` Event Handler:

```html
<button
  type="submit"
  onClick={e => instance.onSubmit(e, {
    onSuccess: validationHandlers.onSuccess,
    onError: validationHandlers.onError,
  })}
>Submit</button>
```

> `instance` can be a **Form** or a **Field**

> These methods can be called on **Nested Fields** as well for **Sub-Form Submitting**.
