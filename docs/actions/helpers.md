# Form Helpers

The helpers can be used on form or every field and nested field.

### Get all Fields Values

> Returns an `object` with all fields `key:val` pairs.

```javascript
.values();
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
.errors();
```
```
=> {
  username: 'The Username Error',
  password: 'The Password Error',
}
```

### Get all Field Labels

> Returns an `object` with all fields `key:err` pairs.

```javascript
.labels();
```

### Get all Field Defaults

> Returns an `object` with all fields `key:err` pairs.

```javascript
.defaults();
```

### Get all Field Initials

> Returns an `object` with all fields `key:err` pairs.

```javascript
.initials();
```
