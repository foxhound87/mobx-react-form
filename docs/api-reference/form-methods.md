# Form Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **init(obj)** | (object) | - | Fields to initialize. | - |
| **options()** | - | - | Get form options. | - |
| **options(key)** | (string) | - | Get an option by key. | - |
| **options(obj)** | (object) | - | Set form options after the form is initialied. | - |
| **clear()** | - | - | Clear the Form to empty values. | - |
| **reset()** | - | - | Reset the Form to initial values. | - |
| **validate()** | - | promise | Check if the form is valid and return a promise. | - |
| **validate(path)** | (string) | promise | Takes a field `path` in input. Check if the field is valid and return a promise. | - |
| **invalidate(msg)** | (string) | - | Invalidate the form passing a generic error message. | - |
| **submit(obj)** | (object) | - | Perform fields validation. After successful validation triggers onSuccess event and onError event in case of validation error. | - |

#### Shared Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **update(obj)** | (object) | - | Update Fields Values. Will create new fields auomatically. | - |
| **select(path)** | (string) | object | Field Selector. Can be chained. | - |
| **get()** | - | - | Get all field and nested fields data with all props and computed values. | - |
| **get(prop)** | (mixed) | - | Get all field filtering by certain `props` (string or array). | - |
| **set(val)** | (mixed) | - | Set field value. Takes the value. | - |
| **set(obj)** | (object) | - | Provide an object to set nested fields values. | - |
| **set(prop, val)** | (string, mixed) | - | Set field property. Takes prop key and prop value. | - |
| **set(prop, obj)** | (string, object) | - | Provide a prop key and object to set nested fields properties. | - |
| **check(computed)** | (string) | - | Check field computed property. | - |
| **check(computed, deep)** | (string, boolean) | - | Check all nested fields computed property if `deep` is `true` | - |
| **map(callback)** | (function) | - | Map Nested Fields | - |
| **forEach(callback)** | (function) | - | Iterates over fields and nested fields recursively and invokes a callback which get each field in input. | - |
| **add(val)** | (mixed) | mixed | Add a Field or Nested Fields. Provide an optional initial value. | - |
| **del(key)** | (mixed) | - | Delete a Field or Nested Fields by `key` or `path`. | - |

> $(path) is like of select(path).

#### Helpers

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **values()** | - | object | Get all Nested Fields Values. | - |
| **errors()** | - | object | Get all Nested Fields Errors. | - |
| **labels()** | - | object | Get all Nested Fields Labels. | - |
| **placeholders()** | - | object | Get all Nested Fields Placeholders. | - |
| **default()** | - | object | Get all Nested Fields Default Values. | - |
| **initial()** | - | object | Get all Nested Fields Initial Values. | - |

> Some of these Helpers methods are plurals.

#### Event Handlers

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **onSubmit(e)** | - | object | Validate the form and call `onSuccess(form)` or `onError(form)`. | - |
| **onClear(e)** | - | object | Clear all the Fields and Nested Fields to `empty` value. | - |
| **onReset(e)** | - | object | Reset all the Fields and Nested Fields to `default` value. | - |
| **onAdd(e)** | - | object | Add a Field or Nested Fields. | - |
| **onDel(e)** | - | object | Delete a Field or Nested Fields. | - |

> All Event Handlers takes the Proxy object in input.
