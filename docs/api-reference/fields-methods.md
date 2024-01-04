# Fields Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **container()** | string | - | Get Parent Field Container. | - |
| **bind()** | - | object | Get the current field bindings. | [help](../bindings/README.md) |
| **clear()** | - | - | Clear the Field or Nested Fields to empty value. | [help](../actions/shared.md#clear--reset-form-or-fields) |
| **reset()** | - | - | Reset the Field or Nested Fields to default value. | [help](../actions/shared.md#clear--reset-form-or-fields) |
| **focus()** | - | - | Programmatically set focus on the field. | [help](../actions/shared.md#programmatically-focus-a-field) |
| **blur()** | - | - | Programmatically blur the field if focused. | - |
| **trim()** | - | - | Apply `trim()` to the field value if is string. It does not trigger `onChange` Event Hook | - |
| **invalidate(msg)** | string | - | Mark the field as invalid. Pass an optional error message or a default error will be shown. | [help](../actions/shared.md#invalidate-the-form-or-a-single-field) |
| **resetValidation()** | deep | - | Reset the field validation status. | - |
| **showErrors(bool)** | bool | - | Show or Hide Field Error Messages. | - |

#### Shared Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **select(path)** | (string) | object | Field Selector. Can be chained. | - |
| **update(obj)** | (object) | - | Update Fields Values. Will create new fields auomatically. | - |
| **submit(obj)** | (object) | - | Perform fields validation. After successful validation triggers onSuccess event and onError event in case of validation error. | - |
| **validate()** | - | - | Check if the field is valid and return a promise. | [help](../actions/shared.md#validate-a-field) |
| **validate(path)** | (string) | promise | Takes a field `path` in input. Check if the field and nested fields are valid and return a promise. | [help](../actions/shared.md#validate-a-field) |
| **validate(opt)** | (object) | promise | Takes a an object in input with `related` or `showErrors` options. | - |
| **validate(path, opt)** | (string, object) | promise | Takes a field `path` as first arg. and object as second arg. with `related` or `showErrors` options. | - |
| **check(computed)** | (string) | boolean | Check field computed property. | - |
| **check(computed, deep)** | (string, boolean) | boolean | Check all nested fields computed property if `deep` is `true` | - |
| **get()** | - | object | Get all field and nested fields data with all props and computed values. | - |
| **get(prop)** | (any) | object | Get all field filtering by certain `props` (string or array). | - |
| **set(val)** | (any) | - | Set field value. Takes the value. | - |
| **set(obj)** | (object) | - | Provide an object to set nested fields values. | - |
| **set(prop, val)** | (string, any) | - | Set field property. Takes prop key and prop value. | - |
| **set(prop, obj)** | (string, object) | - | Provide a prop key and object to set nested fields properties. | - |
| **has(key)** | (string) | - | Provide Field key to check if exist. | - |
| **map(callback)** | (function) | - | Map Nested Fields | - |
| **reduce(callback, acc)** | (function, any) | - | Reduce Nested Fields | - |
| **each(callback)** | (function) | - | Iterates over fields and nested fields recursively and invokes a callback which get each field in input. | - |
| **add(obj)** | (any) | any | Add a Field or Nested Fields. | - |
| **del(key)** | (any) | - | Delete a Field or Nested Fields by `key` or `path`. | - |
| **observe(obj)** | (object) | - | Define a MobX Observer on Field Props or Field Map. | - |
| **intercept(obj)** | (object) | - | Define a MobX Interceptor on Field Props or Field Map. | - |

> $(path) is like of select(path).

#### Helpers

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **values()** | - | object | Get Field & Nested Fields Values. | - |
| **errors()** | - | object | Get Field & Nested Fields Errors. | - |
| **labels()** | - | object | Get Field & Nested Fields Labels. | - |
| **placeholders()** | - | object | Get Field & Nested Fields Placeholders. | - |
| **defaults()** | - | object | Get Field & Nested Fields Default Values. | - |
| **initials()** | - | object | Get Field & Nested Fields Initial Values. | - |
| **types()** | - | object | Get Field & Nested Fields Type. | - |

#### Event Handlers

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **sync(e)** | - | object | Update the `value` of the field. | - |
| **onChange(e)** | - | object | Update the `value` of the field. (alias of `sync(e)`) | - |
| **onToggle(e)** | - | object | Update the `value` of the field. (alias of `sync(e)`) | - |
| **onFocus(e)** | - | object | Track the `focused` property of the field. | - |
| **onBlur(e)** | - | object | Track the `touched` property of the field. | - |
| **onSubmit(e)** | - | object | Sub-Form Submission: Validate the fieldset and call `onSuccess(fieldset)` or `onError(fieldset)`. | - |
| **onClear(e)** | - | object | Clear all the Fields and Nested Fields to `empty` value. | - |
| **onReset(e)** | - | object | Reset all the Fields and Nested Fields to `default` value. | - |
| **onAdd(e)** | - | object | Add a Field or Nested Fields. | - |
| **onDel(e)** | - | object | Delete a Field or Nested Fields. | - |
| **onKeyUp(e)** | - | object | Executed on field key up | - |
| **onKeyDown(e)** | - | object | Executed on field key down | - |


> All Event Handlers takes the Proxy object in input.
