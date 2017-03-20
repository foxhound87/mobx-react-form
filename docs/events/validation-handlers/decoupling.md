# Validation Handlers

* [Extending the Form Instance with Validation Handlers](extending.md)
* [Decupling the Validation Handlers from the Form Instance](decoupling.md)

## Decoupling the Validation Handlers
#### onSuccess(form) & onError(form)

These methods are called when the form validation is done.

Define an object with `onSuccess(form)` or `onError(form)` validaiton handlers.

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

Then pass the Validation Handlers as second argument to the `onSubmit(e, { ... })` Event Handler:

```html
<button
  type="submit"
  onClick={e => form.onSubmit(e, {
    onSuccess: validationHandlers.onSuccess,
    onError: validationHandlers.onError,
  })}
>Submit</button>
```
