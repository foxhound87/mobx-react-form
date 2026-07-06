# Default Bindings

The built-in `default` bindings work with standard HTML inputs and most React form components.

---

## Simple Usage

```jsx
import { observer } from 'mobx-react';

const InputField = observer(({ field }) => (
  <div>
    <label>{field.label}</label>
    <input {...field.bind()} />
  </div>
));
```

The `bind()` method returns an object with all the props your input needs:

```javascript
field.bind();
// → {
//   id: 'username',
//   name: 'username',
//   type: 'text',
//   value: 'SteveJobs',
//   placeholder: 'Enter username',
//   disabled: false,
//   onChange: field.onChange,
//   onBlur: field.onBlur,
//   onFocus: field.onFocus,
//   autoFocus: false,
// }
```

> `bind()` also sets the `ref` automatically — `field.$ref` points to the DOM node for `focus()` and `blur()`.

---

## Properties Override

Pass props to `bind()` to override field values at the component level:

```jsx
const PasswordField = observer(({ field }) => (
  <div>
    <input {...field.bind({ type: 'password', placeholder: 'Enter password' })} />
  </div>
));
```

**Override precedence:** `bind()` props **take precedence** over field properties in the default Rewriter.

> Props passed to `bind()` do **not** mutate the field store — they only affect the rendered output. Use this for edge cases. For normal field configuration, [define fields](../fields/) instead.

---

## Built-in Default Rewriter

The default Rewriter maps field prop names to HTML attribute names:

```javascript
// Built-in — no configuration needed
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

**How the Rewriter works internally:**

```javascript
// Simplified logic from Bindings.ts:
each(rewriter, (componentProp, fieldProp) => {
  output[componentProp] = $try(props[fieldProp], field[fieldProp]);
});
```

`$try()` returns the first defined value — so `bind()` props take priority, then field values.

---

## Override the Default Template

If you need to customize the fallback chain or add logic without changing all field bindings names, override the `default` template:

**Via the Form constructor:**

```javascript
const bindings = {
  default: ({ $try, form, field, props, keys }) => ({
    [keys.type]: $try(props.type, field.type),
    [keys.value]: $try(props.value, field.value),
    [keys.label]: $try(props.label, field.label),
    [keys.placeholder]: $try(props.placeholder, field.placeholder),
    [keys.disabled]: $try(props.disabled, field.disabled),
    [keys.onChange]: $try(props.onChange, field.onChange),
    [keys.onBlur]: $try(props.onBlur, field.onBlur),
    [keys.onFocus]: $try(props.onFocus, field.onFocus),
    [keys.autoFocus]: $try(props.autoFocus, field.autoFocus),
  }),
};

new Form({ ... }, { bindings });
```

**Via class extension:**

```javascript
class MyForm extends Form {
  bindings() {
    return {
      default: ({ $try, form, field, props }) => ({
        type: $try(props.type, field.type),
        value: $try(props.value, field.value),
        label: $try(props.label, field.label),
        placeholder: $try(props.placeholder, field.placeholder),
        disabled: $try(props.disabled, field.disabled),
        onChange: $try(props.onChange, field.onChange),
        onBlur: $try(props.onBlur, field.onBlur),
        onFocus: $try(props.onFocus, field.onFocus),
      }),
    };
  }
}
```

**The template function receives:**

| Param | Type | Description |
|-------|------|-------------|
| `$try` | function | Helper: returns the first defined argument |
| `form` | Form | The form instance (access `form.submitting`, `form.disabled`, etc.) |
| `field` | Field | The current field instance |
| `props` | object | Props passed to `bind()` at the component level |
| `keys` | object | The Rewriter key mapping (field prop → component prop names) |
