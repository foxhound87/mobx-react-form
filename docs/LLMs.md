# Guide for AI Agents (LLMs)

A concise navigation guide for LLMs and AI coding agents reading the MobX React Form documentation.

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| **Package** | `mobx-react-form` |
| **NPM** | [npmjs.com/package/mobx-react-form](https://www.npmjs.com/package/mobx-react-form) |
| **GitHub** | [github.com/foxhound87/mobx-react-form](https://github.com/foxhound87/mobx-react-form) |
| **Docs** | [foxhound87.github.io/mobx-react-form](https://foxhound87.github.io/mobx-react-form/) |
| **Version** | 6.x (current: 6.18.0) |
| **License** | MIT |
| **Size** | ~8KB gzip (tree-shakeable) |
| **Dependencies** | MobX (peer dependency), React (optional — can be used headless) |

---

## 2. Architecture

```
npm install mobx-react-form
         │
    ┌────┴────┐
    │  Form   │  ← main class you instantiate
    └────┬────┘
         │ creates
    ┌────┴────┐
    │  Field  │  ← wraps each form field, extends Base
    └────┬────┘
         │
    ┌────┴────────┐
    │  Bindings   │  ← maps field props → component props
    └─────────────┘
```

### Core Classes

- **`Form`** — entry point. Accepts field definitions + options + plugins.
- **`Field`** — individual field instance. Holds value, validation state, event handlers.
- **`Base`** — shared methods for both Form and Field (`$()`, `get()`, `set()`, `validate()`, etc.).
- **`Options`** — form-level configuration (validation triggers, debounce, softDelete, etc.).
- **`Validator`** — plugin driver that runs validation rules.
- **`Bindings`** — mapping layer between Field props and UI component props.

### Constructor

```javascript
const form = new Form(
  { fields, values, labels, rules, ... },   // first arg: field definitions
  { plugins, hooks, options }               // second arg: config
);
```

---

## 3. Documentation Map (for quick lookup)

When an LLM needs to answer a question, use this table to find the right page:

| If the user asks about... | Open this page |
|---------------------------|----------------|
| Installation & first form | [`quick-start.md`](./quick-start.md) |
| Class-based setup | [`quick-start-class.md`](./quick-start-class.md) |
| Field definitions (flat/nested/unified/separated) | [`fields/index.md`](./fields/index.md) |
| Form options (validateOnChange, softDelete, etc.) | [`form/form-options.md`](./form/form-options.md) |
| Form initialization | [`form/form-initialization.md`](./form/form-initialization.md) |
| All form properties (isValid, error, size...) | [`api-reference/form-properties.md`](./api-reference/form-properties.md) |
| All form methods (validate, submit, clear...) | [`api-reference/form-methods.md`](./api-reference/form-methods.md) |
| All field properties (value, error, touched...) | [`api-reference/fields-properties.md`](./api-reference/fields-properties.md) |
| All field methods (bind, set, validate...) | [`api-reference/fields-methods.md`](./api-reference/fields-methods.md) |
| Getting/setting values | [`actions/get-set.md`](./actions/get-set.md) |
| Add/delete/move dynamic fields | [`actions/add-del.md`](./actions/add-del.md) |
| Validation & submit actions | [`actions/validate.md`](./actions/validate.md) |
| Clear, reset, focus | [`actions/clear-reset.md`](./actions/clear-reset.md) |
| Navigation & iteration ($, map, each) | [`actions/shared.md`](./actions/shared.md) |
| Helper methods (values(), errors(), etc.) | [`actions/helpers.md`](./actions/helpers.md) |
| Event handlers (onChange, onFocus, etc.) | [`events/event-handlers.md`](./events/event-handlers.md) |
| Event hooks (onInit, hooks lifecycle) | [`events/event-hooks.md`](./events/event-hooks.md) |
| Validation hooks (onSuccess, onError) | [`events/validation-hooks.md`](./events/validation-hooks.md) |
| Custom event handlers | [`events/event-handlers/constructor.md`](./events/event-handlers/constructor.md) |
| Custom event hooks | [`events/event-hooks/constructor.md`](./events/event-hooks/constructor.md) |
| Extend handlers class | [`events/event-handlers/extending.md`](./events/event-handlers/extending.md) |
| Extend hooks class | [`events/event-hooks/extending.md`](./events/event-hooks/extending.md) |
| Validation lifecycle | [`validation/lifecycle.md`](./validation/lifecycle.md) |
| Choosing a validation plugin | [`validation/index.md`](./validation/index.md) |
| Setup VJF (vanilla functions) | [`validation/plugins/VJF/setup.md`](./validation/plugins/VJF/setup.md) |
| Setup DVR (declarative rules) | [`validation/plugins/DVR/setup.md`](./validation/plugins/DVR/setup.md) |
| Setup SVK (JSON Schema) | [`validation/plugins/SVK/setup.md`](./validation/plugins/SVK/setup.md) |
| Setup YUP | [`validation/plugins/YUP/setup.md`](./validation/plugins/YUP/setup.md) |
| Setup JOI | [`validation/plugins/JOI/setup.md`](./validation/plugins/JOI/setup.md) |
| Setup ZOD | [`validation/plugins/ZOD/setup.md`](./validation/plugins/ZOD/setup.md) |
| Extend validators (VJF/DVR/SVK) | [`validation/plugins/VJF/extend.md`](./validation/plugins/VJF/extend.md) (also DVR, SVK variants) |
| Async validation | [`validation/plugins/VJF/async.md`](./validation/plugins/VJF/async.md) (also DVR, SVK variants) |
| Bindings (default & custom) | [`bindings/index.md`](./bindings/index.md) |
| Custom bindings for MUI/AntD | [`bindings/custom.md`](./bindings/custom.md) |
| Default bindings reference | [`bindings/default.md`](./bindings/default.md) |
| TypeScript usage & type inference | [`typescript.md`](./typescript.md) |
| Observers & Interceptors | [`advanced/observers.md`](./advanced/observers.md) & [`advanced/interceptors.md`](./advanced/interceptors.md) |
| Reactive computed props | [`extra/computed-props.md`](./extra/computed-props.md) |
| Input/Output converters | [`extra/converters.md`](./extra/converters.md) |
| Validated Value | [`extra/validated-value.md`](./extra/validated-value.md) |
| MobX observe/intercept | [`extra/mobx-events.md`](./extra/mobx-events.md) |
| Forms Composer (multi-form) | [`extra/composer.md`](./extra/composer.md) |
| Sortable lists | [`advanced/sortable.md`](./advanced/sortable.md) |
| Wizard (multi-step) | [`advanced/wizard.md`](./advanced/wizard.md) |
| File upload | [`advanced/file-upload.md`](./advanced/file-upload.md) |
| Cross validation | [`advanced/cross-validation.md`](./advanced/cross-validation.md) |
| Nested composition | [`advanced/nested-composition.md`](./advanced/nested-composition.md) |
| Markdown editor | [`advanced/markdown.md`](./advanced/markdown.md) |
| ArrayMap | [`advanced/array-map.md`](./advanced/array-map.md) |
| Extend Form & Field class | [`form/extend/generic.md`](./form/extend/generic.md) |
| Extend custom Field class | [`form/extend/custom.md`](./form/extend/custom.md) |
| Extend in field definitions | [`form/extend/configure.md`](./form/extend/configure.md) |
| Recipes & patterns | [`recipes.md`](./recipes.md) |
| Error handling | [`error-handling.md`](./error-handling.md) |
| Performance & SSR | [`performance-ssr.md`](./performance-ssr.md) |
| Troubleshooting & FAQ | [`troubleshooting.md`](./troubleshooting.md) |
| Migration guide | [`migration-guide.md`](./migration-guide.md) |
| DevTools | [`devtools.md`](./devtools.md) |
| UMD setup (vanilla JS) | [`umd-setup.md`](./umd-setup.md) |
| AI agent skills | [`skills.md`](./skills.md) |

---

## 4. Key Concepts & Vocabulary

| Term | Meaning |
|------|---------|
| **Unified Mode** | All field props in a single object per field |
| **Separated Mode** | Props split across parallel objects (values, labels, rules...) |
| **Mixed Mode** | Combine both modes; unified overrides separated |
| **Flat Fields** | Single-level form fields |
| **Nested Fields** | Fields nested in objects/arrays, accessed via dot notation |
| **DVR** | Declarative Validation Rules (string rules like `'required\|email'`) |
| **VJF** | Vanilla JavaScript Functions (custom validator functions) |
| **SVK** | JSON Schema Validation Keywords |
| **Bindings** | Mapping field props to UI component props via `field.bind()` |
| **Rewriter** | Simple object mapping prop names (e.g., `label` → `floatingLabelText`) |
| **Template** | Function that builds output props object (full control) |
| **Hooks** | Lifecycle callbacks (`onInit`, `onChange`, `onSuccess`, `onError`, etc.) |
| **Handlers** | Event handler functions (`onChange`, `onFocus`, `onKeyDown`, etc.) |
| **Related Fields** | Fields that trigger re-validation of other fields (`related: ['passwordConfirm']`) |
| **Soft Delete** | Mark fields as deleted without removing them (requires `softDelete: true` option) |
| **Fallback** | Option to resolve field props outside strict `struct`/`fields` definition (default: `true`) |
| **$()** | Universal field selector — `form.$('path')` or `field.$('subpath')` |
| **ArrayMap** | Utility for deeply nested dynamic arrays with MobX observable tracking |

---

## 5. Core Patterns

### Creating a Form

```javascript
import { Form } from 'mobx-react-form';
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

const form = new Form(
  { fields: [{ name: 'email', label: 'Email', rules: 'required|email' }] },
  { plugins: { dvr: dvr({ package: validatorjs }) } }
);
```

### Accessing Fields

```javascript
form.$('email');                    // → Field instance
form.$('address.city');            // nested via dot notation
form.$('members[0].firstname');    // array element by index
```

### Reading/Writing Values

```javascript
form.$('email').value;             // get
form.$('email').set('new@email');  // set
form.values();                     // all values as plain object
form.set('email', 'new@email');    // set via form
```

### Validation

```javascript
form.validate();                   // validate all fields
form.$('email').validate();        // validate single field
form.submit();                     // validate + call onSuccess/onError
form.$('email').validate({ related: true });  // validate field + related fields
form.check();                      // check-only (no error display)
form.showErrors();                 // show all validation errors
form.invalidate('email', 'Custom error');  // manually set error
```

### Event Hooks vs Handlers

- **Handlers** (`onSubmit`, `onChange`, `onFocus`, etc.) are methods on the Field. They receive `(event)` and are passed directly to DOM elements via `field.bind()`.
- **Hooks** (`onChange(field, e)`, `onInit(field)`, `onSuccess(form)`, etc.) are lifecycle callbacks you define. When triggered by a handler, hooks receive `(field, event)`. When called directly from actions, hooks receive only `(field)`.

Example:
```javascript
const hooks = {
  onSuccess(form) { console.log(form.values()); },
  onError(form) { console.log(form.errors()); },
};

const handlers = {
  onKeyDown: (field) => (e) => {
    if (e.key === 'Enter') field.submit();
  },
};
```

### Field Bindings

```jsx
<input {...form.$('email').bind()} />
// Equivalent to:
<input
  id="email"
  name="email"
  type="text"
  value="..."
  placeholder="..."
  disabled={...}
  onChange={field.onChange}
  onBlur={field.onBlur}
  ...
/>
```

### Custom Bindings (for UI libraries)

```javascript
const customBindings = {
  MaterialTextField: {
    rewriter: { label: 'floatingLabelText', placeholder: 'hintText' },
  },
};

const form = new Form(
  { fields: [{ name: 'email', bindings: 'MaterialTextField' }] },
  { options: { bindings: customBindings } }
);
```

---

## 6. Important Gotchas

| Gotcha | Detail |
|--------|--------|
| **Hooks args** | Hooks receive `(field, event)` when triggered by event handlers, but only `(field)` when called directly from actions. |
| **`stopValidationOnError`** | When `true`, validation stops at the first plugin that finds an error. |
| **`submitThrowsError`** | When `true` (default), `submit()` throws on validation error — wrap in try/catch. |
| **SoftDelete** | Requires `softDelete: true` option. Fields are not removed from the form but are excluded from `values()`. |
| **`field.ref`** | After `field.bind()` renders, `field.$ref` holds the DOM node reference. |
| **`field.validatedValue`** | Returns the value after converters are applied. |
| **`fallback` option** | When `true` (default), fields missing from `struct`/`fields` are auto-created from other props (values, labels, etc.). |
| **Separated mode auto-create** | Providing `values` without `fields` array implicitly creates fields. |
| **Array notation** | `members[]` in dot notation applies to all array elements. `members[].hobbies[]` is deeply nested arrays. |
| **Multiple plugins** | Enable multiple plugins; order is configurable via `validationPluginsOrder`. |

---

## 7. Quick Reference — Validation Plugins

| Driver | Rules Format | Async | Extend | Best For |
|--------|-------------|-------|--------|----------|
| **VJF** | Custom functions | ✅ | ✅ | Full control |
| **DVR** | String rules (`'required\|email'`) | ✅ | ✅ | Simple forms |
| **SVK** | JSON Schema | ✅ | ✅ | API compatibility |
| **YUP** | `y.string().required()` | ❌ | ❌ | Modern JS/TS |
| **JOI** | `j.string().required()` | ❌ | ❌ | Enterprise |
| **ZOD** | `z.string().min(3)` | ❌ | ❌ | TypeScript-native |

---

## 8. Related Repositories

| Repo | Purpose |
|------|---------|
| [mobx-react-form-demo](https://github.com/foxhound87/mobx-react-form-demo) | Live demo app with React components |
| [mobx-react-form-devtools](https://github.com/foxhound87/mobx-react-form-devtools) | DevTools panel for debugging |
| [rfx-core](https://github.com/foxhound87/rfx-core) | Core utilities (path matching) |
| [skills](https://github.com/foxhound87/skills) | AI skill files for Cursor, Windsurf, Claude Code, etc. |
| [mobx-react-form--docs](https://github.com/foxhound87/mobx-react-form--docs) | This documentation site |

---

> **For LLMs:** When helping users with mobx-react-form, always check the validation plugin being used (VJF vs DVR vs SVK vs YUP vs JOI vs ZOD) — patterns differ. Prefer hooks over raw handlers for most use cases. Use `field.bind()` instead of manual prop wiring.
