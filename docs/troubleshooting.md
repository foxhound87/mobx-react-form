# Troubleshooting & FAQ

Common issues, errors, and solutions when using mobx-react-form.

---

## Strict Select Error: "Key not found"

**Error:** `Key "fieldname" not found when trying to select field`

**Cause:** `strictSelect` is `true` (default), and you're trying to access a field that hasn't been defined yet. This commonly happens in:

- **Computed props** that reference other fields before they are created
- **`onInit` hooks** that access fields before initialization is complete

**Solution:** Set `strictSelect: false` in the form options:

```javascript
const options = {
  strictSelect: false,
};
```

Or check if the field exists before accessing it:

```javascript
form.$('myField')?.value; // safe access with optional chaining
```

---

## Validation Not Running

**Issue:** Field validation doesn't trigger on change or blur.

**Possible causes & solutions:**

| Cause | Solution |
|---|---|
| `validateOnChange` is `false` (default) | Set `validateOnChange: true` |
| `validateOnBlur` is `false` | Default is `true` — check your options haven't overridden it |
| Validation plugin not configured | Ensure you've passed the `plugins` object with a valid plugin |
| Field has no `rules` or `validators` | Add validation rules to the field definition |
| Validation debounce | Default debounce is `250ms` — wait for it or reduce `validationDebounceWait` |

---

## Form Not Validating on Init

**Issue:** `validateOnInit: true` (the default) doesn't seem to work.

**Check:**
- `showErrorsOnInit` is `false` by default, so errors are hidden even if validation runs
- Set `showErrorsOnInit: true` if you want to see errors immediately
- Ensure validation plugins are correctly configured

```javascript
const options = {
  validateOnInit: true,
  showErrorsOnInit: true,
};
```

---

## Field Value Not Updating

**Issue:** Changing an input value doesn't update the form state.

**Causes:**
1. **Missing Event Handler** — You need to use `field.onChange`, `field.sync`, or `field.bind()` on your input component
2. **Custom Component** — The component may use a different event shape. Use the `sync()` method or provide a custom handler
3. **Read-only value** — Check if the field has `disabled: true`

**Solution:**
```javascript
// Use bind() which automatically attaches all handlers
<input {...field.bind()} />

// Or use onChange explicitly
<input onChange={field.onChange} />

// For custom components, use sync()
<CustomInput onChange={field.sync} />
```

---

## "The DVR validation rules are defined but no DVR plugin provided"

**Cause:** You defined `rules` on a field but didn't configure the DVR plugin.

**Solution:** Install and configure the DVR plugin:

```bash
npm install --save validatorjs
```

```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

const plugins = {
  dvr: dvr({ package: validatorjs }),
};

new Form({ fields, rules }, { plugins });
```

---

## Form `submit()` Is Not a Function

**Issue:** `form.submit()` throws "not a function" error.

**Cause:** `submit()` is an **action** method (returns a Promise), while `onSubmit(e)` is an **event handler** (for use in JSX). They are different.

**Solution:**
```javascript
// In JSX (event handler):
<button type="submit" onClick={form.onSubmit}>Submit</button>

// In code (action):
form.submit().then(() => { ... });
```

---

## `form.values()` Returns Empty Object

**Issue:** Calling `form.values()` returns `{}`.

**Causes:**
1. **Fields not defined** — Make sure you've defined at least one field
2. **Only separated mode** — If using separated mode, ensure you defined the `fields` structure (array of strings)
3. **Field key mismatch** — Keys in `fields` must match keys in `values`, `labels`, etc.

---

## Changed Property Returns Number, Not Boolean

`form.changed` and `field.changed` return a **number** (the count of changes), not a boolean. This is intentional — it allows tracking how many times a field has been modified.

```javascript
if (form.changed > 0) { /* form has been changed */ }
if (form.$changed === 0) { /* pristine */ }
```

---

## How to Access Form Instance from a Field

Every field can access its parent form:

```javascript
field.state.form // returns the Form instance
form.state.options // returns the Options instance
```

---

## SSR / Server-Side Rendering

For SSR compatibility, implement a custom `uniqueId` function to generate deterministic field IDs:

```javascript
const options = {
  uniqueId: (field) => `${field.path}-${Date.now()}`,
};
```

---

## Performance with Large Forms

For forms with many fields (50+), consider:

```javascript
const options = {
  validationDebounceWait: 300,    // increase debounce
  stopValidationOnError: true,    // stop validating after first error
  retrieveOnlyDirtyFieldsValues: true, // only get changed values
  preserveDeletedFieldsValues: false,  // don't preserve deleted field values
};
```

Also consider lazy-loading field groups and using the Forms Composer for multi-step workflows.

---

## Plugin Not Found / Module Resolution

When importing validation plugins, use the correct path:

```javascript
// Correct imports:
import dvr from 'mobx-react-form/lib/validators/DVR';
import vjf from 'mobx-react-form/lib/validators/VJF';
import svk from 'mobx-react-form/lib/validators/SVK';
import yup from 'mobx-react-form/lib/validators/YUP';
import zod from 'mobx-react-form/lib/validators/ZOD';
import joi from 'mobx-react-form/lib/validators/JOI';
```

If you get module resolution errors, ensure your bundler (webpack, vite, etc.) can resolve the package.

---

## Still Stuck?

- [Open an issue](https://github.com/foxhound87/mobx-react-form/issues) on GitHub
- Check the [demo project](https://github.com/foxhound87/mobx-react-form-demo) for real-world examples
- Review the [API Reference](api-reference/README.md) for full method and property documentation
