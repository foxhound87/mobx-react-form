# Performance & SSR

Optimization techniques for large forms and server-side rendering compatibility.

---

* [Validation Debounce](#validation-debounce)
* [Stop Validation on First Error](#stop-validation-on-first-error)
* [Retrieve Only Changed Values](#retrieve-only-changed-values)
* [Retrieve Only Enabled Fields](#retrieve-only-enabled-fields)
* [Lazy Validation Triggers](#lazy-validation-triggers)
* [Large Forms & Nested Fields](#large-forms--nested-fields)
* [Bundle Size](#bundle-size)
* [SSR / Server-Side Rendering](#ssr--server-side-rendering)

---

## Validation Debounce

By default, validation is debounced at **250ms** to avoid running on every keystroke. Adjust the wait time and debounce behavior:

```javascript
const options = {
  validationDebounceWait: 300, // ms (default: 250)
  validationDebounceOptions: {
    leading: false, // don't validate on first keystroke
    trailing: true, // validate after the last keystroke
  },
};
```

Increase the debounce for very large forms (500ms+) to reduce validation calls. Set `leading: true` for immediate validation on the first keystroke, then debounced on subsequent ones.

The debounce is applied per-field — each field has its own debounced validation instance.

---

## Stop Validation on First Error

For forms with many validation rules, stop validating a field as soon as the first error is found:

```javascript
const options = {
  stopValidationOnError: true, // default: false
};
```

When `true`, if a field has multiple rules (e.g. `required|min:3|max:50`), validation stops at the first failing rule and subsequent rules are skipped. This improves performance for fields with many validation rules.

---

## Retrieve Only Changed Values

When calling `form.values()` or `form.get('value')`, retrieve only fields whose values have changed (dirty fields):

```javascript
const options = {
  retrieveOnlyDirtyFieldsValues: true, // default: false
};
```

This is useful when submitting to an API that only accepts changed fields (PATCH requests):

```javascript
const changedValues = form.values(); // only dirty fields
// Send to API: PATCH /api/resource { ...changedValues }
```

---

## Retrieve Only Enabled Fields

Exclude disabled fields from results:

```javascript
const options = {
  retrieveOnlyEnabledFieldsValues: true,  // default: false
  retrieveOnlyEnabledFieldsErrors: true,  // default: false
};
```

- `retrieveOnlyEnabledFieldsValues` — `values()`, `get('value')` skip disabled fields
- `retrieveOnlyEnabledFieldsErrors` — `errors()` skip disabled field errors

---

## Lazy Validation Triggers

Control exactly when validation runs to minimize unnecessary computation:

```javascript
const options = {
  validateOnInit: true,             // validate on mount (default: true)
  validateOnSubmit: true,           // validate on submit (default: true)
  validateOnChange: false,          // validate on every keystroke (default: false)
  validateOnBlur: true,             // validate on blur (default: true)
  validateOnChangeAfterInitialBlur: false, // validate on change only after first blur
  validateOnChangeAfterSubmit: false,      // validate on change only after first submit
  validateOnClear: false,           // validate after clear (default: false)
  validateOnReset: false,           // validate after reset (default: false)
};
```

**Recommended for large forms:**

```javascript
const options = {
  validateOnChange: false,          // too expensive for 50+ fields
  validateOnBlur: true,             // validate on blur only
  validateOnChangeAfterSubmit: true, // enable change validation after first submit
  validationDebounceWait: 400,      // increase debounce
};
```

### Validate only after first blur

```javascript
const options = {
  validateOnChange: false,
  validateOnChangeAfterInitialBlur: true, // validate on change only after the field has been focused and blurred at least once
};
```

This avoids validating fields the user hasn't interacted with yet.

### Validate only after first submit

```javascript
const options = {
  validateOnChange: false,
  validateOnChangeAfterSubmit: true, // validate on change after the form has been submitted at least once
};
```

This is a common UX pattern: validate everything on first submit, then provide real-time feedback as the user corrects fields.

---

## Large Forms & Nested Fields

For forms with 50+ fields or deeply nested structures:

```javascript
const options = {
  validationDebounceWait: 300,
  stopValidationOnError: true,
  retrieveOnlyDirtyFieldsValues: true,
  preserveDeletedFieldsValues: false,
  softDelete: false, // use hard delete instead of soft delete
};
```

### Forms Composer

For multi-step workflows (wizards), split the form using the [Forms Composer](../extra/composer.html) — each step is its own form, validated independently:

```javascript
import { composer } from 'mobx-react-form';

const step1 = new Form({ ... });
const step2 = new Form({ ... });

const wizard = composer({ step1, step2 });
wizard.step1.validate();
wizard.step2.submit();
```

### Lazy-loading field groups

For very large forms, consider lazy-loading sections:

```javascript
class MyForm extends Form {
  onInit() {
    // Load optional sections only when needed
    if (this.$('advancedSection')) {
      this.$('advancedSection').loadFields();
    }
  }
}
```

---

## Bundle Size

mobx-react-form is tree-shakeable. Version 6.14+ removed 36 lodash dependencies, replacing them with vanilla JS for a smaller bundle.

| Measure | Size |
|---------|------|
| Minified | ~30 KB |
| Minified + gzip | ~8 KB |

> Import only the validation plugins you need — each plugin adds ~2-5 KB to the bundle.

---

## SSR / Server-Side Rendering

### Deterministic Field IDs

The `uniqueId` option generates a unique ID for each field. For SSR, you need a deterministic function to prevent hydration mismatches:

```javascript
const options = {
  uniqueId: (field) => `${field.path}-${Date.now()}`,
};
```

For fully deterministic IDs (same on server and client):

```javascript
const options = {
  uniqueId: (field) => field.path.replace(/[\[\]\.]/g, '_'),
};
```

### No DOM Dependencies

mobx-react-form has no DOM dependencies — it works with any React SSR framework (Next.js, Remix, etc.) without modifications. The form logic runs entirely on the server during SSR.

### Hydration

On the client, re-create the form with the same configuration and initial values:

```javascript
// Both server and client use the same structure:
const form = new Form({
  fields: { username: { value: '' } },
}, {
  options: {
    uniqueId: (field) => field.path.replace(/[\[\]\.]/g, '_'),
  },
});

// On the client, rehydrate with server values:
form.set('value', serverValues);
```

> SSR compatibility requires `mobx-react-form` version 6.0.0 or later.
