# Validation Hooks

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)
* [Override on Manual Submit](override.md)

---

## On Form Initialization
#### onSuccess(form) & onError(form)

These methods are called when the form validation is done.

> They can return promises to wait on submit.

Define an `hooks` object with `onSuccess(form)` or `onError(form)` Validation Hooks and pass them to the **Second Argument** of the **Form Constructor**:

```javascript
const hooks = {
  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    // get field values
    console.log('Form Values!', form.values());
    // can return a promise here!
  },
  onError(form) {
    // get all form errors
    console.log('All form errors', form.errors());
    // invalidate the form with a custom error message
    form.invalidate('This is a generic error message!');
    // can return a promise here!
  },
};

new Form({ ... }, { hooks }); <---
```

%accordion% **VERSION < 1.32** %accordion%

```javascript
const onSubmit = {
  onSuccess(form) {
    console.log('Form Values!', form.values());
  },
  onError(form) {
    console.log('All form errors', form.errors());
  },
};

new Form({ ... }, { onSubmit }); <---
```

%/accordion%


# Sub-Form Submission
#### onSuccess(fieldset) & onError(fieldset)

Even the Nested Field can be treated as Sub-Form, they can have their own Validation Hooks.

You can define Validation Hooks on the Fields you need, defining an `hooks` object for each Field to pass in the **First Argument** of the **Form Constructor**:

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

const hooks = {
  'members[]': submit,
  // ... other fields
};

new Form({ ..., hooks }, { ... }); <---
```

%accordion% **VERSION < 1.32** %accordion%

> the object passed to the **constructor** is called `onSubmit`.

```javascript
...

const onSubmit = {
  'members[]': submit,
  // ... other fields
};

new Form({ ..., onSubmit }, { ... }); <---
```

%/accordion%

> This is an example using **Separated Field Properties Definition** mode but **Unified** mode is also supported.
