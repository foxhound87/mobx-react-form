# Migration Guide

Key breaking changes and migration steps between major versions of mobx-formkit.

---

## mobx-react-form 7.1 → mobx-formkit

`mobx-formkit` is the renamed successor of `mobx-react-form` (MRF): the legacy package was **renamed and deprecated on npm**, and the codebase and its API continue here unchanged (final legacy release: `mobx-react-form@7.1.0`). Migration is a drop-in swap — package name, imports and UMD globals only.

### Package, Imports & UMD Globals

| What                | Old (MRF 7.1)                                      | New (mobx-formkit)                                      |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| npm package         | `mobx-react-form`                                  | `mobx-formkit`                                          |
| default export      | `import MobxReactForm from 'mobx-react-form'`      | `import MobxFormkit from 'mobx-formkit'`                |
| named exports       | `{ Form }` (added in v6)                           | `import { Form, Field, ArrayMap } from 'mobx-formkit'`  |
| validation plugins  | `mobx-react-form/lib/validators/DVR`               | `mobx-formkit/lib/validators/DVR`                       |
| UMD script-tag globals | `MobxReactForm*`                                | `MobxFormkit*`                                          |
| DevTools form name  | `mobx-react-form`                                  | `mobx-formkit` (legacy name also accepted)              |

> **Breaking (UMD):** UMD bundle filenames and script-tag globals changed from `MobxReactForm*` to `MobxFormkit*` — update `<script src>` paths and global references accordingly. There is no alias; APIs are otherwise identical.

```bash
npm uninstall mobx-react-form
npm install --save mobx-formkit
```

### Form Definition

**Before — MRF 7.1:**

```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';
import MobxReactForm from 'mobx-react-form';

const fields = [
  { name: 'email', label: 'Email', rules: 'required|email|string|between:5,25' },
  { name: 'password', label: 'Password', rules: 'required|string|between:5,25', type: 'password' },
];

const plugins = { dvr: dvr({ package: validatorjs }) };
const myForm = new MobxReactForm({ fields }, { plugins, hooks });
```

**After — mobx-formkit:**

```javascript
import dvr from 'mobx-formkit/lib/validators/DVR';
import validatorjs from 'validatorjs';
import { Form } from 'mobx-formkit';

const fields = [
  { name: 'email', label: 'Email', rules: 'required|email|string|between:5,25' },
  { name: 'password', label: 'Password', rules: 'required|string|between:5,25', type: 'password' },
];

const plugins = { dvr: dvr({ package: validatorjs }) };
const myForm = new Form({ fields }, { plugins, hooks });
```

See [Quick Start](quick-start.md) and [Defining Fields](fields/index.md) for the full field definition modes.

### Field Access — `$()` and Bindings

**Before — MRF 7.1:**

```jsx
<form onSubmit={myForm.onSubmit}>
  <label htmlFor={myForm.$('email').id}>{myForm.$('email').label}</label>
  <input {...myForm.$('email').bind()} />
  <p>{myForm.$('email').error}</p>
</form>
```

**After — mobx-formkit:**

```jsx
<form onSubmit={myForm.onSubmit}>
  <label htmlFor={myForm.$('email').id}>{myForm.$('email').label}</label>
  <input {...myForm.$('email').bind()} />
  <p>{myForm.$('email').error}</p>
</form>
```

Identical: `$()` field selection, `bind()`, `values()`/`errors()` retrieval and computed state (`isValid`, `isDirty`, `touched`, …). See [Fields Methods](api-reference/fields-methods.md) and [Bindings](bindings/index.md).

### Validation — Plugins & Rules

**Before — MRF 7.1:**

```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

const plugins = { dvr: dvr({ package: validatorjs }) };
```

**After — mobx-formkit:**

```javascript
import dvr from 'mobx-formkit/lib/validators/DVR';
import validatorjs from 'validatorjs';

const plugins = { dvr: dvr({ package: validatorjs }) };
```

Only the import path changes. The `rules` string syntax (`'required|email'`), the 8 validation drivers (DVR, VJF, AJV, YUP, JOI, ZOD, VALIBOT, VINEJS), plugin setup and the validation lifecycle are unchanged. See [Validation Plugins](validation/plugins.md) and [Validation Lifecycle](validation/lifecycle.md).

### Events & Hooks

**Before — MRF 7.1:**

```javascript
const hooks = {
  onSuccess(form) {
    console.log('Form Values!', form.values());
  },
  onError(form) {
    console.log('All form errors', form.errors());
  },
};
```

**After — mobx-formkit:**

```javascript
const hooks = {
  onSuccess(form) {
    console.log('Form Values!', form.values());
  },
  onError(form) {
    console.log('All form errors', form.errors());
  },
};
```

Identical: hooks and curried handlers are passed in the constructor's second argument (`{ plugins, hooks, handlers, options, bindings, extra, name }`). See [Event Hooks](events/event-hooks.md), [Event Handlers](events/event-handlers.md) and [Validation Hooks](events/validation-hooks.md).

### Submit

**Before — MRF 7.1:**

```javascript
await myForm.submit(); // validates, then runs onSuccess / onError
```

**After — mobx-formkit:**

```javascript
await myForm.submit(); // identical
```

Submit, validate, clear and reset methods and the built-in event handlers (`onSubmit`, `onClear`, `onReset`) are unchanged. See [Form Methods](api-reference/form-methods.md) and [Validate & Check](actions/validate.md).

### What Does NOT Change

