# Fields Properties

#### Editable Props
| Property | Type | Info | Help |
|---|---|---|---|
| **type** | string | Field type (default: `text`). | [help](../fields/) |
| **value** | any | Value of the field. | [help](../fields/) |
| **initial** | any | The initial value of the field. | [help](../fields/) |
| **default** | any | The default value of the field. | [help](../fields/) |
| **label** | string | The Field label. | [help](../fields/) |
| **placeholder** | string | The Field placeholder. | [help](../fields/) |
| **related** | array of strings (field `path`) | Execute validation on related fields. | [help](../fields/#common-patterns) |
| **options** | object | Individual Field Options, with fallback on Form Options. | [help](../form/form-options.html) |
| **rules** | string | Get DVR Validation Rules. | [help](../validation/plugins/DVR/setup.html) |
| **validators** | array | Get VJF Validation Functions. | [help](../validation/plugins/VJF/setup.html) |
| **validatedWith** | string | Field prop to validate instead `value`. See [validatedValue](../extra/validated-value.md). | [help](../extra/validated-value.html) |
| **extra** | any | Additional extra data for the field (useful for a select input). | [help](../extra/converters.html) |
| **bindings** | string | The key of the registered bindings to use for the current field. | [help](../bindings/) |
| **hooks** | object | An object with Event Hooks | [help](../events/event-hooks.html) |
| **handlers** | object | An object with Event Handlers. | [help](../events/event-handlers.html) |
| **deleted** | boolean | The deleted state of the field (see `softDelete` option). | [help](../form/form-options.html#softdelete) |
| **disabled** | boolean | The disabled state of the field. | [help](../fields/#separated-mode) |
| **autoFocus** | boolean | Set this to `true` for the first input to be focused at form initialization. | - |
| **inputMode** | string | The HTML `inputmode` attribute: `none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url`. | - |
| **converter** | function | Function to control `value` computed prop output. | [help](../extra/converters.html) |
| **converters** | function[] | Array of converter functions. | [help](../extra/converters.html) |
| **computed** | function | Function returning the value dynamically. Gets `{ form, field }` in input. | [help](../extra/computed-props.html) |
| **nullable** | boolean | Handle `null` field value. | [help](../troubleshooting.html) |
| **autoComplete** | string | HTML `autocomplete` attribute value. | - |
| **ref** | React Ref | A React Ref will be attached if `bind()` is used. | [help](../bindings/) |
| **class** | class (constructor) | Custom Field class to use for this field (unified mode only). | [help](../form/extend/configure.html#unified-definition) |
| **classes** | object | Custom Field classes keyed by field path (separated mode only). | [help](../form/extend/configure.html#separated-definition) |
| **observers** | object | The mobx observers to listen on Fields Props or Fields Map changes. Auto-loaded for dynamic arrays. | [help](../extra/mobx-events.html#using-observers--interceptors-objects) |
| **interceptors** | object | The mobx interceptors to listen on Fields Props or Fields Map changes. Auto-loaded for dynamic arrays. | [help](../extra/mobx-events.html#using-observers--interceptors-objects) |


#### Computed Props
| Property | Type | MobX Type | Info | Help |
|---|---|---|---|---|
| **key** | string | - | Field key (same of `name` if not provided) | - |
| **name** | string | - | Field name (same of `key` if not provided). | - |
| **path** | string | - | Field path (for nested fields). | [help](../fields/) |
| **size** | int | computed | Number of contained child fields. | - |
| **submitting** | boolean | computed | Check if the field is in submitting state. | - |
| **submitted** | int | computed | Check how many times a field has been submitted. | - |
| **validating** | boolean | computed | Check if the field is in validation state. | - |
| **validated** | int | computed | Check how many times a field has been validated. | - |
| **focused** | boolean | computed | Check if the field is focused. | [help](../events/event-handlers.html#onfocuse--onblure) |
| **touched** | boolean | computed | Check if the field is touched (has been focused at least once). | [help](../events/event-handlers.html#onfocuse--onblure) |
| **blurred** | boolean | computed | Check if the field has been blurred (focus lost at least once). | [help](../events/event-handlers.html#onfocuse--onblure) |
| **changed** | int | computed | Number of times the field value has changed. | - |
| **isValid** | boolean | computed | Check if the field is valid. | [help](../validation/) |
| **isDirty** | boolean | computed | Check if the field is dirty (value differs from initial). | [help](../actions/shared.html#check-field-computed-values) |
| **isPristine** | boolean | computed | Check if the field is pristine (value equals initial). | [help](../actions/shared.html#check-field-computed-values) |
| **isDefault** | boolean | computed | Check if the field equals its default value. | [help](../actions/shared.html#check-field-computed-values) |
| **isEmpty** | boolean | computed | Check if the field is empty. | [help](../actions/shared.html#check-field-computed-values) |
| **hasError** | boolean | computed | Check if the field has errors. | [help](../actions/shared.html#check-field-computed-values) |
| **error** | string | computed | Field error message. | - |
| **files** | any | computed | File data (populated by `onDrop` Event Handler for `type: 'file'` fields). | [help](../events/event-handlers.html#ondrope) |
| **checked** | any | computed | The current value when `type` is `"checkbox"`; `undefined` otherwise. | - |
| **validatedValue** | any | computed | The value of the field prop specified by `validatedWith` (default: `value`). | [help](../extra/validated-value.html) |
| **actionRunning** | boolean | computed | `true` while a clear, reset, or submit action is in progress. Useful for showing loading spinners. | - |
| **hasNestedFields** | boolean | computed | Check if the field has Nested Fields. | [help](../fields/) |
| **hasIncrementalKeys** | boolean | computed | Check if the nested fields have incremental (numeric) keys. | - |
