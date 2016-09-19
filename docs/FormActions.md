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

```javascript
form.update({
  username: 'NewUsername',
  password: 'NewPassword',
});
```

### Validate

The `validate()` action returns a `promise`.

The callback takes a `boolean` (`isValid`) with the validation state of the form.

```javascript
form.validate()
  .then((isValid) => {
    ... // Use `isValid` to check the validation status
  });
```

### Validate single Field

The `validate(key)` action get an optional field `key` in input.

The callback takes a `boolean` (`isValid`) with the validation state of the form.

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