- Field definitions & parsing — unified, separated and `struct` modes work as before
- `$()`/`select()` access, nested fields (`address.city`, `members[].name`), `ArrayMap`
- Validation options (`validateOnChange`, `validationPluginsOrder`, …), converters, observers/interceptors, composer
- MobX peer range: `^5.15.0 || ^6.0.0 || ^7.0.0` (MobX 5 via the internal `compat` layer)

---

## 5.x → 6.x

### TypeScript Rewrite (6.0.0)

The library was rewritten in TypeScript. Both import styles are supported and equivalent:

```javascript
import MobxFormkit from 'mobx-formkit';  // default export (still works)
import { Form } from 'mobx-formkit';       // named export (added in v6)
```

> The named export `{ Form }` was added in v6 alongside the existing default export. Both work — choose whichever fits your project's convention.

### Validation Plugin Setup Changed

**Before (v5.x):**
```javascript
import dvr from 'mobx-formkit/lib/validators/DVR';
```

**After (v6.x):**
```javascript
import dvr from 'mobx-formkit/lib/validators/DVR';
import validatorjs from 'validatorjs';

const plugins = {
  dvr: dvr({ package: validatorjs }),  // mandatory `package` prop
};
```

> The `package` prop became mandatory when defining validation plugins.

### Options & Plugins in Constructor

In v6.x, `options` and `plugins` moved to the **second argument** of the Form constructor:

```javascript
// v6.x — second argument
new Form({ fields }, {
  options: { validateOnChange: true },
  plugins: { dvr: dvr({ package: validatorjs }) },
});
```

### `validationOrder` Renamed

`validationOrder` was renamed to `validationPluginsOrder`.

### `retrieveOnlyDirtyValues` Renamed

`retrieveOnlyDirtyValues` → `retrieveOnlyDirtyFieldsValues`.

### `retrieveOnlyEnabledFields` Renamed

`retrieveOnlyEnabledFields` → `retrieveOnlyEnabledFieldsValues`.

### `onClear`/`onReset` Behavior

In v5.x, `clear()` and `reset()` would run validation after clearing/resetting. In v6.11+, this behavior is opt-in via `validateOnClear` and `validateOnReset` options (both `false` by default).

---

## 6.12 → 6.13: TypeScript Strict Mode (Breaking)

Version 6.13.0 introduced full TypeScript strict mode with `strictNullChecks` and `noImplicitAny`. This is a **source-code** change — if you use the library from npm, your code is unaffected. If you extend the library's classes, you may need to update type annotations.

### New: Generic `Form<F>` and `Field<T>`

```typescript
import { Form } from 'mobx-formkit';

interface LoginForm {
  email: string;
  password: string;
}

const form = new Form<LoginForm>({ ... });
form.$('email'); // returns Field<string>
form.values();   // returns { email?: string; password?: string }
```

### New: `PathsOf<T>` Utility Type

```typescript
import { PathsOf } from 'mobx-formkit';

type Paths = PathsOf<{ club: { name: string } }>;
// "club" | "club.name"
```

### New: `FieldDefinition` Interface

```typescript
import type { FieldDefinition } from 'mobx-formkit';

const fields: Record<string, FieldDefinition> = {
  username: { label: 'Username', value: '' },
};
```

> These are additive — existing JavaScript code continues to work without changes.

---

## 6.11.0: Nullable Fields

Version 6.11.0 introduced the `nullable` field prop. If you were relying on fields accepting `null` values before this version, add `nullable: true`:

```javascript
const fields = {
  middleName: {
    label: 'Middle Name',
    nullable: true, // now required for null values
  },
};
```

---

## 6.3.0: Forms Composer & Strict Options

### `validators` Now Requires Array

The `validators` field prop no longer accepts a single function — an array is required:

```javascript
// v6.3+ — array required
validators: [isEmail]  // was: validators: isEmail
```

### New `strictSelect` and `strictSet` Options

```javascript
const options = {
  strictSelect: false,  // allow selecting undefined fields without error
  strictSet: false,     // allow setting props on undefined fields
};
```

---

## 5.8.0: `ref` Prop Renamed in Separated Mode

In separated mode, the prop is `refs` (plural):

```javascript
// v5.8+
const refs = { username: myRef };
new Form({ fields: ['username'], refs });
```

---

## 5.5.0: `add()`/`del()` No Longer Trigger `onChange`

Before v5.5.0, adding or deleting fields would trigger the `onChange` hook. Since v5.5.0, use `onAdd`/`onDel` hooks instead:

```javascript
const hooks = {
  onAdd(field) {
    console.log('Field added:', field.path);
  },
  onDel(field) {
    console.log('Field deleted:', field.path);
  },
};
```

---

## 1.32: Event Hooks & Handlers Rewrite

Version 1.32 introduced the current `hooks` and `handlers` system.

### Before (v<1.32)

```javascript
// Validation hooks passed as `onSubmit`
const onSubmit = {
  onSuccess(form) { ... },
  onError(form) { ... },
};
new Form({ ... }, { onSubmit });
```

### After (v1.32+)

```javascript
// Validation hooks passed as `hooks`
const hooks = {
  onSuccess(form) { ... },
  onError(form) { ... },
};
new Form({ ... }, { hooks });
```

---

## 1.31: `validateOnChange` Default Changed

`validateOnChange` default changed from `true` to `false`. To restore the old behavior:

```javascript
const options = {
  validateOnChange: true,
};
```

---

## Need Help?

- Check the [CHANGELOG](https://github.com/foxhound87/mobx-formkit/blob/master/CHANGELOG.md) for full version history
- [Open an issue](https://github.com/foxhound87/mobx-formkit/issues) on GitHub
- Review the [Quick Start](quick-start.md) for the latest setup instructions
