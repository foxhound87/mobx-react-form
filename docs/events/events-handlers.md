# Events Handlers

All Event Handlers methods take the `Proxy` object in input as first argument and can be easly included in yours components.

---

### Sync Field Value Handler

Use the `sync(e)` handler to update the state of the field:

```html
<input
  ...
  onChange={form.$('username').sync}
/>
```

> `onChange(e)` and `onToggle(e)` are aliases of `sync(e)`;

### onFocus(e) & onBlur(e)

If you need to track `touched` and `focus` state, you can use `onFocus(e)` or `onBlur(e)` handlers:

```html
<input
  ...
  onFocus={form.$('username').onFocus}
  onBlur={form.$('username').onBlur}
/>
```

---

### Validation Handlers

###### We have two alternatives to deal with events:

- [Extending the Form object with Events Handlers](extending-form.md)

- [Decopling the Events Handlers from Form object](decoupling-handlers.md)

We can choose to use the Built-In handlers, override them or reimplement them for more flexibility.

The package provide those ready to use event handlers:

`onSubmit(e)`, `onSuccess(e)`, `onError(e)`.


> The `onSubmit` will `validate` the form and will call respectively `onSuccess` or `onError` mehtods if they are implemented in the `extended` class.


The `onSuccess` and `onError` mehtods takes the `form` object in input. So you can perform more actions after the validation occurs.

You can easly include the `onSubmit` handler in your component:

```html
<button type="submit" onClick={form.onSubmit}>Submit</button>
```

---

### Clear & Reset

```html
<button type="button" onClick={form.onClear}>Clear</button>
<button type="button" onClick={form.onReset}>Reset</button>
```

or selecting Specific Field or Nested Fields:


```html
<button type="button" onClick={form.$('members').onClear}>Clear</button>
<button type="button" onClick={form.$('members').onReset}>Reset</button>
```

---

### Nested Fields Handlers

We have these methods: `onAdd(e)` and `onDel(e)`.

##### Adding a Field

```html
<button type="button" onClick={hobbies.onAdd}>Add Hobby</button>
```

or using the field `selector`:

```html
<button type="button" onClick={form.$('hobbies').onAdd}>Add Hobby</button>
```

or specify the field `path` as second argument:

```html
<button type="button" onClick={e => form.onAdd(e, 'hobbies')}>Add Hobby</button>
```

##### Deleting a Field

```html
<button type="button" onClick={hobby.onDel}>Delete Hobby</button>
```

or using the field `selector`:

```html
<button type="button" onClick={form.$('hobbies').$(3).onDel}>Delete Hobby</button>
```

or specify the field `path` as second argument:

```html
<button type="button" onClick={e => form.onDel(e, 'hobbies[3]')}>Delete Hobby</button>
```
