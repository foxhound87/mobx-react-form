# Form Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **options(obj = null)** | (object, string) | - | Get/Set form options after the form is yet initialied. | - |
| **select(path)** | (string) | object | Field Selector. Can be chained. | - |
| **update(data)** | (mixed) | - | Update Fields Values. | - |
| **get()** | - | - | Get all field data with all props and computed values. | - |
| **get(prop)** | (mixed) | - | Get all field filtering by certain `props` (string or array). | - |
| **set(val)** | (mixed) | - | Set field value. Takes prop key and prop value. | - |
| **set(prop, val)** | (string, mixed) | - | Set field property. Takes prop key and prop value. | - |
| **check(computed)** | (string) | - | Check field computed property. | - |
| **validate()** | - | promise | Check if the form is valid and return a promise. | - |
| **validate(field)** | (string) | promise | Check if the field is valid and return a promise. | - |
| **invalidate(err)** | (string) | - | Invalidate the form passing a generic error message. | - |
| **submit(obj)** | (object) | - | Perform fields validation. After successful validation triggers onSuccess event and onError event in case of validation error. | - |

> $(path) is an alias of select(path)

<br>

## Nested Fields Methods

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **set(data)** | (object) | - | Provide an object to set nested fields values. | - |
| **set(prop, data)** | (string, object) | - | Provide an object to set nested fields properties. | - |
| **check(computed, deep)** | (string, boolean) | - | Check all nested fields computed property if `deep` is `true` | - |
| **values()** | - | object | Get all Nested Fields Values. | - |
| **errors()** | - | object | Get all Nested Fields Errors. | - |
| **labels()** | - | object | Get all Nested Fields Labels. | - |
| **default()** | - | object | Get all Nested Fields Default Values. | - |
| **initial()** | - | object | Get all Nested Fields Initial Values. | - |
