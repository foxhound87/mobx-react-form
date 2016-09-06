## Form API

###### Form Properties

| Property | Type | MobX Type | Info |
|---|---|---|---|
| **fields** | object | computed | All defined form fields. |
| **isValid** | boolean | computed | Check if the form is valid. |
| **isDirty** | boolean | computed | Check if the form is dirty. |
| **isPristine** | boolean | computed | Check if the form is in pristine state. |
| **isDefault** | boolean | computed | Check if the form is to default state. |
| **isEmpty** | boolean | computed | Check if the form is empty. |
| **hasEmpty** | boolean | computed | Check if the form has errors. |
| **error** | string | observable | Generic error message (not related to fields). |

###### Form Methods

| Method | Input | Output | Info |
|---|---|---|---|
| **$(key)** | string | object | Field selector shortcut. |
| **fieldKeys()** | - | array | Get an array with all fields keys/names. |
| **update(obj)** | object | - | Pass an object to update the form with new values. |
| **values()** | - | object | Get an object with all fields values. |
| **clear()** | - | - | Clear the form to empty values. |
| **reset()** | - | - | Reset the form to default or initials values. |
| **errors()** | - | object | Get all errors of all fields with keys. |
| **validate()** | - | promise | Check if the form is valid and return a promise. |
| **invalidate(err)** | string | - | Invalidate the form passing a generic error message. |


## Fields API

###### Fields Properties

| Property | Type | MobX Type | Info |
|---|---|---|---|
| **key** | string | - | Field key (set on form constructor) |
| **name** | string | - | Field name or key (set on form constructor) |
| **label** | string | - | Field label name (set on form constructor). If it is not specified, the `name` will be returned instead. |
| **value** | string, array, object, boolean | computed | Computed value of the field. |
| **default** | boolean | - | The default/initial value of the field. |
| **disabled** | boolean | - | The disabled state of the field. |
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
