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
| **update(obj)** | object | - | Pass an object to update the form with new values. |
| **values()** | - | object | Get an object with all fields values. |
| **clear()** | - | - | Clear the form to empty values. |
| **reset()** | - | - | Reset the form to default or initials values. |
| **errors()** | - | object | Get all errors of all fields with keys. |
| **validate()** | - | promise | Check if the form is valid and return a promise. |
| **invalidate(err)** | string | - | Invalidate the form passing a generic error message. |
