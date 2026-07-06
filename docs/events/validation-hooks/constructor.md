# Validation Hooks

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)
* [Override on Manual Submit](override.md)

---

## On Form Initialization

#### onSuccess(form) & onError(form)

Define Validation Hooks via the `hooks` object in the **Second Argument** of the Form Constructor:

```javascript
const hooks = {
  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    console.log('Form Values!', form.values());
    // can return a promise here!
  },
  onError(form) {
    console.log('All form errors', form.errors());
    form.invalidate('This is a generic error message!');
    // can return a promise here!
  },
};

new Form({ ... }, { hooks });
```

---

## Sub-Form Submission

#### onSuccess(fieldset) & onError(fieldset)

Nested fields can have their own Validation Hooks for sub-form patterns. Define hooks keyed by field path:

```javascript
const submit = {
  onSuccess(fieldset) {
    alert(`${fieldset.path} is valid!`);
    console.log(`${fieldset.path} Values!`, fieldset.values());
  },
  onError(fieldset) {
    console.log(`All ${fieldset.path} errors`, fieldset.errors());
    fieldset.invalidate('This is a generic error message!');
  },
};

const hooks = {
  'members[]': submit,
};

new Form({
  fields: ['members[].firstname', 'members[].lastname'],
  hooks,
});
```

---

%accordion% **Legacy API — Version < 1.32** %accordion%

In older versions, the object was called `onSubmit` instead of `hooks`:

```javascript
const onSubmit = {
  onSuccess(form) {
    console.log('Form Values!', form.values());
  },
  onError(form) {
    console.log('All form errors', form.errors());
  },
};

new Form({ ... }, { onSubmit });
```

For Sub-Form Submission:

```javascript
const onSubmit = {
  'members[]': submit,
};

new Form({ ... }, { onSubmit });
```

%/accordion%
