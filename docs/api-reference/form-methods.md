# Form Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **clear()** | - | void | Clear the Form to empty values. | [help](../actions/shared.html#clear--reset-form-or-fields) |
| **reset()** | - | void | Reset the Form to default values. | [help](../actions/shared.html#clear--reset-form-or-fields) |
| **invalidate(msg)** | (string) | void | Mark the field as invalid. Pass an optional error message or a default error will be shown. | [help](../actions/shared.html#invalidate-the-form-or-a-single-field) |
| **resetValidation(deep)** | (boolean) | void | Reset the form validation status. Pass `true` for deep reset of nested fields. | [help](../actions/shared.html#reset-validation) |
| **showErrors(bool)** | (boolean) | void | Show or Hide Field Error Messages. | [help](../actions/shared.html#show--hide-error-messages) |

#### Shared Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **select(path)** | (string) | object | Field Selector. Can be chained. | [help](../actions/shared.html#field-selector) |
| **update(obj)** | (object) | void | Update Fields Values. Will create new fields auomatically. | [help](../actions/shared.html#update-the-fields) |
| **submit(obj)** | (object) | promise | Perform fields validation. After successful validation triggers onSuccess event and onError event in case of validation error. | [help](../actions/shared.html#manual-submit) |
| **validate()** | - | promise | Check if the form is valid and return a promise. | [help](../actions/form.html#validate-the-form) |
| **validate(path)** | (string) | promise | Takes a field `path` in input. Check if the field and nested fields are valid and return a promise. | [help](../actions/form.html#validate-the-form) |
| **validate(opt)** | (object) | promise | Takes a an object in input with `related` or `showErrors` options. | [help](../actions/form.html#validation-errors) |
| **validate(path, opt)** | (string, object) | promise | Takes a field `path` as first arg. and object as second arg. with `related` or `showErrors` options. | [help](../actions/form.html#validation-errors) |
| **check(computed)** | (string) | boolean | Check field computed property. | [help](../actions/shared.html#check-field-computed-values) |
| **check(computed, deep)** | (string, boolean) | boolean | Check all nested fields computed property if `deep` is `true` | [help](../actions/shared.html#check-field-computed-values) |
| **get()** | - | object | Get all field and nested fields data with all props and computed values. | [help](../actions/shared.html#get-fields-properties) |
| **get(prop)** | (any) | object | Get all field filtering by certain `props` (string or array). | [help](../actions/shared.html#get-fields-properties) |
| **set(val)** | (any) | void | Set field value. Takes the value. | [help](../actions/shared.html#set-fields-properties) |
| **set(obj)** | (object) | void | Provide an object to set nested fields values. | [help](../actions/shared.html#set-fields-properties) |
| **set(prop, val)** | (string, any) | void | Set field property. Takes prop key and prop value. | [help](../actions/shared.html#set-fields-properties) |
| **set(prop, obj)** | (string, object) | void | Provide a prop key and object to set nested fields properties. | [help](../actions/shared.html#set-fields-properties) |
| **has(key)** | (string) | boolean | Provide Field key to check if exist. | [help](../actions/shared.html#has) |
| **map(callback)** | (function) | array | Map Nested Fields | [help](../actions/shared.html#map) |
| **reduce(callback, acc)** | (function, any) | any | Reduce Nested Fields | [help](../actions/shared.html#reduce) |
| **each(callback)** | (function) | void | Iterates over fields and nested fields recursively and invokes a callback which get each field in input. | [help](../actions/shared.html#each) |
| **add(obj)** | (any) | any | Add a Field or Nested Fields. | [help](../actions/shared.html#add--del) |
| **del(key)** | (any) | void | Delete a Field or Nested Fields by `key` or `path`. | [help](../actions/shared.html#add--del) |
| **move(fromIndex, toIndex)** | (number, number) | void | Move an array field item from one index to another. Preserves bindings and validation. | [help](../actions/shared.html#movefromindex-toindex) |
| **observe(obj)** | (object) | function | Define a MobX Observer on Field Props or Field Map. Returns a disposer function. | [help](../extra/mobx-events.html) |
| **intercept(obj)** | (object) | function | Define a MobX Interceptor on Field Props or Field Map. Returns a disposer function. | [help](../extra/mobx-events.html) |

> `$('path')` is an alias of `select(path)`.
> `hasNestedFields` and `hasIncrementalKeys` are computed properties (getters), not methods — see [Form Properties](form-properties.md).

#### Helpers

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **values()** | - | object | Get Field & Nested Fields Values. | [help](../actions/helpers.html#get-all-fields-values) |
| **errors()** | - | object | Get Field & Nested Fields Errors. | [help](../actions/helpers.html#get-all-fields-errors) |
| **labels()** | - | object | Get Field & Nested Fields Labels. | [help](../actions/helpers.html#get-all-fields-labels) |
| **placeholders()** | - | object | Get Field & Nested Fields Placeholders. | [help](../actions/helpers.html#get-all-fields-placeholders) |
| **defaults()** | - | object | Get Field & Nested Fields Default Values. | [help](../actions/helpers.html#get-all-fields-defaults-values) |
| **initials()** | - | object | Get Field & Nested Fields Initial Values. | [help](../actions/helpers.html#get-all-fields-initials-values) |
| **types()** | - | object | Get Field & Nested Fields Type. | [help](../actions/helpers.html#get-all-fields-types) |

> Some of these Helpers methods are plurals.

#### Event Handlers

| Property | Input | Output | Info | Help |
|---|---|---|---|---|
| **onSubmit(e)** | - | object | Validate the form and call `onSuccess(form)` or `onError(form)`. | [help](../events/event-handlers.html#onsubmite) |
| **onClear(e)** | - | object | Clear all the Fields and Nested Fields to `empty` value. | [help](../events/event-handlers.html#oncleare--onresete) |
| **onReset(e)** | - | object | Reset all the Fields and Nested Fields to `default` value. | [help](../events/event-handlers.html#oncleare--onresete) |
| **onAdd(e)** | - | object | Add a Field or Nested Fields. | [help](../events/event-handlers.html#onadde--ondele) |
| **onDel(e)** | - | object | Delete a Field or Nested Fields. | [help](../events/event-handlers.html#onadde--ondele) |
| **onDrop(e)** | - | object | Handle file drop events when `type: 'file'`. | [help](../events/event-handlers.html#ondrope) |

> All Event Handlers takes the Proxy object in input.
