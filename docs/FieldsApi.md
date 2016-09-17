## Fields API

###### Fields Properties

| Property | Type | MobX Type | Info |
|---|---|---|---|
| **key** | string | - | Field key. |
| **name** | string | - | Field name or key. |
| **label** | string | - | Field label name. If it is not specified, the `name` will be returned instead. |
| **default** | boolean | - | The default/initial value of the field. |
| **disabled** | boolean | - | The disabled state of the field. |
| **value** | string, array, object, boolean | computed | Computed value of the field. |
| **isValid** | boolean | computed | Check if the field is valid. |
| **isDirty** | boolean | computed | Check if the field is dirty. |
| **isPristine** | boolean | computed | Check if the field is pristine. |
| **isDefault** | boolean | computed | Check if the field is to default value. |
| **isEmpty** | boolean | computed | Check if the field is empty. |
| **hasError** | boolean | computed | Check if the field has errors. |
| **error** | string | observable | Field error message. |
| **sync** | - | - | Synchronizes the value of the field `onChange` event. |

###### Fields Methods

| Property | Input | Output | Info |
|---|---|---|---|
| **getValue()** | - | string, array, object, boolean | Get the field value. |
| **setValue(val)** | string, array, object, boolean | - | Set the field value to the given value. |
| **update(val)** | string, array, object, boolean | - | Alias of setValue(). |
| **clear()** | - | - | Clear the field to empty value. |
| **reset()** | - | - | Reset the field to initial value. |
| **setValid()** | - | - | Set the field as valid. |
| **setInvalid(errorMessage = null, showError = true)** | **errorMessage**: string <br> **showErrors**: boolean | - | Mark the field as invalid. Pass an optional `errorMessage` or a default error will be shown. Set `showError` to `false` and the message will be hidden.  |

---
