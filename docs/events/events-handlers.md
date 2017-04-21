# Events Handlers

All Event Handlers methods takes the `Proxy` object `(e)` in input as first argument and can be easly included in yours components.

 * [Sync Field Value](#sync-field-value)
 * [Focused & Touched State](#focused--touched-state)
 * [Clear & Reset Form or Fields](#clear--reset)
 * [Nested Array Elements](#nested-array-elements)
 * [Submitting the Form](#submitting-the-form)


 * [onChange(e) & onToggle(e)](#onchangee--ontogglee)
 * [onFocus(e) & onBlur(e)](#onfocuse--onblure)
 * [onClear(e) & onReset(e)](#oncleare--onresete)
 * [onAdd(e) & onDel(e)](#onadde--ondele)
 * [onDrop(e)](#ondrope)
 * [onSubmit(e)](#onsubmite)

##### Validation Handlers

  * [Extending the Form Instance](validation-handlers/extending.md)
  * [Decupling from the Form Instance](validation-handlers/decoupling.md)

---

## Sync Field Value

#### onChange(e) & onToggle(e)

| Handler | Affected Property |
|---|---|
| sync(e) | value |
| onChange(e) | value |
| onToggle(e) | value |

<br>

Use the `sync(e)` handler to update the state of the field.

```html
<input
  ...
  onChange={form.$('username').sync}
/>
```

> `onChange(e)` and `onToggle(e)` are aliases of `sync(e)`;

> If you are using a custom component which doesn't work with the package's built-in sync handler, [open an Issue](https://github.com/foxhound87/mobx-react-form/issues).

---

## Focused & Touched State

#### onFocus(e) & onBlur(e)

| Handler | Affected Property |
|---|---|
| onFocus(e) | focused |
| onBlur(e) | touched |

<br>

If you need to track `touched` or `focused` state, you can use `onFocus(e)` or `onBlur(e)` handlers:

```html
<input
  ...
  onFocus={form.$('username').onFocus}
  onBlur={form.$('username').onBlur}
/>
```

---

### Clear & Reset

#### onClear(e) & onReset(e)

| Handler | Action | Affected Property | Executed Hook |Result |
|---|---|---|---|
| onClear(e) | clear() | value | onClear | to empty values |
| onReset(e) | reset() | value | onReset | to default values |

<br>

On the form instance:

```html
<button type="button" onClick={form.onClear}>Clear</button>
<button type="button" onClick={form.onReset}>Reset</button>
```

or selecting Specific Field or Nested Fields:


```html
<button type="button" onClick={form.$('members').onClear}>Clear</button>
<button type="button" onClick={form.$('members').onReset}>Reset</button>
```

---

### Nested Array Elements

#### onAdd(e) & onDel(e)

| Handler | Action | Result | Affected Property |
|---|---|---|---|
| onAdd(e) | add() | Add a field element in an array container | fields |
| onDel(e) | del() | Remove a field element in an array container | fields |

<br>

##### Adding a Field

```html
<button type="button" onClick={hobbies.onAdd}>Add Hobby</button>
```

or using the field `selector`:

```html
<button type="button" onClick={form.$('hobbies').onAdd}>Add Hobby</button>
```

or specify the field `value` as second argument:

```html
<button type="button" onClick={e => form.$('hobbies').onAdd(e, 'soccer')}>Add Hobby</button>
```

<br>

##### Deleting a Field

```html
<button type="button" onClick={hobby.onDel}>Delete Hobby</button>
```

or using the field `selector` with a field `key`:

```html
<button type="button" onClick={form.$('hobbies').$(3).onDel}>Delete Hobby</button>
```

or specify the field `path` as second argument:

```html
<button type="button" onClick={e => form.onDel(e, 'hobbies[3]')}>Delete Hobby</button>
```

---

## Submitting the Form

#### onDrop(e)

| Handler | Affected Property | Executed Hook | Result |
|---|---|---|---|
| onDrop(e) | files | onDrop | Retrieve the files |

Delegate the input `onChange` event with the `onDrop(e)` Event Handler and it will retrive the files into the `files` Field prop and exeute the `onDrop` Hook function.

```javascript
<input
  multiple=true
  {...field.bind({
    onChange: field.onDrop,
  })}
/>
```

---

## Submitting the Form

#### onSubmit(e)

| Handler | Action | Affected Property | Executed Hook | Result |
|---|---|---|---|
| onSubmit(e) | submit() > validate() | validating | onSubmit | Execute validation |

The `onSubmit(e)` will `validate` the form and will call respectively `onSuccess(form)` or `onError(form)` **Validation Handlers** if they are implemented.

The `onSuccess(form)` and `onError(form)` methods takes the `form` object in input. So you can perform more actions after the validation occurs.

You can easly include the `onSubmit(e)` handler in your component:

```html
<button type="submit" onClick={form.onSubmit}>Submit</button>
```

#### Validation Handlers

We have some alternatives to deal with the Validation Handlers:

  * [Extending the Form Instance with Validation Handlers](validation-handlers/extending.md)
  * [Passing the Validation Handlers to the Form constructor](validation-handlers/constructor.md)
  * [Override the Validation Handlers with Manual Submit](validation-handlers/override.md)
