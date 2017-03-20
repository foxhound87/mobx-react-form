# Helpers

The helpers can be used on the form instance or every field and nested field.

* [Field Selector](#field-selector)
* [Get all Fields Values](#get-all-fields-values)
* [Get all Field Errors](#get-all-field-errors)
* [Get all Field Labels](#get-all-field-labels)
* [Get all Field Placeholders](#get-all-field-placeholders)
* [Get all Field Defaults Values](#get-all-field-defaults-values)
* [Get all Field Initials Values](#get-all-field-initials-values)
* [Get all Field Types](#get-all-field-types)

---

### Field Selector

```javascript
.$('myFieldName');
```

> Shortcut of `select()`

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

> Shortcut of `get('value')`

### Get all Field Errors

> Returns an `object` with all fields `key:val` pairs.

```javascript
.errors();
```
```
=> {
  username: 'The Username Error',
  password: 'The Password Error',
}
```

> Shortcut of `get('error')`


### Get all Field Labels

> Returns an `object` with all fields `key:val` pairs.

```javascript
.labels();
```

> Shortcut of `get('label')`


### Get all Field Placeholders

> Returns an `object` with all fields `key:val` pairs.

```javascript
.placeholders();
```

> Shortcut of `get('placeholder')`

### Get all Field Defaults Values

> Returns an `object` with all fields `key:val` pairs.

```javascript
.defaults();
```

> Shortcut of `get('default')`

### Get all Field Initials Values

> Returns an `object` with all fields `key:val` pairs.

```javascript
.initials();
```
> Shortcut of `get('initial')`

### Get all Field Types

> Returns an `object` with all fields `key:val` pairs.

```javascript
.types();
```
> Shortcut of `get('type')`
