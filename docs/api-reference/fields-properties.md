# Fields Properties

| Property | Type | MobX Type | Info | Help |
|---|---|---|---|---|
| **path** | string | - | Field path (for nested fields). | - |
| **key** | string | - | Field key (same of `name` if not provided) | - |
| **name** | string | - | Field name (same of `key` if not provided). | - |
| **label** | string | computed | Field label. If it is not specified, the `name` will be returned instead. | - |
| **placeholder** | string | computed | Field placeholder. | - |
| **default** | boolean | computed | The default/initial value of the field. | - |
| **disabled** | boolean | computed | The disabled state of the field. | - |
| **value** | mixed | computed | Computed value of the field. | - |
| **focus** | boolean | computed | Check if the field is focused. | - |
| **touched** | boolean | computed | Check if the field is touched. | - |
| **changed** | boolean | computed | Check if the field is changed. | - |
| **related** | boolean | computed | Get Related fields for validation. | - |
| **rules** | boolean | computed | Get DVR Validation Rules. | - |
| **validators** | boolean | computed | Get VJF Validation Functions. | - |
| **isValid** | boolean | computed | Check if the field is valid. | - |
| **isDirty** | boolean | computed | Check if the field is dirty. | - |
| **isPristine** | boolean | computed | Check if the field is pristine. | - |
| **isDefault** | boolean | computed | Check if the field is to default value. | - |
| **isEmpty** | boolean | computed | Check if the field is empty. | - |
| **hasError** | boolean | computed | Check if the field has errors. | - |
| **error** | string | computed | Field error message. | - |
