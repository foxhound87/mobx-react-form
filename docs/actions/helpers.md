# Helpers

The helpers can be used on the form instance or every field and nested field.

* [Field Selector](#field-selector)
* [Access Form Instance From Fields](#access-form-instance-from-fields)
* [Get all Fields Values](#get-all-fields-values)
* [Get all Fields Errors](#get-all-fields-errors)
* [Get all Fields Labels](#get-all-fields-labels)
* [Get all Fields Placeholders](#get-all-fields-placeholders)
* [Get all Fields Defaults Values](#get-all-fields-defaults-values)
* [Get all Fields Initials Values](#get-all-fields-initials-values)
* [Get all Fields Types](#get-all-fields-types)

---

### Field Selector

```javascript
.$('myFieldName');
```

> Shortcut of `select()`

---
### Access Form Instance From Fields

Every `Field` instance can access the `Form` instance using the `state` prop:

```javascript
field.state.form // access Form instance
```

---

### Get all Fields Values

Returns an `object` with all fields `key:val` pairs.

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

### Get all Fields Errors

Returns an `object` with all fields `key:val` pairs.

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

### Get all Fields Labels

Returns an `object` with all fields `key:val` pairs.

```javascript
.labels();
```

> Shortcut of `get('label')`

### Get all Fields Placeholders

Returns an `object` with all fields `key:val` pairs.

```javascript
.placeholders();
```

> Shortcut of `get('placeholder')`

### Get all Fields Defaults Values

Returns an `object` with all fields `key:val` pairs.

```javascript
.defaults();
```

> Shortcut of `get('default')`

### Get all Fields Initials Values

Returns an `object` with all fields `key:val` pairs.

```javascript
.initials();
```
> Shortcut of `get('initial')`

### Get all Fields Types

Returns an `object` with all fields `key:val` pairs.

```javascript
.types();
```
> Shortcut of `get('type')`
