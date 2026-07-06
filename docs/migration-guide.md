# Migration Guide

Key breaking changes and migration steps between major versions of mobx-react-form.

---

## 5.x → 6.x

### TypeScript Rewrite (6.0.0)

The library was rewritten in TypeScript. Both import styles are supported and equivalent:

```javascript
import MobxReactForm from 'mobx-react-form';  // default export (still works)
import { Form } from 'mobx-react-form';       // named export (added in v6)
```

> The named export `{ Form }` was added in v6 alongside the existing default export. Both work — choose whichever fits your project's convention.

### Validation Plugin Setup Changed

**Before (v5.x):**
```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
```

**After (v6.x):**
```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
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
import { Form } from 'mobx-react-form';

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
import { PathsOf } from 'mobx-react-form';

type Paths = PathsOf<{ club: { name: string } }>;
// "club" | "club.name"
```

### New: `FieldDefinition` Interface

```typescript
import type { FieldDefinition } from 'mobx-react-form';

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

- Check the [CHANGELOG](https://github.com/foxhound87/mobx-react-form/blob/master/CHANGELOG.md) for full version history
- [Open an issue](https://github.com/foxhound87/mobx-react-form/issues) on GitHub
- Review the [Quick Start](quick-start.md) for the latest setup instructions
