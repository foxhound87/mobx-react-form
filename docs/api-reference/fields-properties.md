# Fields Properties

Every field exposes **editable props** (set during definition, mutable at runtime) and **computed props** (read-only values derived from field state).

---

## Editable Props

Props you can define when creating fields and modify at runtime via `field.set(prop, value)`.

### Value & Display

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | string | `"text"` | HTML input type (`text`, `email`, `checkbox`, `file`, `number`, etc.) |
| `value` | any | `undefined` | Current field value |
| `initial` | any | `undefined` | Initial value on mount |
| `default` | any | `undefined` | Value used when `reset()` is called |
| `label` | string | `""` | Human-readable field label |
| `placeholder` | string | `""` | Placeholder text for the input |
| `extra` | any | `null` | Arbitrary metadata (useful for select options, custom data) |

### Input Behavior

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disabled` | boolean | `false` | Field disabled state |
| `deleted` | boolean | `false` | Soft-deleted state (requires `softDelete` option) |
| `nullable` | boolean | `false` | Allow `null` as a field value |
| `autoFocus` | boolean | `false` | Focus this field on form initialization |
| `inputMode` | string | `undefined` | Mobile keyboard mode: `none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url` |
| `autoComplete` | string | `undefined` | HTML `autocomplete` attribute |
| `ref` | React Ref | `undefined` | React ref, populated automatically when `bind()` is used |

### Validation

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rules` | string | `null` | DVR validation rules (e.g. `"required&#124;email&#124;min:6"`) |
| `validators` | array | `null` | VJF validation functions |
| `validatedWith` | string | `"value"` | Field prop to validate instead of `value` (see [validatedValue](../extra/validated-value.md)) |
| `related` | string[] | `[]` | Other field paths to re-validate when this field changes |

### Converters & Computed

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `converter` | function | identity | Function controlling the `value` computed prop output |
| `converters` | function[] | - | Array of converter functions |
| `input` | function | identity | Input converter: maps user input to stored value |
| `output` | function | identity | Output converter: maps stored value to output |
| `computed` | function | `undefined` | Dynamic value function: `({ form, field }) => value` |

### Bindings & Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bindings` | string | `"default"` | Key of the registered binding template/rewriter to use |
| `options` | object | `{}` | Per-field [Form Options](../form/form-options.md), with fallback on global options |
| `class` | class | `undefined` | Custom Field class (unified mode only, must extend `Form.Field`) |
| `classes` | object | `undefined` | Custom Field classes keyed by field path (separated mode only) |

### Events & MobX

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hooks` | object | `{}` | Event hook functions |
| `handlers` | object | `{}` | Event handler functions |
| `observers` | array | `null` | MobX observers on field props or fields map. Auto-loaded for dynamic arrays. |
| `interceptors` | array | `null` | MobX interceptors on field props or fields map. Auto-loaded for dynamic arrays. |

### Nested

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fields` | array | `undefined` | Nested sub-field definitions |
| `name` | string | `key` | Overrides the object key as field name (array syntax) |

---

## Computed Props

Read-only properties derived from the field state. Accessible at runtime (e.g. `field.isValid`, `field.error`).

### Validation State

| Property | Type | MobX | Description |
|----------|------|------|-------------|
| `isValid` | boolean | computed | `true` if the field and all nested fields pass validation |
| `hasError` | boolean | computed | `true` if the field or any nested field has errors |
| `error` | string | computed | First error message (`null` if no error, `null` when `showError` is `false`) |
| `errorSync` | string | observable | Synchronous error message |
| `errorAsync` | string | observable | Asynchronous error message (from async validation) |
| `validating` | boolean | computed | `true` while validation is in progress |
| `validated` | int | computed | Number of times the field has been validated |

### Identity & Structure

| Property | Type | MobX | Description |
|----------|------|------|-------------|
| `key` | string | - | Field key (same as `name` if not provided) |
| `name` | string | - | Field name (same as `key` if not provided) |
| `path` | string | - | Full field path (dot-notated for nested fields, e.g. `"address.city"`) |
| `size` | int | computed | Number of child fields (0 for leaf fields) |
| `id` | string | - | Unique field ID (generated by `uniqueId` option) |
| `hasNestedFields` | boolean | computed | `true` if the field contains nested sub-fields |
| `hasIncrementalKeys` | boolean | computed | `true` if nested fields use incremental numeric keys |

### State & Interaction

| Property | Type | MobX | Description |
|----------|------|------|-------------|
| `focused` | boolean | computed | `true` if the field is currently focused |
| `blurred` | boolean | computed | `true` if the field has lost focus at least once |
| `touched` | boolean | computed | `true` if the field has been focused at least once |
| `changed` | int | computed | Number of times the field value has changed |
| `submitting` | boolean | computed | `true` while the form/fieldset is submitting |
| `submitted` | int | computed | Number of times the fieldset has been submitted |
| `actionRunning` | boolean | computed | `true` while a clear, reset, or submit action is in progress (useful for loading spinners) |
| `resetting` | boolean | observable | `true` while the field is being reset |
| `clearing` | boolean | observable | `true` while the field is being cleared |

### Value Comparison

| Property | Type | MobX | Description |
|----------|------|------|-------------|
| `isDirty` | boolean | computed | `true` if the current value differs from the initial value |
| `isPristine` | boolean | computed | `true` if the current value equals the initial value |
| `isDefault` | boolean | computed | `true` if the current value equals the default value |
| `isEmpty` | boolean | computed | `true` if the field value is empty (delegates to child fields for nested fields) |

### Special

| Property | Type | MobX | Description |
|----------|------|------|-------------|
| `checked` | any | computed | Current value when `type` is `"checkbox"`; `undefined` otherwise |
| `validatedValue` | any | computed | Value of the field prop specified by `validatedWith` (default: `"value"`) |
| `files` | any | observable | File data populated by `onDrop` event handler for `type: "file"` fields |
| `showError` | boolean | observable | Controls whether error messages are visible |
| `validationErrorStack` | string[] | observable | Stack of validation error messages |

---

## Occurrence Strategy

Some computed props use different aggregation strategies when checking nested fields:

| Property | Strategy | Meaning |
|----------|----------|---------|
| `isValid`, `isPristine`, `isDefault`, `isEmpty` | **every** | Must be `true` for ALL nested fields |
| `hasError`, `isDirty`, `focused`, `blurred`, `touched` | **some** | `true` if ANY nested field is `true` |
