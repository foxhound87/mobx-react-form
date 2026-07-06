# Validation Lifecycle

This page explains **when** and **how** validation runs in mobx-react-form, from a single field change all the way through form submission.

---

## When Validation Fires

Validation is triggered by the following lifecycle events. Each can be enabled or disabled via form options.

| Trigger | Option | Default | Description |
|---|---|---|---|
| **Form init** | `validateOnInit` | `true` | Validate all fields when the form is first created |
| **Field blur** | `validateOnBlur` | `true` | Validate a field when it loses focus |
| **Field change** | `validateOnChange` | `false` | Validate a field on every value change |
| **Change after blur** | `validateOnChangeAfterInitialBlur` | `false` | Validate on change only after the field has been blurred at least once |
| **Change after submit** | `validateOnChangeAfterSubmit` | `false` | Validate on change only after the form has been submitted at least once |
| **Form submit** | `validateOnSubmit` | `true` | Validate all fields before submit handlers run |
| **Clear** | `validateOnClear` | `false` | Validate after clearing field values |
| **Reset** | `validateOnReset` | `false` | Validate after resetting to default values |

> The **validateOnChange** options are evaluated per-field in `Field.ts` (lines ~940-961). They can also be set **per field** via `field.$options.validateOnChange`.

---

## Field Validation Flow

When a field triggers validation (e.g. on blur), the following happens:

```
1. Can skip?
   ├── field is deleted && validateDeletedFields = false   → skip
   ├── field is disabled && validateDisabledFields = false  → skip
   ├── field is pristine && validatePristineFields = false   → skip
   └── none of the above                                    → continue

2. Reset previous errors?
   ├── resetValidationBeforeValidate = true   → resetValidation()
   └── resetValidationBeforeValidate = false  → keep previous errors

3. Trim value?
   ├── validateTrimmedValue = true   → field.trim()
   └── validateTrimmedValue = false  → use value as-is

4. Run each validation driver (in order):
   For each enabled plugin:
     driver.validate(field)
     if stopValidationOnError && field.hasError → break

5. Show/hide errors:
   field.showErrors(showErrors, false)

6. Validate related fields:
   if related → validate fields listed in field.related
```

### Field skip conditions

- **`validateDeletedFields`** (default: `false`) — soft-deleted fields are skipped
- **`validateDisabledFields`** (default: `false`) — disabled fields are skipped
- **`validatePristineFields`** (default: `true`) — fields that haven't been touched
- **`resetValidationBeforeValidate`** (default: `true`) — clear error stack before re-validating
- **`validateTrimmedValue`** (default: `false`) — trim whitespace before validating

### Plugin execution order

By default, all enabled drivers run in the order they were registered. You can customize this using `validationPluginsOrder`:

```javascript
const options = {
  validationPluginsOrder: ['vjf', 'yup', 'zod'],
};
```

If `stopValidationOnError` is `true`, once a field has an error from one driver, subsequent drivers are skipped for that field.

---

## Submit Flow

When `form.submit()` is called:

```
1. Exec onSubmit hook (if execOnSubmitHook = true)
2. Set $submitting = true, increment $submitted
3. Validate?
   ├── validateOnSubmit = true   → form.validate({ showErrors: showErrorsOnSubmit })
   └── validateOnSubmit = false  → skip validation, resolve immediately

4. After validation resolves:
   ├── isValid = true  → exec onSuccess hook
   ├── isValid = false → exec onError hook
   │                     + if submitThrowsError && defaultGenericError → invalidate()
   └── (hooks skipped if execValidationHooks = false)

5. Set $submitting = false
6. Return the form/field instance
```

### submit() parameters

| Param | Default | Description |
|---|---|---|
| `validate` | `true` | Whether to validate before resolving |
| `execOnSubmitHook` | `true` | Whether to fire the `onSubmit` hook |
| `execValidationHooks` | `true` | Whether to fire `onSuccess` / `onError` hooks |

```javascript
// Minimal submit — skip validation entirely
form.submit({}, { validate: false });

// Submit without firing hooks
form.submit({}, { execOnSubmitHook: false, execValidationHooks: false });
```

---

## Validation Error Stack

Each field has a `validationErrorStack` (array of strings). When a plugin finds a validation error, it pushes the error message onto this stack via `field.invalidate(message)`.

```
validationErrorStack: string[]
```

The first error in the stack is displayed as the field's `error` property.

```
error = validationErrorStack.length ? validationErrorStack[0] : null
```

---

## Related Options Summary

| Option | Type | Default | Description |
|---|---|---|---|
| `validateOnInit` | boolean | `true` | Validate on form creation |
| `validateOnSubmit` | boolean | `true` | Validate on submit |
| `validateOnBlur` | boolean | `true` | Validate on field blur |
| `validateOnChange` | boolean | `false` | Validate on every value change |
| `validateOnChangeAfterInitialBlur` | boolean | `false` | Validate on change after first blur |
| `validateOnChangeAfterSubmit` | boolean | `false` | Validate on change after first submit |
| `validateOnClear` | boolean | `false` | Validate on clear |
| `validateOnReset` | boolean | `false` | Validate on reset |
| `validateDisabledFields` | boolean | `false` | Validate disabled fields |
| `validateDeletedFields` | boolean | `false` | Validate soft-deleted fields |
| `validatePristineFields` | boolean | `true` | Validate untouched fields |
| `validateTrimmedValue` | boolean | `false` | Trim value before validation |
| `stopValidationOnError` | boolean | `false` | Stop after first driver finds error |
| `validationPluginsOrder` | string[] | `undefined` | Custom driver execution order |
| `resetValidationBeforeValidate` | boolean | `true` | Clear errors before re-validating |
| `validationDebounceWait` | number | `250` | Debounce interval (ms) |
| `validationDebounceOptions` | object | `{ leading: false, trailing: true }` | Debounce leading/trailing config |
| `showErrorsOnInit` | boolean | `false` | Show errors on form init |
| `showErrorsOnSubmit` | boolean | `true` | Show errors on submit |
| `showErrorsOnBlur` | boolean | `true` | Show errors on blur |
| `showErrorsOnChange` | boolean | `true` | Show errors on change |
| `showErrorsOnClear` | boolean | `false` | Show errors on clear |
| `showErrorsOnReset` | boolean | `true` | Show errors on reset |

---

## See Also

- [Error Handling](../error-handling.md) — `submitThrowsError`, `defaultGenericError`, server error mapping
- [Performance & SSR](../performance-ssr.md) — debounce, lazy triggers
- [Validation & Submit Actions](../actions/validate.md) — programmatic control
