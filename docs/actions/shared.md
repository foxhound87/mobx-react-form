# Shared Actions

The shared actions can be used on the form instance or every field and nested field.

* [Update the fields](#update-the-fields)
* [Field Selector](#field-selector)
* [Field Container](#field-container)
* [Check Field Computed Values](#check-field-computed-values)
* [Programmatically Focus a Field](#programmatically-focus-a-field)
* [Programmatically Blur a Field](#programmatically-blur-a-field)
* [Trim Field Value](#trim-field-value)
* [move(fromIndex, toIndex)](#movefromindex-toindex)


* [Get Fields Properties](#get-fields-properties)
* [Set Fields Properties](#set-fields-properties)


* [has()](#has)
* [map()](#map)
* [each()](#each)
* [reduce()](#reduce)
* [add() & del()](#add--del)
* [clear() & reset()](#clear--reset)


* [Manual Submit](#manual-submit)
* [Validate a Field](#validate-a-field)
* [Validation Errors](#validation-errors)
* [Invalidate the Form or a single Field](#invalidate-the-form-or-a-single-field)
* [Reset Validation](#reset-validation)
* [Show / Hide Error Messages](#show--hide-error-messages)
---

### Update the fields

The `update()` method is intended to be used to recreate the fields tree and provide new values.

If you need to change the properties of existent/selected fields, consider to use the `set()` method instead.

If you need to handle arrays (add or remove elements), consider to use the `add()` and `del()` methods instead.

> This method only accept an `object` and will updated all fields `values`.

Update values from the form instance:

```javascript
.update({
  address: {
    city: 'Los Angeles'
  },
});
```

or the same selecting a nested field:

```javascript
.$('address').update({
  city: 'Los Angeles'
});
```

> Array notation can be used as well.

---

### Field Selector

Select the field passing the path using the dot notation:

```javascript
.select('address.city');
```

or you can use the alias `$()` as shortcut:

```javascript
.$('address.city');
```

> $(path) is like of select(path).

or you can retrive items from arrays:

```javascript
.$('members[3].firstname');
```

or you can retrive items from arrays dynamically chaining the selector

```javascript
const n = 3;

.$('members').$(n).$('firstname');
```

---

### Field Container

Select the parent field container.

```javascript
.$('members[3].firstname').container(); // members[3]
.$('members[3]').container(); // members
.$('address.city').container(); // address
```

---

### Check Field Computed Values

These computed values are allowed:

`hasError`, `isValid`, `isDirty`, `isPristine`, `isDefault`, `isEmpty`, `focused`, `touched`, `changed`.

```javascript
.check('isValid');
```

Use the second argument (boolean) if you want to check for nested fields too.

```javascript
.check('isValid', true);
```

---

### Programmatically Focus a Field

To focus a field:

```javascript
field.focus();
```

To use `focus()` you have to use `bind()` on the input. A React `ref` will be attached to the field to focus it.

```javascript
<input {...field.bind())} />
```

Otherwise you will have to set the `ref` manually:

```javascript
<input ref={(ref) => field.set('ref', ref)} />
```

---

### Programmatically Blur a Field

```javascript
field.blur();
```

> Requires a `ref` to be attached to the input (via `bind()` or manually).

The `blur()` method:
1. Calls `ref.blur()` on the DOM element (if a ref is attached)
2. Sets `$focused = false`
3. Sets `$blurred = true`

This is useful for programmatically dismissing keyboard focus, for example after a successful action:

```javascript
function handleSubmitSuccess() {
  form.$('username').blur();
  form.$('email').blur();
}
```

---

### Trim Field Value

The `trim()` method removes whitespace from the field value if it is a string. It does **not** trigger the `onChange` Event Hook, making it safe to use in pre-submit processing:

```javascript
field.trim();
// field.value is now trimmed, no onChange hook fires
```

> This is useful for trimming values before submission. For automatic trimming on every change, use the `autoTrimValue` option.

---

### move(fromIndex, toIndex)

Move an array field item from one index to another. Available on every **Form** and **Field** instance that contains array fields:

```javascript
form.move(fromIndex, toIndex);
form.$('hobbies').move(fromIndex, toIndex);
```

Internally, `move()` delegates to the [ArrayMap](../advanced/array-map.md) `move()` method, which performs a **single MobX-reactive splice operation** — reordering items without breaking field bindings or validation state.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `fromIndex` | `number` | Current index of the item to move |
| `toIndex` | `number` | Target index to place the item |

**Behavior:**
- No-op if `fromIndex === toIndex` or either index is out of bounds
- All field references, values, and validation state are preserved after the move
- The change is fully tracked by MobX — any observer re-renders automatically

**Example with up/down buttons:**

```javascript
function handleMoveUp(index) {
  if (index > 0) form.$('hobbies').move(index, index - 1);
}

function handleMoveDown(index) {
  if (index < form.$('hobbies').size - 1) form.$('hobbies').move(index, index + 1);
}
```

**Example with drag-and-drop:**

```javascript
// With @dnd-kit or similar:
function handleDragEnd(event) {
  const { active, over } = event;
  if (active.id !== over.id) {
    const oldIndex = items.findIndex((f) => f.key === active.id);
    const newIndex = items.findIndex((f) => f.key === over.id);
    form.$('products').move(oldIndex, newIndex);
  }
}
```

> `move()` is a pure action (no Event Handler or Hook involved). For the full sortable demo, see [Sortable Arrays](../advanced/sortable.md).

---

### Get Fields Properties

> Return an `object` with fields `key:val` pairs (with nested fields).

This will get all fields prop (with nested fields as `fields` objects):

```javascript
.get();
```

or filtering by a prop (with nested fields as collections):

```javascript
.get('label');
```

You can get these editable props: `value`, `label`, `placeholder`, `initial`, `default`, `disabled`, `related`, `bindings`, `type`, `disabled`, `options`, `extra`, `autoFocus`, `inputMode`.

Or these computed props: `hasError`, `isValid`, `isDirty`, `isPristine`, `isDefault`, `isEmpty`, `focused`, `touched`, `changed`, `error`,  and the validation props as well (`rules` and `validators`).

If you want to get nested fields as `fields` objects instead of collections pass the prop as array:

```javascript
.get(['label']);
```

or if you need to filter multiple props:

```javascript
.get(['value', 'label']);
```

---

### Set Fields Properties

The `set()` method is intended to be used to change the properties of existent/selected fields.

> It takes in input the prop name `string` and an `object` with fields `key:val` pairs.

If you need to recreate the fields tree (for example add/del fields array) and provide new values, consider to use the `update()` method instead.

You can pass the editable props: `value`, `label`, `placeholder`, `initial`, `default`, `type`,`disabled`, `related`, `bindings`, `hooks`, `handlers`, `observers`, `interceptors`,  `options`, `extra`, `autoFocus`, `inputMode` as well the validation props (`rules` and `validators`).

```javascript
.set('value', {
  username: 'NewUsername',
  password: 'NewPassword',
});
```

The object can be structured to set props of nested fields as well:

```javascript
.set('label', {
  address: {
    city: 'Cool City'
  },
});
```

---

### has()

Provide a field key to check if exists:

```javascript
.has('members');
```

> Returns `boolean`

---

### map()

```javascript
.$('hobbies').map((field) => {
  ... // access nested field
});
```

---

### each()

Iterate each field and nested fields recursively.

The callback get each field in input.

```javascript
.each(field => {
  // do some stuff with the field
});
```

---

### reduce()

Reduce field collection values.

The callback get accumulator and field in input.

```javascript
.reduce((accumulator, field) => { ... }, accumulator);
```

---

### add() & del()

You can add or remove normal Fields & Nested Fields or Array of Fields as well.

Add fields or nested fields:

```javascript
.$('hobbies').add();
```

> If you have specified an **Array of Fields** (`[]`) into the field **struct** you can call add() without input arguments to create a new empty field with its incremental array index as `key/name`.

**For simple arrays** (no nested fields), provide the value with a `value` wrapper:

```javascript
.$('hobbies').add({ value: 'soccer' });
```

**For nested arrays** (fields with sub-fields), you can pass the values directly:

```javascript
.$('members').add({ firstname: 'John', lastname: 'Doe' });
```

Or use an array of objects to add multiple entries at once:

```javascript
.$('members').add([
  { firstname: 'Alice', lastname: 'Wonder' },
  { firstname: 'Bob', lastname: 'Marley' },
]);
```

provide a custom key as field index:

```javascript
.$('hobbies').add({
  key: 'customKey',
  value: 'soccer',
});
```

> Pass a custom key to create a new **Named Field**.

Delete a field:

```javascript
.del('hobbies[1]');

.$('hobbies').del(1); // same as previous
```

or deep nested fields:

```javascript
.$('member').del('hobbies[3]');

.$('member.hobbies').del(3); // same as previous
```

> These are not an Event Handlers.
> If you need the `onAdd(e)` or `onDel(e)` read the [Event Handlers](../events/event-handlers.md) section.

You can use it, for example, if you want to reimplement the `onAdd(e)` or `onDel(e)` Event Handlers.

---

### clear() & reset()

Clear or Reset the whole Form, a single Field, or Nested Fields recursively.

```javascript
.clear(); // to empty values
```

```javascript
.reset(); // to default values
```

> These are not an Event Handlers.
> If you need the `onClear(e)` or `onReset(e)` read the [Event Handlers](../events/event-handlers.md) section.

---

### Manual Submit

The Submission can be done on **Forms** or eventually **Fields** to enable **Sub-Form Submission**.

Perform fields validation. After successful validation triggers `onSuccess` event or `onError` event in case of validation error.

```javascript
instance.submit();
```

Provide an object with `onSuccess(fieldset)` and `onError(fieldset)` functions if need to override those implemented in the class.

```javascript
instance.submit({
  onSuccess: (fieldset) => {},
  onError: (fieldset) => {},
});
```

> This is not an Event Handler.
> If you need the `onSubmit(e)` read the [Event Handlers](../events/event-handlers.md#onsubmite) section.

You can use it, for example, if you want to reimplement the `onSubmit(e)` Event Handler.

---

### Validate a Field

The `validate()` action returns a `promise`.

The callback takes the **Field Instance** with its `isValid` prop, which is the validation state of the **Field**.

```javascript
.$('password').validate()
  .then(({ isValid }) => {
    ... // Use `isValid` to check the validation status
  });
```

> The validation promise resolves the validated instance (Form or Field).

> This is an alternative syntax to [Form Actions - Validate Single Field](https://foxhound87.github.io/mobx-react-form/docs/actions/form.html#validate-single-field).


### Validation Errors

The `validate()` method will not show errors by default.

If you need to show errors after a validation you do:

```javascript
.$('password').validate({ showErrors: true });
```

---

### Invalidate the Form or a single Field

The `invalidate(msg)` method can be used on both forms or fields.

> Pass an optional `string` in input and a custom error message will be shown for the `error` property.

To invalidate the whole form:

```javascript
form.invalidate('This is a generic error message!');
```

To invalidate a single field:

```javascript
form.$('password').invalidate('The password is wrong!');
```

---

### Reset Validation

The `resetValidation()` method clears the validation status of a form or field back to its initial state — removing all sync errors, async errors, and the validation error stack.

> Available on **Form** and **Field** instances.

**Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `deep` | `boolean` | `false` | If `true`, resets validation on all nested fields recursively |

**What it clears:**
- `errorSync` — synchronous validation error
- `errorAsync` — asynchronous validation error
- `validationAsyncData` — async validation result data
- `validationFunctionsData` — validation function results
- `validationErrorStack` — the error message stack
- `showError` — resets to `false` (errors hidden)

```javascript
// Reset validation on a single field
form.$('password').resetValidation();

// Deep reset: recursively resets all nested fields
form.resetValidation(true);

// After resetting, errors are cleared:
form.$('password').error; // => null
form.$('password').hasError; // => false
```

> `resetValidation()` is called internally by `clear()` and `reset()` actions. Use it when you need to programmatically clear validation state without changing field values.

---

### Show / Hide Error Messages

The `showErrors()` method controls the visibility of validation error messages for a form or field.

> Available on **Form** and **Field** instances.

**Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `bool` | `boolean` | — | `true` to show errors, `false` to hide |
| `deep` | `boolean` | `true` | If `true`, applies to all nested fields recursively |

**How it works:**

The `error` computed property checks `showError` before returning a message:
- If `showError === false`, `error` returns `null` (errors hidden)
- If `showError === true`, `error` returns the actual error message

```javascript
// Show errors on a field
form.$('password').showErrors(true);

// Hide errors on a field
form.$('password').showErrors(false);

// Show errors on the whole form (deep = true by default)
form.showErrors(true);

// Hide errors without affecting nested fields
form.$('address').showErrors(false, false);
```

**Typical use cases:**

```javascript
// Show errors after failed validation
form.validate({ showErrors: true });

// Manually show errors after invalidation
form.$('email').invalidate('Invalid email');
form.$('email').showErrors(true); // ensure the error is visible

// Hide all errors (e.g. after the user starts correcting)
form.showErrors(false);
```

> The `invalidate()` method automatically calls `showErrors(true, deep)` internally.
> You can also control error visibility globally via the `showErrorsOnInit` and `showErrorsOnChange` [Form Options](../form/form-options.md).