# Validation & Submit

Methods for validating fields, managing error state, and submitting forms.

---

## validate()

Validate a form or field and return a Promise. The promise resolves with the validated instance (`{ isValid }`).

### Validate the form

```javascript
form.validate()
  .then(({ isValid }) => {
    // isValid = true / false
  });
```

### Validate a single field

```javascript
form.$('password').validate()
  .then(({ isValid }) => {
    // isValid = true / false
  });
```

### Validate with options

By default, `validate()` does **not** show errors. Pass `showErrors: true` to display them:

```javascript
form.$('password').validate({ showErrors: true });
form.$('password').validate({ showErrors: true, related: true });
```

### Validate a path from the form

```javascript
form.validate('email');
form.validate('email', { showErrors: true });
```

> This is an alternative syntax to calling `validate()` on the field directly.

---

## check()

Check a computed property on the field or nested fields.

```javascript
field.check('isValid');         // single field
field.check('isValid', true);   // deep check (includes nested fields)
```

Allowed computed values: `hasError`, `isValid`, `isDirty`, `isPristine`, `isDefault`, `isEmpty`, `focused`, `touched`, `changed`.

---

## invalidate()

Manually mark a form or field as invalid. Pass an error message string.

```javascript
form.invalidate('This is a generic error message!');

form.$('password').invalidate('The password is wrong!');
```

The method accepts optional parameters:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `message` | string | - | Custom error message |
| `deep` | boolean | `true` | Apply to nested fields recursively |
| `async` | boolean | `false` | If `true`, stores in `errorAsync` instead of `errorSync` |

```javascript
// Sync error
form.$('email').invalidate('Invalid format');

// Async error (e.g. from server response)
form.$('email').invalidate('Email already taken', true, true);
```

> `invalidate()` automatically calls `showErrors(true, deep)`.

---

## resetValidation()

Clear the validation status back to initial state — removes sync errors, async errors, and the validation error stack.

```javascript
form.$('password').resetValidation();  // single field
form.resetValidation(true);            // deep reset (all nested fields)
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `deep` | boolean | `false` | If `true`, recursively resets all nested fields |

**What it clears:**
- `errorSync` — synchronous validation error
- `errorAsync` — asynchronous validation error
- `validationAsyncData` — async validation result
- `validationFunctionsData` — validation function results
- `validationErrorStack` — error message stack
- `showError` — resets to `false`

```javascript
form.$('password').resetValidation();
form.$('password').error;     // => null
form.$('password').hasError;  // => false
```

> `resetValidation()` is called internally by `clear()` and `reset()`. Use it when you need to clear validation state without changing field values.

---

## showErrors()

Control the visibility of validation error messages.

```javascript
form.$('password').showErrors(true);   // show errors
form.$('password').showErrors(false);  // hide errors
form.showErrors(true);                 // show on all fields
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `bool` | boolean | — | `true` to show, `false` to hide |
| `deep` | boolean | `true` | Apply to nested fields recursively |

**How it works:**

The `error` computed property checks `showError` before returning:
- If `showError === false`, `error` returns `null`
- If `showError === true`, `error` returns the actual error message

```javascript
// Hide errors without affecting nested fields
form.$('address').showErrors(false, false);

// Manually ensure errors are visible after invalidation
form.$('email').invalidate('Invalid email');
form.$('email').showErrors(true);
```

> You can also control error visibility globally via `showErrorsOnInit`, `showErrorsOnChange`, etc. in [Form Options](../form/form-options.html).

---

## submit()

Perform validation and trigger success or error hooks. Available on **Form** and **Field** instances.

```javascript
form.submit();
```

### Custom hooks

Override the hooks defined in the class:

```javascript
form.submit({
  onSuccess: (form) => console.log('Valid!', form.values()),
  onError:   (form) => console.log('Errors:', form.errors()),
});
```

### Submit options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `execOnSubmitHook` | boolean | `true` | Execute the `onSubmit` hook before validating |
| `execValidationHooks` | boolean | `true` | Execute `onSuccess` / `onError` hooks after validation |
| `validate` | boolean | `true` | Perform validation before calling hooks |

### Sub-form submission

On a Field instance, `submit()` validates only that fieldset:

```javascript
form.$('step1').submit({
  onSuccess: (fieldset) => {
    console.log('Step 1 valid!', fieldset.values());
    // Proceed to next step
  },
  onError: (fieldset) => {
    console.log('Step 1 errors:', fieldset.errors());
  },
});
```

> This is not an Event Handler. Use `onSubmit(e)` if you need DOM event handling.
