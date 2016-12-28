# Fields Methods

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **clear()** | - | - | Clear the Field or Nested Fields to empty value. | - |
| **reset()** | - | - | Reset the Field or Nested Fields to initial value. | - |
| **validate()** | - | - | Check if the field is valid and return a promise. | - |
| **invalidate(msg)** | string | - | Mark the field as invalid. Pass an optional error message or a default error will be shown. | - |
| **hasNestedFields()** | - | - | Check if the field has Nested Fields. | - |
| **resetValidation()** | - | - | Reset the field validation status. | - |

#### Shared Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **init(obj)** | (object) | - | Fields to initialize. | - |
| **update(obj)** | (object) | - | Update Fields Values. | - |
| **select(path)** | (string) | object | Field Selector. Can be chained. | - |
| **get()** | - | - | Get all field and nested fields data with all props and computed values. | - |
| **get(prop)** | (mixed) | - | Get all field filtering by certain `props` (string or array). | - |
| **set(val)** | (mixed) | - | Set field value. Takes prop key and prop value. | - |
| **set(obj)** | (object) | - | Provide an object to set nested fields values. | - |
| **set(prop, val)** | (string, mixed) | - | Set field property. Takes prop key and prop value. | - |
| **set(prop, obj)** | (string, object) | - | Provide a prop key and object to set nested fields properties. | - |
| **check(computed)** | (string) | - | Check field computed property. | - |
| **check(computed, deep)** | (string, boolean) | - | Check all nested fields computed property if `deep` is `true` | - |
| **map(callback)** | (function) | - | Map Nested Fields | - |
| **forEach(callback)** | (function) | - | Iterates over fields and nested fields recursively and invokes a callback which get each field in input. | - |
| **add(val)** | - | object | Add a Field or Nested Fields. Provide an optional initial value. | - |
| **del(key)** | - | object | Delete a Field or Nested Fields by `key` or `path`. | - |

> $(path) is like of select(path).

#### Helpers

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **values()** | - | object | Get all Nested Fields Values. | - |
| **errors()** | - | object | Get all Nested Fields Errors. | - |
| **labels()** | - | object | Get all Nested Fields Labels. | - |
| **placeholder()** | - | object | Get all Nested Fields Placeholders. | - |
| **default()** | - | object | Get all Nested Fields Default Values. | - |
| **initial()** | - | object | Get all Nested Fields Initial Values. | - |

> Some of these Helpers methods are plurals.

#### Event Handlers

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **sync(e)** | - | object | Update the `value` of the field. | - |
| **onChange(e)** | - | object | Update the `value` of the field. (alias of `sync(e)`) | - |
| **onToggle(e)** | - | object | Update the `value` of the field. (alias of `sync(e)`) | - |
| **onFocus(e)** | - | object | Track the `focus` property of the field. | - |
| **onBlur(e)** | - | object | Track the `touched` property of the field. | - |
| **onClear(e)** | - | object | Clear all the Fields and Nested Fields to `empty` value. | - |
| **onReset(e)** | - | object | Reset all the Fields and Nested Fields to `default` value. | - |
| **onAdd(e)** | - | object | Add a Field or Nested Fields. | - |
| **onDel(e)** | - | object | Delete a Field or Nested Fields. | - |

> All Event Handlers takes the Proxy object in input.
