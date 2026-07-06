# Add, Delete & Move

Dynamic field manipulation methods for array and nested fields.

---

## add()

Add a new field or nested field entry. Available on **Form** and **Field** instances that contain array fields.

### Empty add (auto-increment key)

If the field struct defines an **Array of Fields** (`[]`), calling `add()` without arguments creates a new empty field with an auto-incremented numeric key:

```javascript
form.$('hobbies').add();
```

### Simple arrays (no nested fields)

Use the `{ value: ... }` wrapper to set the value directly:

```javascript
form.$('hobbies').add({ value: 'soccer' });
form.$('hobbies').add({ value: 'tennis' });
```

### Nested arrays (fields with sub-fields)

Pass the field values directly — no `value` wrapper needed:

```javascript
form.$('members').add({ firstname: 'John', lastname: 'Doe' });
```

### Add multiple entries at once

Pass an array of objects:

```javascript
form.$('members').add([
  { firstname: 'Alice', lastname: 'Wonder' },
  { firstname: 'Bob', lastname: 'Marley' },
]);
```

### Named (non-incremental) field

Provide a custom `key` to create a named field instead of an incremental index:

```javascript
form.$('hobbies').add({
  key: 'favorite',
  value: 'soccer',
});
```

> These are not Event Handlers. If you need `onAdd(e)` with hook execution, see the [Event Handlers](../events/event-handlers#onadde--ondele) section.

---

## del()

Delete a field or nested field by key or path.

```javascript
form.del('hobbies[1]');
form.$('hobbies').del(1); // same as above

// Delete deep nested fields
form.$('member').del('hobbies[3]');
form.$('member.hobbies').del(3); // same as above
```

> `del()` is a programmatic action that does **not** trigger Event Handlers. Use `onDel(e)` if you need hook execution.

---

## move()

Move an array field item from one index to another. Available on **Form** and **Field** instances with array fields.

```javascript
form.move(fromIndex, toIndex);
form.$('hobbies').move(fromIndex, toIndex);
```

| Param | Type | Description |
|-------|------|-------------|
| `fromIndex` | number | Current index of the item to move |
| `toIndex` | number | Target index to place the item |

**Behavior:**
- No-op if `fromIndex === toIndex` or either index is out of bounds
- All field references, values, and validation state are preserved
- The change is fully tracked by MobX — observers re-render automatically

Internally, `move()` delegates to [ArrayMap](../advanced/array-map.md).

### Example with up/down buttons

```javascript
function handleMoveUp(index) {
  if (index > 0) form.$('hobbies').move(index, index - 1);
}

function handleMoveDown(index) {
  if (index < form.$('hobbies').size - 1)
    form.$('hobbies').move(index, index + 1);
}
```

### Example with drag-and-drop

```javascript
function handleDragEnd(event) {
  const { active, over } = event;
  if (active.id !== over.id) {
    form.$('products').move(
      items.findIndex((f) => f.key === active.id),
      items.findIndex((f) => f.key === over.id)
    );
  }
}
```

> `move()` is a pure action (no hooks involved). For the full sortable demo, see [Sortable Arrays](../advanced/sortable.md).
