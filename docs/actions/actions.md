# Form Actions

The actions can be used on form or every field and nested field.

### Update the fields

form the form instance:

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

> Takes an `object` with fields `key:val` pairs.

This will get all fields prop:

```javascript
.get();
```

or filtering by a prop:

```javascript
.get('error');
```

if you want to get nested fields as collections instead of `fields` objects pass `true` as second argument:

```javascript
.get('error', true);
```

or if you need to filter multiple props:

```javascript
.get(['value', 'error']);
```

### Set Fields Properties

> Takes the prop name `string` and an `object` with fields `key:val` pairs.

You can pass these props: `value`, `label`, `default`, `disabled`, `related`.

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

```
.map('hobbies', (fields) => {
  ... // access nested fields
});
```
