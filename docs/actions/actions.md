# Form Actions

The actions can be used on form or every field and nested field.

---

### Init the fields

It works like passing the `fields` or the `structure` to the [Form Constructor](../api-reference/form-initialization.md).

Nested fields can be initalized as well.

You can create the fields after the form is initialized too, or you can re-init them.

```javascript
form.init({
  username: 'NewUsername',
  password: 'NewPassword',
});
```

or using the selector for nested fields:

```javascript
form.$('credentials').init({
  username: 'NewUsername',
  password: 'NewPassword',
});
```

### Update the fields

Update values from the form instance:

```javascript
form.update({
  address: {
    city: 'Los Angeles'
  },
});
```

or the same selecting a field:

```javascript
form.$('address').update({
  city: 'Los Angeles'
});
```

### Check Field Computed Values

These computed values are allowed:

`hasError`, `isValid`, `isDirty`, `isPristine`, `isDefault`, `isEmpty`.

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

You can get these props: `value`, `label`, `initial`, `default`, `disabled`, `related`,

or these computed props: `error`, `hasError`, `isValid`, `isDirty`, `isPristine`, `isDefault`, `isEmpty`,

and the validation props as well: `rules` and `validate`.

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

You can pass these props: `value`, `label`, `initial`, `default`, `disabled`, `related`.

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

### Map Nested Fields

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

### Add & Del

Provide the `key` to add or delete a field.

```javascript
.add(key);
```

```javascript
.del(key);
```

