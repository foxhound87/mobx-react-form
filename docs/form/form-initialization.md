# Form Initialization

The Form Constructor accepts 2 arguments:

- [First Argument — Field Definitions](#first-constructor-argument)
- [Second Argument — Options, Plugins, Bindings](#second-constructor-argument)
- [Constructor Usage Examples](#constructor-usage)
- [Initialization Methods (class)](#initialization-methods)

---

## First Constructor Argument

The first argument defines the fields and their properties. It supports two modes:

- **Unified** — all field props in one `fields` object
- **Separated** — props split across parallel objects (`values`, `labels`, `rules`, etc.)

See [Defining Fields](../fields/) for a detailed comparison.

### Structure

| Property | Description | Help |
|----------|-------------|------|
| **struct** | Field structure as an array of string paths (dot + `[]` notation). Only needed for separated mode. | — |
| **fields** | **Unified mode:** an object of field definitions. **Separated mode:** an array of field path strings. | [Defining Fields](../fields/) |

### Field Properties (Separated Mode)

Props are passed as parallel objects keyed by field name or dot/array path.

#### Values & Display

| Prop Key | Description | Help |
|----------|-------------|------|
| **values** | Initial values for each field | [Fields docs](../fields/#flat-separated-mode) |
| **labels** | Human-readable field labels | [Fields docs](../fields/#flat-separated-mode) |
| **placeholders** | Placeholder text for inputs | [Fields docs](../fields/#flat-separated-mode) |
| **initials** | Initial values (fallback if `value` is not set) | [Fields docs](../fields/#flat-separated-mode) |
| **defaults** | Default values (applied on `reset()`) | [Fields docs](../fields/#flat-separated-mode) |

#### Behavior & State

| Prop Key | Description | Help |
|----------|-------------|------|
| **disabled** | Disabled state per field | [Fields docs](../fields/#flat-separated-mode) |
| **deleted** | Soft-deleted state (needs `softDelete` option) | [Fields docs](../fields/#flat-separated-mode) |
| **autoFocus** | Set to `true` on the first field to focus on init | — |
| **inputMode** | Mobile keyboard mode: `none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url` | — |
| **nullable** | Allow `null` field values | — |
| **autoComplete** | HTML autocomplete attribute for the field | — |
| **extra** | Extra metadata (useful for select option lists) | [Fields docs](../fields/#flat-separated-mode) |
| **options** | Per-field options (same keys as [Form Options](form-options.md), fallback to form-level) | [Form Options](form-options.md) |
| **bindings** | Name of the binding rewriter/template to use for this field | [Bindings](../bindings/) |

#### Validation

| Prop Key | Description | Help |
|----------|-------------|------|
| **rules** | DVR validation rules (e.g. `'required\|email'`) | [DVR setup](../validation/plugins/DVR/setup.md) |
| **validators** | VJF validation functions | [VJF setup](../validation/plugins/VJF/setup.md) |
| **validatedWith** | Validate a different field prop instead of `value` | — |
| **related** | Other field paths to validate together with this field | [Fields docs](../fields/#flat-separated-mode) |

#### Converters & Computed

| Prop Key | Description | Help |
|----------|-------------|------|
| **computed** | Function `({ form, field }) => value` for dynamic field values | [Computed Props](../extra/computed-props.md) |
| **converters** | Array of converter functions applied to the field value | — |
| **input** | Input converter function (`user input → stored value`) | [Converters](../extra/converters.md) |
| **output** | Output converter function (`stored value → output value`) | [Converters](../extra/converters.md) |

#### MobX Events

| Prop Key | Description | Help |
|----------|-------------|------|
| **observers** | MobX observers on field props or fields map changes | [Observe / Intercept](../extra/mobx-events.md) |
| **interceptors** | MobX interceptors on field props or fields map changes | [Observe / Intercept](../extra/mobx-events.md) |

#### Event Hooks & Handlers

| Prop Key | Description | Help |
|----------|-------------|------|
| **hooks** | Event hook functions. Available: `onInit`, `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel`, `onKeyUp`, `onKeyDown` | [Event Hooks](../events/event-hooks.md) |
| **handlers** | Event handler functions. Available: `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`, `onKeyUp`, `onKeyDown` | [Event Handlers](../events/event-handlers.md) |

#### Custom Field Classes

| Prop Key | Description | Help |
|----------|-------------|------|
| **classes** | Custom Field classes (must extend `Form.Field`) | [Extend in fields definition](../form/extend/configure.md) |

> **Note:** In **unified mode**, all props above are inlined inside each field definition object instead of being split across separate objects. See [Defining Fields](../fields/) for examples of both modes.

---

## Second Constructor Argument

The second argument configures plugins, options, bindings, and form-level hooks/handlers.

| Property | Description | Help |
|----------|-------------|------|
| **plugins** | Enable validation via external libraries | [Validation Plugins](../validation/plugins.md) |
| **options** | Form-level options (validation behavior, error display, etc.) | [Form Options](form-options.md) |
| **bindings** | Define how field props are passed to input components | [Props Bindings](../bindings/) |
| **extra** | Inject extra objects accessible as `form.extra` | — |
| **hooks** | Form-level event hooks. Available: `onInit`, `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel` | [Event Hooks](../events/event-hooks.md) |
| **handlers** | Form-level event handlers. Available: `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel` | [Event Handlers](../events/event-handlers.md) |

---

## Constructor Usage

```javascript
import { Form } from 'mobx-react-form';

// Unified fields only
new Form({ fields });

// Unified + plugins + bindings
new Form({ fields }, { plugins, bindings });

// Separated mode + options
new Form({ values, labels, handlers, ... }, { options });

// Separated mode + validation + plugins
new Form({ values, labels, handlers, rules, ... }, { plugins });

// Full setup
new Form(
  { fields, values, labels, rules },
  { plugins, options, bindings, hooks },
);
```

> All argument properties are optional and can be mixed freely.

---

## Initialization Methods

When extending the `Form` class, you can use methods instead of constructor arguments:

```javascript
import { Form } from 'mobx-react-form';

class MyForm extends Form {

  setup() {
    return { fields, values, labels /* same as first constructor arg */ };
  }

  plugins() {
    return { dvr: dvr({ package: validatorjs }) };
  }

  options() {
    return { validateOnChange: true };
  }

  bindings() {
    return { /* custom bindings */ };
  }

  hooks() {
    return { onSuccess(form) { /* ... */ } };
  }

  handlers() {
    return { onSubmit(e) { /* ... */ } };
  }
}
```

> The object returned by each method is merged with the constructor argument during initialization, giving you flexible composition.
