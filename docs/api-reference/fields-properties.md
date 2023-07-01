# Fields Properties

#### Editable Props
| Property | Type | Info | Help |
|---|---|---|---|
| **type** | string | Field type (default: `text`). | - |
| **value** | any | Value of the field. | - |
| **initial** | boolean | The initial value of the field. | - |
| **default** | boolean | The default value of the field. | - |
| **label** | string | The Field label. | - |
| **placeholder** | string | The Field placeholder. | - |
| **related** | array of strings (field `path`) | Execute validation on related fields. | - |
| **options** | object | Individual Field Options, with fallback on Form Options. | - |
| **rules** | boolean | Get DVR Validation Rules. | - |
| **validators** | boolean | Get VJF Validation Functions. | - |
| **validatedWith** | string | Field prop to validate instead `value`. | - |
| **extra** | any | Additional extra data for the field (useful for a select input). | - |
| **bindings** | string | The key of the registered bindings to use for the current field. | [help](../bindings/README.md) |
| **hooks** | object | An object with Event Hooks | [help](../events/event-hooks.html) |
| **handlers** | object | An object with Event Handlers. | [help](../events/event-handlers.html) |
| **deleted** | boolean | The deleted state of the field. (see `softDelete` option) | - |
| **disabled** | boolean | The disabled state of the field. | - |
| **autoFocus** | boolean | Set this to `true` for the first input to be focused at form initialization. | - |
| **inputMode** | string | The attribute can have any of the following values: `none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url` | - |
| **ref** | React Ref | A React Ref will be attached if `bind()` is used. | [help](../bindings/README.md) |
| **observers** | object | The mobx observers to listen on Fields Props or Fields Map changes. | [help](../extra/mobx-events.md#using-observers--interceptors-objects) |
| **interceptors** | object | The mobx interceptors to listen on Fields Props or Fields Map changes. | [help](../extra/mobx-events.md#using-observers--interceptors-objects) |


#### Computed Props
| Property | Type | MobX Type | Info | Help |
|---|---|---|---|---|
| **key** | string | - | Field key (same of `name` if not provided) | - |
| **name** | string | - | Field name (same of `key` if not provided). | - |
| **path** | string | - | Field path (for nested fields). | - |
| **size** | int | computed | Number of contained Fields. | - |
| **submitting** | boolean | computed | Check if the field is in submitting state. | - |
| **submitted** | int | computed | Check how many times a field has been submitted. | - |
| **validating** | boolean | computed | Check if the field is in validation state. | - |
| **validated** | int | computed | Check how many times a field has been validated. | - |
| **focused** | boolean | computed | Check if the field is focused. | - |
| **touched** | boolean | computed | Check if the field is touched. | - |
| **changed** | boolean | computed | Check if the field is changed. | - |
| **blurred** | boolean | computed | Check if the field is blurred. | - |
| **isValid** | boolean | computed | Check if the field is valid. | - |
| **isDirty** | boolean | computed | Check if the field is dirty. | - |
| **isPristine** | boolean | computed | Check if the field is pristine. | - |
| **isDefault** | boolean | computed | Check if the field is to default value. | - |
| **isEmpty** | boolean | computed | Check if the field is empty. | - |
| **hasError** | boolean | computed | Check if the field has errors. | - |
| **error** | string | computed | Field error message. | - |
| **files** | string | computed | Use the `onDrop` Event Handler to retrieve the files data. | - |
| **validatedValue** | object | computed | Obtain Field `validatedWith` value. | - |
| **hasNestedFields** | boolean | computed | Check if the field has Nested Fields. | - |
| **hasIncrementalKeys** | boolean | computed | Check if the nested fields have incremental keys. | - |
