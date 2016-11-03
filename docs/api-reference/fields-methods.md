# Fields Methods

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **init(data)** | (mixed) | - | Fields to initialize. | - |
| **update(data)** | (mixed) | - | Update Fields Values. | - |
| **select(path)** | (string) | object | Field Selector. Can be chained. | - |
| **get()** | - | - | Get all field data with all props and computed values. | - |
| **get(prop)** | (mixed) | - | Get all field filtering by certain `props` (string or array). | - |
| **set(val)** | (mixed) | - | Set field value. Takes only the value. | - |
| **set(prop, val)** | (string, mixed) | - | Set field property. Takes prop key and prop value. | - |
| **check(computed)** | (string) | - | Check field computed property. | - |
| **clear()** | - | - | Clear the field to empty value. | - |
| **reset()** | - | - | Reset the field to initial value. | - |
| **setValid()** | - | - | Set the field as valid. | - |
| **setInvalid(errorMessage = null, showError = true)** | **errorMessage**: string <br> **showErrors**: boolean | - | Mark the field as invalid. Pass an optional `errorMessage` or a default error will be shown. Set `showError` to `false` and the message will be hidden.  | - |
| **resetValidation()** | - | - | Reset the field validation status. | - |
| **map(callback)** | (function) | - | Map Nested Fields | - |
| **forEach(callback)** | (function) | - | Iterates over fields and nested fields recursively and invokes a callback which get each field in input. | - |

> $(path) is like of select(path) but doesn't trow error if can not find the field.

<br>

## Nested Fields Methods

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **get()** | - | - | Get all field and nested fields data with all props and computed values. | - |
| **set(data)** | (object) | - | Provide an object to set nested fields values. | - |
| **set(prop, data)** | (string, object) | - | Provide a prop key and object to set nested fields properties. | - |
| **check(computed, deep)** | (string, boolean) | - | Provide a computed key. Check all nested fields computed property if `deep` is `true` | - |
| **values()** | - | object | Get all Nested Fields Values. | - |
| **errors()** | - | object | Get all Nested Fields Errors. | - |
| **labels()** | - | object | Get all Nested Fields Labels. | - |
| **default()** | - | object | Get all Nested Fields Default Values. | - |
| **initial()** | - | object | Get all Nested Fields Initial Values. | - |
