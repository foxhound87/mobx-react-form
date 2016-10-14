## Fields API

<br>

### Fields Properties

| Property | Type | MobX Type | Info | Help |
|---|---|---|---|---|
| **fields** | object | computed | All defined Nested Fields. |
| **path** | string | - | Field path (for nested fields). | - |
| **key** | string | - | Field key (same of `name` if not provided) | - |
| **name** | string | - | Field name (same of `key` if not provided). | - |
| **label** | string | - | Field label name. If it is not specified, the `name` will be returned instead. | - |
| **default** | boolean | - | The default/initial value of the field. | - |
| **disabled** | boolean | - | The disabled state of the field. | - |
| **value** | string, array, object, boolean | computed | Computed value of the field. | - |
| **isValid** | boolean | computed | Check if the field is valid. | - |
| **isDirty** | boolean | computed | Check if the field is dirty. | - |
| **isPristine** | boolean | computed | Check if the field is pristine. | - |
| **isDefault** | boolean | computed | Check if the field is to default value. | - |
| **isEmpty** | boolean | computed | Check if the field is empty. | - |
| **hasError** | boolean | computed | Check if the field has errors. | - |
| **error** | string | observable | Field error message. | - |
| **sync** | - | - | Synchronizes the value of the field `onChange` event. | - |

<br>

### Fields Methods

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **init(data)** | (mixed) | - | Fields to initialize. | - |
| **update(data)** | (mixed) | - | Update Fields Values. | - |
| **select(path)** | (string) | object | Field Selector. Can be chained. | - |
| **get(prop)** | (string|array) | - | Get all field data or filter by certain `props`. | - |
| **set(val)** | (mixed) | - | Set field value. Takes prop key and prop value. | - |
| **set(prop, val)** | (string, mixed) | - | Set field property. Takes prop key and prop value. | - |
| **check(computed)** | (string) | - | Check field computed property. | - |
| **clear()** | - | - | Clear the field to empty value. | - |
| **reset()** | - | - | Reset the field to initial value. | - |
| **setValid()** | - | - | Set the field as valid. | - |
| **setInvalid(errorMessage = null, showError = true)** | **errorMessage**: string <br> **showErrors**: boolean | - | Mark the field as invalid. Pass an optional `errorMessage` or a default error will be shown. Set `showError` to `false` and the message will be hidden.  | - |
| **resetValidation()** | - | - | Reset the field validation status. | - |

> $(path) is an alias of select(path)

<br>

### Nested Fields Methods

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
