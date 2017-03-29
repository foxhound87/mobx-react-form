# Validation Handlers

* [Extending the Form Instance with Validation Handlers](extending.md)
* [Passing the Validation Handlers to the Form constructor](constructor.md)
* [Override the Validation Handlers with Manual Submit](override.md)

## Passing the Validation Handlers to the Form constructor
#### onSuccess(form) & onError(form)

These methods are called when the form validation is done.

> They can return promises to wait on submit.

Define an `onSubmit` object with `onSuccess(form)` or `onError(form)` Validation Handlers and pass them to the **Second Argument** of the **Form Constructor**:

```javascript
const onSubmit = {
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

new Form({ ... }, { onSubmit }); <---
```

# Sub-Form Submission
#### onSuccess(fieldset) & onError(fieldset)

Even the Nested Field can be treated as Sub-Form, they can have their own Validation Handlers.

You can define Validation Handlers on the Fields you need, defining an `onSubmit` object for each Field to pass in the **First Argument** of the **Form Constructor**:

```javascript
const submit = {
  onSuccess(fieldset) {
    alert(`${fieldset.path} is valid! Send the request here.`);
    // get all fieldset values...
    console.log(`${fieldset.path} Values!`, fieldset.values());
  },
  onError(fieldset) {
    // get all fieldset errors...
    console.log(`All ${fieldset.path} errors`, fieldset.errors());
    // invalidate the fieldset with a custom error message
    fieldset.invalidate('This is a generic error message!');
  },
};

const onSubmit = {
  'members[]': submit,
  // ... other fields
};

new Form({ ..., onSubmit }, { ... }); <---
```

> This is an example using **Separated Field Properties Definition** mode but **Unified** mode is also supported.
