# Events Handlers

---

### Sync Field Value Hanlder

Use the `sync(e)` handler to update the state of the field:

```javascript
onChange={form.$('username').sync}
```

---

### Validation Handlers

###### We have two alternatives to deal with events:

- Extending the Form object with Events Handlers

- Decopling the Events Handlers from Form object

We can choose to use the Built-In handlers, override them or reimplement them for more flexibility.

The package provide those ready to use event handlers:

`onSubmit(e)`, `onSuccess(e)`, `onError(e)`.


> The `onSubmit` will `validate` the form and will call respectively `onSuccess` or `onError` mehtods if they are implemented in the `extended` class.


The `onSuccess` and `onError` mehtods takes the `form` object in input. So you can perform more actions after the validation occurs.

All Event Handlers methods take the `Proxy` object and can be easly included in yours components:

```html
<button type="submit" onClick={form.onSubmit}>Submit</button>
<button type="button" onClick={form.onClear}>Clear</button>
<button type="button" onClick={form.onReset}>Reset</button>
```

---

### Nested Fields Handlers

We have these methods: `onAdd(e)` and `onDel(e)`.

##### Adding a Field

You have to specify the field `key` as second argument:

```javascript
onClick={e => fields.onAdd(e, 'hobbies')}
```

or using the field `selector`:

```javascript
onClick={e => fields.$('hobbies').onAdd(e)}
```

##### Deleting a Field

You have to specify the field `key` as second argument.

```javascript
onClick={e => form.onDel(e, hobby.path)}
```
