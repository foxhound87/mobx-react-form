# Error Handling

Patterns and options for handling form and field errors in mobx-react-form.

---

## Validation Error States

Every field exposes computed properties for error state:

| Property | Type | Description |
|----------|------|-------------|
| `error` | string or null | First error message. Returns `null` if `showError` is `false`. |
| `errorSync` | string or null | Synchronous validation error |
| `errorAsync` | string or null | Asynchronous validation error (from async validators) |
| `hasError` | boolean | `true` if the field or any nested field has errors |
| `isValid` | boolean | `true` if the field and all nested fields pass validation |
| `showError` | boolean | Controls whether `error` returns the message or `null` |

```javascript
if (form.$('email').hasError) {
  console.log(form.$('email').error); // error message string
}
```

---

## Form-Level Errors

The form instance has top-level error state that aggregates child field errors:

```javascript
form.error;     // first error across all fields, or form-level error
form.hasError;  // true if any field has an error
form.isValid;   // true only if ALL fields are valid
```

---

## Invalidate Manually

Use `invalidate()` to mark a field or form as invalid programmatically:

```javascript
// Invalidate a single field
form.$('email').invalidate('The email is already taken.');

// Invalidate the whole form
form.invalidate('Please fix the errors above.');

// Show errors after invalidation
form.invalidate('Something went wrong.');
form.showErrors(true);
```

The method accepts optional parameters:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `message` | string | — | Custom error message |
| `deep` | boolean | `true` | Apply to nested fields |
| `async` | boolean | `false` | Store in `errorAsync` instead of `errorSync` |

```javascript
// Async error (e.g. from server response)
form.$('email').invalidate('Email already exists', true, true);
// field.errorAsync === 'Email already exists'
```

---

## Submit Error Handling

### `submitThrowsError` Option

By default, if validation fails on `submit()`, the library throws an error. Set `submitThrowsError: false` to suppress the throw and handle errors gracefully:

```javascript
const options = {
  submitThrowsError: false, // default: true
};

const form = new Form({ fields }, { options });

try {
  await form.submit();
} catch (e) {
  // Only reaches here if submitThrowsError is true
}
```

### `defaultGenericError` Option

Set a default error message shown on the form when `submit()` fails but no specific field errors are available:

```javascript
const options = {
  defaultGenericError: 'Please fix the errors before submitting.',
};
```

When `onError` is triggered, if there's no specific field error, the form displays this generic message:

```javascript
const hooks = {
  onError(form) {
    console.log(form.error); // 'Please fix the errors before submitting.'
  },
};
```

### Submit with Try/Catch

```javascript
async function handleSubmit() {
  try {
    const { isValid } = await form.submit({
      onSuccess: (f) => {
        // send data to server
      },
      onError: (f) => {
        // validation errors — shown automatically
      },
    });
  } catch (e) {
    // Only with submitThrowsError: true
    console.error('Submit failed:', e);
  }
}
```

---

## Show / Hide Errors

Control error visibility manually:

```javascript
// Show all errors
form.showErrors(true);

// Hide all errors (e.g. after user starts correcting)
form.showErrors(false);

// Show errors on a specific field
form.$('email').showErrors(true);

// Hide errors without affecting nested fields
form.$('address').showErrors(false, false);
```

The `error` computed property checks `showError` before returning:
- If `showError === false`, `error` returns `null`
- If `showError === true`, `error` returns the actual message

---

## Reset Validation

Clear validation state without changing field values:

```javascript
// Single field
form.$('password').resetValidation();

// Deep reset (all nested fields)
form.resetValidation(true);
```

Resets: `errorSync`, `errorAsync`, `validationAsyncData`, `validationFunctionsData`, `validationErrorStack`, `showError`.

> `resetValidation()` is called internally by `clear()` and `reset()`.

---

## Auto-Show Errors on Validate

The `validate()` method does not show errors by default. Pass `{ showErrors: true }` to display them:

```javascript
await form.validate({ showErrors: true });
await form.$('email').validate({ showErrors: true });
```

### Form Options for Error Visibility

| Option | Default | Description |
|--------|---------|-------------|
| `showErrorsOnInit` | `false` | Show errors on form initialization |
| `showErrorsOnChange` | `true` | Show errors when value changes |
| `showErrorsOnBlur` | `true` | Show errors on blur |
| `showErrorsOnClear` | `false` | Show errors after clear |
| `showErrorsOnReset` | `false` | Show errors after reset |

---

## `bubbleUpErrorMessages` Option

When enabled, `Field.error` and `Form.error` bubble up the first error from nested child fields:

```javascript
const options = {
  bubbleUpErrorMessages: true, // default: false
};

// If a nested field has an error, the parent's .error shows it:
form.$('address').error; // 'Street is required' (bubbled up from child)
```

---

## Pattern: Server Validation Errors

Map server-side validation errors to fields:

```javascript
async function submitForm() {
  const { isValid } = await form.submit();

  if (!isValid) return;

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(form.values()),
    });

    if (!res.ok) {
      const errors = await res.json();
      // errors = { email: 'Already taken', password: 'Too weak' }

      Object.entries(errors).forEach(([path, message]) => {
        const field = form.$(path);
        if (field) {
          field.invalidate(message, true, true); // async error
        } else {
          form.invalidate(message); // form-level error
        }
      });

      form.showErrors(true);
    }
  } catch (e) {
    form.invalidate('Network error. Please try again.');
  }
}
```

---

## Pattern: Clear Errors on Input

Clear field-level errors as the user starts typing:

```javascript
const hooks = {
  onChange(field) {
    if (field.hasError) {
      field.resetValidation();
      field.showErrors(false);
    }
  },
};
```
