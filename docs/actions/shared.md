# Shared Actions

The shared actions can be used on the **Form** instance or every **Field** and nested field.

---

## Navigation & Iteration

### Field Selector

Select a field by path using dot notation for nested fields and `[]` for arrays.

```javascript
form.select('address.city');
form.select('members[3].firstname');
```

The `$()` alias works the same way and supports chaining:

```javascript
form.$('address.city');

// Dynamic chaining with variable index:
const n = 3;
form.$('members').$(n).$('firstname');
```

> `$(path)` is an alias for `select(path)`.

### Field Container

Get the parent field container, or `null` if already at the root:

```javascript
form.$('members[3].firstname').container(); // → members[3]
form.$('members[3]').container();            // → members
form.$('address.city').container();          // → address
form.container();                            // → null (root)
```

### has()

Check if a child field with the given key exists:

```javascript
form.has('members');     // true / false
form.$('members').has(0); // true / false
```

> Returns `boolean`.

### map()

Iterate over nested fields and collect results into an array:

```javascript
form.$('hobbies').map((field) => {
  return field.value;
});
```

### each()

Recursively iterate over all fields and nested fields. The callback receives each field:

```javascript
form.each((field) => {
  console.log(field.path, field.value);
});
```

### reduce()

Reduce over nested field values with an accumulator:

```javascript
form.$('products').reduce((sum, field) => {
  return sum + field.value.price;
}, 0);
```

---

## Value Operations

| Page | Methods covered |
|------|----------------|
| [Get & Set](get-set.md) | `get()`, `set()`, `update()` |
| [Add, Delete & Move](add-del.md) | `add()`, `del()`, `move()` |

## State Actions

| Page | Methods covered |
|------|----------------|
| [Clear, Reset & Focus](clear-reset.md) | `clear()`, `reset()`, `focus()`, `blur()`, `trim()` |
| [Validation & Submit](validate.md) | `validate()`, `check()`, `invalidate()`, `resetValidation()`, `showErrors()`, `submit()` |
