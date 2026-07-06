# Validation

## Overview

mobx-react-form ships with a **pluggable validation system**. You can choose one or more validation backends (called _drivers_) and attach them to the form at initialization. Each driver is responsible for validating each field and pushing error messages into the field's `validationErrorStack`.

Validation can be triggered:

- **Automatically** — on field blur, change, form init, submit, clear, reset (configurable via options)
- **Manually** — via `form.validate()`, `field.validate()`, or `form.submit()`

> For a deeper dive into the validation lifecycle (what happens when, in what order), see the [Validation Lifecycle](lifecycle.md) page.

---

## Choosing a Validation Plugin

| Style | Driver | Best For | Example |
|---|---|---|---|
| **Custom functions** | VJF | Full control, custom logic, server checks | `({ field }) => [field.value.length > 3, 'Too short']` |
| **Declarative rules** | DVR | Simple string-based rules (like Laravel) | `'required or email or min:5'` |
| **JSON Schema** | SVK | JSON-first projects, API compatibility | `{ type: 'string', minLength: 3 }` |
| **Object schema** | YUP | Modern JS/TS, chainable API | `y.string().required().min(3)` |
| **Object schema** | JOI | Enterprise-grade, rich error messages | `j.string().min(3).required()` |
| **TypeScript schema** | ZOD | TypeScript-first, type inference | `z.string().min(3)` |

### When to use what

| Use Case | Recommended |
|---|---|
| Simple forms with basic rules | **DVR** — fastest to write |
| Full control over validation logic | **VJF** — write any function |
| JSON Schema compliance (API validation) | **SVK** — standards-based |
| Modern object-oriented validation | **YUP** — popular, good DX |
| Enterprise / complex schemas | **JOI** — battle-tested, rich errors |
| TypeScript-native with infer | **ZOD** — best TS integration |

### Can I use multiple plugins?

**Yes.** You can enable multiple plugins simultaneously. Validation runs through all enabled drivers in sequence (configurable via `validationPluginsOrder`). If `stopValidationOnError` is `true`, subsequent drivers are skipped once a field has an error.

---

## Plugin Comparison

| Feature | VJF | DVR | SVK | YUP | JOI | ZOD |
|---|---|---|---|---|---|---|
| **Custom validation functions** | ✅ Native | ❌ | ❌ | ❌ | ❌ | ❌ |
| **String-based rules** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **JSON Schema** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Chainable API** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Async validation** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Extend with custom rules** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Automatic error messages** | User-defined | ✅ | ✅ | ✅ | ✅ | ✅ |
| **TypeScript inference** | No | No | No | Partial | Partial | ✅ |

> **VJF**, **DVR** and **SVK** support async validation and custom extension (via the `extend` callback).
> **YUP**, **JOI** and **ZOD** do not support the `extend` callback or async validation pipelines — they rely on their own native APIs for those features.

---

## Setup Pages

### Choose your plugin

- [Setup VJF — Vanilla JavaScript Functions](plugins/VJF/setup.md)
- [Setup DVR — Declarative Validation Rules](plugins/DVR/setup.md)
- [Setup SVK — Schema Validation Keywords](plugins/SVK/setup.md)
- [Setup YUP — Object Schema Validator](plugins/YUP/setup.md)
- [Setup JOI — Object Schema Validator](plugins/JOI/setup.md)
- [Setup ZOD — TypeScript-First Schema Validation](plugins/ZOD/setup.md)

### Extend with custom rules

> Available only for **VJF**, **DVR** and **SVK**.

- [Extend VJF — Custom Validation Functions](plugins/VJF/extend.md)
- [Extend DVR — Custom Declarative Rules](plugins/DVR/extend.md)
- [Extend SVK — Custom JSON Schema Keywords](plugins/SVK/extend.md)

### Async validation

> Available only for **VJF**, **DVR** and **SVK**.

- [Async VJF](plugins/VJF/async.md)
- [Async DVR](plugins/DVR/async.md)
- [Async SVK](plugins/SVK/async.md)

---

## Related Guides

- [Validation Lifecycle](lifecycle.md) — when validation fires, field filtering, plugin ordering
- [Error Handling](../error-handling.md) — `submitThrowsError`, `defaultGenericError`, server error mapping
- [Performance & SSR](../performance-ssr.md) — `validationDebounceWait`, `stopValidationOnError`, validation triggers
- [Validation & Submit Actions](../actions/validate.md) — `validate()`, `submit()`, `check()`, `invalidate()`
- [Validation Hooks](../events/validation-hooks.md) — `onSuccess`, `onError`, extending hooks
