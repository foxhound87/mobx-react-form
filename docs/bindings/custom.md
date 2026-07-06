# Custom Bindings

Create custom bindings for third-party UI libraries like Material-UI, Ant Design, or Bootstrap.

> All examples below use **Material-UI TextField**, but the same pattern applies to any component library.

---

## Implement a Rewriter (Simple)

A Rewriter maps field props to component props. Use this when you only need to rename props.

```javascript
class MyForm extends Form {
  bindings() {
    return {
      // The key is the binding name — set it on each field via `bindings: 'MaterialTextField'`
      MaterialTextField: {
        id: 'id',
        name: 'name',
        type: 'type',
        value: 'value',
        label: 'floatingLabelText',      // field.label → component.floatingLabelText
        placeholder: 'hintText',          // field.placeholder → component.hintText
        disabled: 'disabled',
        error: 'errorText',               // field.error → component.errorText
        onChange: 'onChange',
        onBlur: 'onBlur',
        onFocus: 'onFocus',
        autoFocus: 'autoFocus',
      },
    };
  }
}
```

**Precedence:** In any Rewriter, props passed to `bind()` take precedence over field properties.

### Usage

Assign the binding name to each field:

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    placeholder: 'Insert User Name',
    rules: 'required|string|between:5,15',
    bindings: 'MaterialTextField', // ← use the custom binding
  },
};
```

Then use `bind()` on the component:

```jsx
import TextField from 'material-ui/TextField';

const FormField = observer(({ field }) => (
  <div>
    <TextField {...field.bind()} />
  </div>
));
```

### Apply to all fields of a type

Use the `onInit` hook to assign a binding to all matching fields automatically:

```javascript
class MyForm extends Form {
  onInit() {
    this.each(field =>
      field.type === 'text' && field.set('bindings', 'MaterialTextField')
    );
  }
}
```

Or via field-level `onInit`:

```javascript
class MyField extends Field {
  onInit() {
    if (this.type === 'text') this.set('bindings', 'MaterialTextField');
  }
}
```

---

## Implement a Template (Full Control)

Use a Template when you need:
- Custom event handlers shared across all fields
- Different fallback priority (e.g., `bind()` props as fallbacks, field props as primary)
- Conditional logic (e.g., loading indicator during async validation)
- Access to the `form` instance for global state (e.g., `form.submitting`)

```javascript
// Custom onBlur that triggers validation
const onBlur = field => (e) => {
  e.preventDefault();
  field.onBlur();
  field.validate();
};

class MyForm extends Form {
  bindings() {
    return {
      MaterialTextField: ({ $try, form, field, props }) => ({
        type: $try(props.type, field.type),
        id: $try(props.id, field.id),
        name: $try(props.name, field.name),
        value: $try(props.value, field.value),
        floatingLabelText: $try(props.label, field.label),
        hintText: $try(props.placeholder, field.placeholder),

        // Conditional: show loading indicator during async validation
        errorText: field.validating
          ? 'Validating...'
          : $try(props.error, field.error),
        errorStyle: field.validating
          ? { background: 'yellow', color: 'black' }
          : {},

        // Global state: disabled while form is submitting
        disabled: props.disabled || field.disabled || form.submitting,

        // Custom event handler
        onChange: $try(props.onChange, field.onChange),
        onBlur: $try(props.onBlur, onBlur(field)),
        onFocus: $try(props.onFocus, field.onFocus),
        autoFocus: $try(props.autoFocus, field.autoFocus),
      }),
    };
  }
}
```

**Template function parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `$try` | function | Helper: returns the first defined argument |
| `form` | Form | The form instance (access `form.submitting`, `form.disabled`, etc.) |
| `field` | Field | The current field instance |
| `props` | object | Props passed to `bind()` at the component level |
| `keys` | object | (optional) The Rewriter key mapping if used alongside a template |

> In the `default` Rewriter, `props` takes precedence over `field`. In a custom Template, you control the priority — swap `$try(props.x, field.x)` to `$try(field.x, props.x)` to give field values priority over component props.
