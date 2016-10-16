# Fields Properties

| Property | Type | MobX Type | Info | Help |
|---|---|---|---|---|
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
| **error** | string | computed | Field error message. | - |
