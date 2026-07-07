# API Reference

Welcome to the API Reference. Use this page as a hub to quickly find the property, method, or handler you need.

---

## [Form Properties](form-properties.md)

Computed and observable properties of the **Form** instance.

| Category | Properties |
|----------|-----------|
| **Validation** | `isValid`, `hasError`, `error`, `validating`, `validated` |
| **Interaction** | `focused`, `touched`, `changed`, `submitting`, `submitted`, `disabled` |
| **State** | `isDirty`, `isPristine`, `isDefault`, `isEmpty` |
| **Structure** | `size`, `hasNestedFields`, `hasIncrementalKeys` |
| **Output** | `flatMapValues` |

→ [Full Form Properties reference](form-properties.md)

---

## [Form Methods](form-methods.md)

Methods available on the **Form** instance — actions, helpers, event handlers, and MobX integrations.

| Category | Methods |
|----------|---------|
| **Navigation** | `$()`, `select()`, `has()` |
| **Value** | `get()`, `set()`, `update()`, `add()`, `del()`, `move()` |
| **Validation** | `validate()`, `check()`, `invalidate()`, `resetValidation()`, `showErrors()` |
| **Actions** | `clear()`, `reset()`, `submit()`, `focus()`, `blur()` |
| **Helpers** | `values()`, `errors()`, `labels()`, `placeholders()`, `defaults()`, `initials()`, `types()` |
| **Iteration** | `map()`, `reduce()`, `each()` |
| **Event Handlers** | `onSubmit()`, `onClear()`, `onReset()`, `onAdd()`, `onDel()`, `onDrop()` |
| **MobX** | `observe()`, `intercept()`, `dispose()` |

→ [Full Form Methods reference](form-methods.md)

---

## [Fields Properties](fields-properties.md)

All properties available on each **Field** instance — both editable props you define and computed props you read at runtime.

### Editable Props

| Category | Properties |
|----------|-----------|
| **Value & Display** | `type`, `value`, `initial`, `default`, `label`, `placeholder`, `extra` |
| **Input Behavior** | `disabled`, `deleted`, `nullable`, `autoFocus`, `inputMode`, `autoComplete`, `ref` |
| **Validation** | `rules`, `validators`, `validatedWith`, `related` |
| **Converters** | `converter`, `converters`, `input`, `output`, `computed` |
| **Bindings** | `bindings`, `options`, `class`, `classes` |
| **Events** | `hooks`, `handlers`, `observers`, `interceptors` |
| **Nested** | `fields`, `name` |

### Computed Props

| Category | Properties |
|----------|-----------|
| **Validation** | `isValid`, `hasError`, `error`, `errorSync`, `errorAsync`, `validating`, `validated` |
| **Identity** | `key`, `name`, `path`, `id`, `size`, `hasNestedFields`, `hasIncrementalKeys` |
| **Interaction** | `focused`, `blurred`, `touched`, `changed`, `submitting`, `submitted` |
| **Value** | `isDirty`, `isPristine`, `isDefault`, `isEmpty`, `checked`, `validatedValue`, `files` |
| **State** | `showError`, `actionRunning`, `resetting`, `clearing`, `validationErrorStack` |

→ [Full Fields Properties reference](fields-properties.md)

---

## [Fields Methods](fields-methods.md)

Methods available on each **Field** instance and the **Form** instance (shared base class).

| Category | Methods |
|----------|---------|
| **Navigation** | `$()`, `select()`, `has()`, `container()` |
| **Value** | `get()`, `set()`, `update()`, `add()`, `del()`, `move()` |
| **Validation** | `validate()`, `check()`, `invalidate()`, `resetValidation()` |
| **Actions** | `clear()`, `reset()`, `submit()`, `focus()`, `blur()`, `trim()` |
| **UI & Bindings** | `bind()`, `showErrors()` |
| **Helpers** | `values()`, `errors()`, `labels()`, `placeholders()`, `defaults()`, `initials()`, `types()` |
| **Iteration** | `map()`, `reduce()`, `each()` |
| **Event Handlers** | `sync()`, `onChange()`, `onToggle()`, `onFocus()`, `onBlur()`, `onKeyDown()`, `onKeyUp()`, `onDrop()`, `onSubmit()`, `onClear()`, `onReset()`, `onAdd()`, `onDel()` |
| **MobX** | `observe()`, `intercept()`, `dispose()` |

→ [Full Fields Methods reference](fields-methods.md)

---

## Quick Links by Topic

| If you need... | Start here |
|----------------|-----------|
| Form-level computed props (isValid, isDirty, error...) | [Form Properties](form-properties.md) |
| Field-level computed props (path, touched, changed...) | [Fields Properties](fields-properties.md) — Computed Props section |
| Field definition props (label, rules, hooks, bindings...) | [Fields Properties](fields-properties.md) — Editable Props section |
| Reading and writing values | [Form Methods](form-methods.md) — Value Operations |
| Validation and submit | [Form Methods](form-methods.md) — Validation section |
| Dynamic arrays (add/delete/move) | [Form Methods](form-methods.md) — Value Operations |
| Keyboard events | [Fields Methods](fields-methods.md) — Event Handlers |
| File upload | [Fields Methods](fields-methods.md) — Event Handlers (`onDrop`) |
| MobX observe/intercept | [Form Methods](form-methods.md) — MobX Events |
| Iterating over fields | [Fields Methods](fields-methods.md) — Iteration |
| UI bindings | [Fields Methods](fields-methods.md) — UI & Bindings |
