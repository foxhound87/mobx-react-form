# Form Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **init(obj)** | (object) | - | Fields to initialize. | [help](../actions/form.md#re-initialize-all-fields) |
| **clear()** | - | - | Clear the Form to empty values. | [help](../actions/shared.md#clear--reset-form-or-fields) |
| **reset()** | - | - | Reset the Form to default values. | [help](../actions/shared.md#clear--reset-form-or-fields) |
| **invalidate(msg)** | string | - | Mark the field as invalid. Pass an optional error message or a default error will be shown. | [help](../actions/shared.md#invalidate-the-form-or-a-single-field) |
| **showErrors(bool)** | bool | - | Show or Hide Field Error Messages. | - |

#### Shared Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **select(path)** | (string) | object | Field Selector. Can be chained. | - |
| **update(obj)** | (object) | - | Update Fields Values. Will create new fields auomatically. | - |
| **submit(obj)** | (object) | - | Perform fields validation. After successful validation triggers onSuccess event and onError event in case of validation error. | - |
| **validate()** | - | promise | Check if the form is valid and return a promise. | [help](../actions/form.md#validate-the-form) |
| **validate(path)** | (string) | promise | Takes a field `path` in input. Check if the field and nested fields are valid and return a promise. | [help](../actions/form.md#validate-the-form) |
| **check(computed)** | (string) | boolean | Check field computed property. | - |
| **check(computed, deep)** | (string, boolean) | boolean | Check all nested fields computed property if `deep` is `true` | - |
| **get()** | - | object | Get all field and nested fields data with all props and computed values. | - |
| **get(prop)** | (mixed) | object | Get all field filtering by certain `props` (string or array). | - |
| **set(val)** | (mixed) | - | Set field value. Takes the value. | - |
| **set(obj)** | (object) | - | Provide an object to set nested fields values. | - |
| **set(prop, val)** | (string, mixed) | - | Set field property. Takes prop key and prop value. | - |
| **set(prop, obj)** | (string, object) | - | Provide a prop key and object to set nested fields properties. | - |
| **has(key)** | (string) | - | Provide Field key to check if exist. | - |
| **map(callback)** | (function) | - | Map Nested Fields | - |
| **each(callback)** | (function) | - | Iterates over fields and nested fields recursively and invokes a callback which get each field in input. | - |
| **add(obj)** | (mixed) | mixed | Add a Field or Nested Fields. | - |
| **del(key)** | (mixed) | - | Delete a Field or Nested Fields by `key` or `path`. | - |
| **observe(obj)** | (object) | - | Define a MobX Observer on Field Props or Field Map. | - |
| **intercept(obj)** | (object) | - | Define a MobX Interceptor on Field Props or Field Map. | - |
| **hasNestedFields()** | - | boolean | Check if the form has Nested Fields. | - |
| **hasIncrementalKeys()** | - | boolean | Check if the nested fields have incremental keys. | - |

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

> Some of these Helpers methods are plurals.

#### Event Handlers

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **onSubmit(e)** | - | object | Validate the form and call `onSuccess(form)` or `onError(form)`. | - |
| **onClear(e)** | - | object | Clear all the Fields and Nested Fields to `empty` value. | - |
| **onReset(e)** | - | object | Reset all the Fields and Nested Fields to `default` value. | - |
| **onAdd(e)** | - | object | Add a Field or Nested Fields. | - |
| **onDel(e)** | - | object | Delete a Field or Nested Fields. | - |

> All Event Handlers takes the Proxy object in input.
