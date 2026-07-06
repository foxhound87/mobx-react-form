# Field Bindings

Bindings connect your field definitions to your input components. They map field properties (`value`, `label`, `onChange`, etc.) to component props, reducing boilerplate and keeping your code clean.

---

## Quick Visual Example

Without bindings, you pass each field prop manually:

```jsx
// Without bindings — manual, repetitive
<input
  type={field.type}
  value={field.value}
  placeholder={field.placeholder}
  disabled={field.disabled}
  onChange={field.onChange}
  onBlur={field.onBlur}
  onFocus={field.onFocus}
/>
```

With bindings, `field.bind()` does all of the above automatically:

```jsx
// With bindings — clean, consistent
<input {...field.bind()} />
```

The result is identical — `bind()` returns an object of props that the input receives:

```javascript
// What bind() returns internally:
{
  type: 'text',
  value: 'SteveJobs',
  placeholder: 'Enter username',
  disabled: false,
  onChange: field.onChange,
  onBlur: field.onBlur,
  onFocus: field.onFocus,
  autoFocus: false,
  id: 'username',
  name: 'username',
}
```

---

## Why Use Bindings?

- **Reduce boilerplate** — one `{...field.bind()}` replaces 10+ manual props
- **Consistency** — all fields follow the same prop mapping
- **Override support** — pass props to `bind()` that take precedence over field values
- **Customizable** — two modes for different needs: Rewriter (simple mapping) and Template (full control)
- **Fallback chain** — props → field values → defaults, handled automatically

---

## How It Works

The binding system has two modes:

| Mode | What it is | Best for |
|------|-----------|----------|
| **Rewriter** | An object mapping field prop names → component prop names | Simple remapping (e.g., `label` → `floatingLabelText` for Material-UI) |
| **Template** | A function building the output props object | Full control: custom event handlers, fallback priorities, conditional logic |

### The `bind()` method

Every field has a `bind(props?)` method:

```javascript
const outputProps = field.bind();
// or with overrides:
const outputProps = field.bind({ type: 'password', placeholder: 'Enter password' });
```

The `ref` is set automatically — `<input {...field.bind()} />` assigns the DOM node to `field.$ref`.

### Built-in Default

The library ships with a built-in `default` binding that maps standard HTML input attributes:

```javascript
// Default Rewriter (built-in)
{
  id: 'id',
  name: 'name',
  type: 'type',
  value: 'value',
  checked: 'checked',
  label: 'label',
  placeholder: 'placeholder',
  disabled: 'disabled',
  autoComplete: 'autoComplete',
  onChange: 'onChange',
  onBlur: 'onBlur',
  onFocus: 'onFocus',
  autoFocus: 'autoFocus',
  inputMode: 'inputMode',
  onKeyUp: 'onKeyUp',
  onKeyDown: 'onKeyDown',
}
```

---

### [Default Bindings](default.md)
  Simple usage, properties overwrite, built-in template & rewriter.

### [Custom Bindings](custom.md)
  Implement custom rewriters and templates for third-party UI libraries.
