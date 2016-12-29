# Form Actions

The actions can be used on form or every field and nested field.

---

### Update the fields

Update values from the form instance:

```javascript
.update({
  address: {
    city: 'Los Angeles'
  },
});
```

or the same selecting a field:

```javascript
.$('address').update({
  city: 'Los Angeles'
});
```

> The update() method accepts only an object describing the fields keys with their values.

### Check Field Computed Values

These computed values are allowed:

`hasError`, `isValid`, `isDirty`, `isPristine`, `isDefault`, `isEmpty`, `focus`, `touched`, `changed`.

```javascript
.check('isValid');
```

Use the second argument (boolean) if you want to check for nested fields too.

```javascript
.check('isValid', true);
```

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

### Get the Fields Properties

> Return an `object` with fields `key:val` pairs (with nested fields).

This will get all fields prop (with nested fields as `fields` objects):

```javascript
.get();
```

or filtering by a prop (with nested fields as collections):

```javascript
.get('label');
```

You can get these props: `value`, `label`, `placeholder`, `initial`, `default`, `disabled`, `related`, `error`.

or these computed props: `hasError`, `isValid`, `isDirty`, `isPristine`, `isDefault`, `isEmpty`, `focus`, `touched`, `changed` and the validation props as well (`rules` and `validate`).

If you want to get nested fields as `fields` objects instead of collections pass the prop as array:

```javascript
.get(['label']);
```

or if you need to filter multiple props:

```javascript
.get(['value', 'label']);
```

### Set Fields Properties

> Takes in input the prop name `string` and an `object` with fields `key:val` pairs.

You can pass these props: `value`, `label`, `placeholder`, `initial`, `default`, `disabled`, `related`, `error`.

Or passing `validate` and  `rules` for the validation.

```javascript
.set('values' {
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

### Clear & Reset

Clear or Reset the whole Form, a single Field, or Nested Fields recursively.

```javascript
.clear();
```

```javascript
.reset();
```

### Validate a Field

The `validate()` action returns a `promise`.

The callback takes a `boolean` (`isValid`) with the validation state of the **field**.

```javascript
$('password').validate()
  .then((isValid) => {
    ... // Use `isValid` to check the validation status
  });
```

> This is an alternative syntax to [Form Actions - Validate Single Field](https://foxhound87.github.io/mobx-react-form/docs/actions/form-actions.html#validate-single-field).

### Invalidate the Form or a Field

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

> These are not an Event Handlers.
> If you need the `onClear(e)` or `onReset(e)` read the [Event Handlers](../events/events-handlers.md) section.

### Map Fields and Nested Fields

```javascript
$('hobbies').map((fields) => {
  ... // access nested fields
});
```

or

```javascript
.map('hobbies', (fields) => {
  ... // access nested fields
});
```

### forEach()

Iterate each field and nested fields recursively.

The callback get each field in input.

```javascript
.forEach(field => {
  // do some stuff with the field
});
```

### add() & del()

Add fields or nested fields:

```javascript
form.$('hobbies').add();
```

provide the initial value to the new added field:

```javascript
form.$('hobbies').add('soccer');
```

provide a custom key as field index:

```javascript
form.$('hobbies').add(fieldValue, { key: customKey });
```

> If the field contains other nested fields, the value can be an object. It will work as `update()`.

Delete a field:

```javascript
form.del('hobbies[1]');

form.$('hobbies').del(1); // same as previous
```

or deep nested fields:

```javascript
form.$('member').del('hobbies[3]');

form.$('member.hobbies').del(3); // same as previous
```

> These are not an Event Handlers.
> If you need the `onAdd(e)` or `onDel(e)` read the [Event Handlers](../events/events-handlers.md) section.

You can use it, for example, if you want to reimplement the `onAdd(e)` or `onDel(e)` Event Handlers.

