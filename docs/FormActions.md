## Form Actions

### Get the Fields Props

> Takes an `object` with fields `key:val` pairs.

This will get all fields prop:

```javascript
form.get();
```

or filtering by a prop:

```javascript
form.get('error');
```

or if you need to filter multiple props:

```javascript
form.get(['value', 'error']);
```

### Set the Fields Values

> Takes an `object` with fields `key:val` pairs.

This will change the fields `values`:

```javascript
form.set({
  username: 'NewUsername',
  password: 'NewPassword',
});
```

The object can be structured to set values of nested fields as well.

### Set Fields Properties

> Takes the prop name `string` and an `object` with fields `key:val` pairs.

You can pass these props: `value`, `label`, `default`, `disabled`, `related`, `validate`, `rules`.

```javascript
form.set('label', {
  username: 'It's a New Label',
  password: 'Another New Label',
});
```

The object can be structured to set values of nested fields as well.

### Validate the Form

The `validate()` action returns a `promise`.

The callback takes a `boolean` (`isValid`) with the validation state of the **form**.

```javascript
form.validate()
  .then((isValid) => {
    ... // Use `isValid` to check the validation status
  });
```

### Validate Single Field

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
