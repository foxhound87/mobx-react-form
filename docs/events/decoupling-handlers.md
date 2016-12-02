## Decopling the Events Handlers from the Form Object

Define an `event` object with `onSuccess(form)` or `onError(form)` methods.

```javascript
const events = {
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

Then pass the events to the `onSubmit` events handler:

```html
<button
  type="submit"
  onClick={e => form.onSubmit(e, {
    onSuccess: events.onSuccess,
    onError: events.onError,
  })}
>Submit</button>
```
