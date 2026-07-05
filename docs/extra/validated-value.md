# Validated Value & Flat Map

How MobX React Form resolves **which value to validate** and how to get **all validated values at once**.

---

## `validatedWith` (Field Prop)

By default, a field validates its `value` property. But you can tell the form to validate a **different property** using the `validatedWith` field prop.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `validatedWith` | `string` | `'value'` | The field property to validate instead of `value` |

### When to use it

- **Validate `extra` metadata** instead of the input value
- **Validate a computed value** that differs from the stored value
- **Cross-validate** derived values without mixing concerns

### Example: validate `extra` instead of `value`

```javascript
const fields = {
  myField: {
    value: 'user-input',
    extra: { internal: 'metadata' },
    validatedWith: 'extra',
    rules: 'required', // validates field.extra, not field.value
  },
};
```

---

## `validatedValue` (Field Computed Property)

Returns the value of the property specified by `validatedWith`. It is the **actual value that validation runs against**.

```javascript
// Default: validatedWith === 'value'
field.validatedValue === field.value

// Custom: validatedWith === 'extra'
field.validatedValue === field.extra
```

This property is particularly useful when you need to **inspect what the form considered for validation**, especially in custom validation functions:

```javascript
function customValidator({ field }) {
  const value = field.validatedValue; // uses the correct prop automatically
  return [value.length > 0, 'Must not be empty'];
}
```

---

## `flatMapValues` (Form Computed Property)

Returns a **flat object mapping every field's path to its `validatedValue`**, regardless of nesting depth.

```javascript
form.flatMapValues;
// => {
//   'username': 'johndoe',
//   'address.street': '123 Main St',
//   'address.city': 'New York',
//   'members[0].firstname': 'Alice',
//   'members[0].lastname': 'Smith',
//   'members[1].firstname': 'Bob',
// }
```

### Why use it?

- **Serialization**: Get a flat, path-keyed snapshot of all validated values
- **API payloads**: Send to backends that expect flat key-value pairs
- **Debugging**: Quickly inspect every field's validation target
- **Logging**: Capture form state before submission

### Comparison with `values()`

| Method | Returns | Includes nested? | Uses `validatedWith`? |
|--------|---------|------------------|----------------------|
| `values()` | Nested object | Yes (as nested object) | No (always `value`) |
| `flatMapValues` | Flat path-keyed object | Yes (as dot/flat paths) | Yes (respects `validatedWith`) |

```javascript
// Nested structure
form.values();
// => { club: { name: 'Jazz Club', city: 'New York' } }

// Flat path-keyed
form.flatMapValues;
// => { 'club.name': 'Jazz Club', 'club.city': 'New York' }
```

> **Note:** `validatedValues` is the deprecated alias for `flatMapValues`. Use `flatMapValues` in new code.

---

## Example: Putting It All Together

```javascript
const fields = [
  'username',
  'profile.displayName',
  'profile.email',
];

const values = {
  username: 'johndoe',
  profile: {
    displayName: 'John Doe',
    email: 'john@example.com',
  },
};

const validatedWith = {
  'profile.displayName': 'extra', // validates field.extra instead
};

const form = new Form({ fields, values, validatedWith });

// Access individual validated values
form.$('username').validatedValue;       // 'johndoe'
form.$('profile.displayName').validatedValue; // field.extra value

// Get all validated values as flat map
form.flatMapValues;
// => {
//   'username': 'johndoe',
//   'profile.displayName': <field.extra value>,
//   'profile.email': 'john@example.com',
// }
```

---

## Key Takeaways

1. **`validatedWith`** lets you validate a different field property than `value` (e.g., `extra`, `label`).
2. **`validatedValue`** returns the actual value that validation runs against.
3. **`flatMapValues`** gives a flat path-keyed object of all validated values — perfect for serialization.
4. **Use `flatMapValues`** instead of the deprecated `validatedValues`.
