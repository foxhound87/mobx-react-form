## Form Actions

### Clear the Fields State

> Set all fields value to empty

```javascript
form.clear();
```

### Reset the Fields State

> Set all fields value to initial state

```javascript
form.reset();
```

### Get all Fields Values

> Returns an `object` with all fields `key:val` pairs.

```javascript
form.values();
```
```
=> {
  username: 'TheUsername',
  password: 'ThePassword',
}
```


### Update the Fields State

> Takes an `object` with fields `key:val` pairs.

This will change the fields `values`:

```javascript
form.update({
  username: 'NewUsername',
  password: 'NewPassword',
});
```

### Bulk Update Fields Properties

> Takes the prop name `string` and an `object` with fields `key:val` pairs.

You can pass these props: `value`, `label`, `default`, `disabled`, `related`, `validate`, `rules`.

```javascript
form.update('label', {
  username: 'It's a New Label',
  password: 'Another New Label',
});
```

### Validate the Form

The `validate()` action returns a `promise`.

The callback takes a `boolean` (`isValid`) with the validation state of the **form**.

```javascript
form.validate()
  .then((isValid) => {
    ... // Use `isValid` to check the validation status
  });
```

### Validate single Field

The `validate(key)` action get an optional field `key` in input and returns a `promise`.

The callback takes a `boolean` (`isValid`) with the validation state of the **field**.

```javascript
form.validate('email')
  .then((isValid) => {
    ... // Use `isValid` to check the validation status
  });
```

### Invalidate the Form

> Takes a `string` in input for the error message.

```javascript
form.invalidate('This is a generic error message!');
```

### Get all Field Errors

> Returns an `object` with all fields `key:err` pairs.

```javascript
form.errors();
```
```
=> {
  username: 'The Username Error',
  password: 'The Password Error',
}
```
