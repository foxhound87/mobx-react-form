# Built-In Event Handlers

* [Sync Field Value](#sync-field-value)
* [Focused & Touched State](#focused--touched-state)
* [Clear & Reset Form or Fields](#clear--reset)
* [Nested Array Elements](#nested-array-elements)
* [Submitting the Form](#submitting-the-form)
* [Handle Files](#handle-files)


* [onChange(e) & onToggle(e)](#onchangee--ontogglee)
* [onFocus(e) & onBlur(e)](#onfocuse--onblure)
* [onClear(e) & onReset(e)](#oncleare--onresete)
* [onAdd(e) & onDel(e)](#onadde--ondele)
* [onSubmit(e)](#onsubmite)
* [onDrop(e)](#ondrope)


# Custom Event Handlers

* [On Form Initialization](event-handlers/constructor.md)
* [Extending the Class](event-handlers/extending.md)

---

## Sync Field Value

#### onChange(e) & onToggle(e)

| Handler | Affected Property| Executed Hook |
|---|---|---|
| onChange(e) | value | onChange |
| onToggle(e) | value | onToggle |

<br>

Use the `onChange(e)` or `onToggle(e)` handler to update the state of the field.

```html
<input
  ...
  onChange={form.$('username').onChange}
/>
```

> If you are using a custom component which doesn't work with the package's built-in sync handler, [open an Issue](https://github.com/foxhound87/mobx-react-form/issues).

---

## Focused & Touched State

#### onFocus(e) & onBlur(e)

| Handler | Affected Property | Executed Hook |
|---|---|---|
| onFocus(e) | focused | onFocus |
| onBlur(e) | touched | onBlur |

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

| Handler | Action | Affected Property | Executed Hook | Result |
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

| Handler | Action | Affected Property | Executed Hook | Result |
|---|---|---|---|---|
| onAdd(e) | add() | fields | onAdd | Add a field |
| onDel(e) | del() | fields | onDel | Remove a field |

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

#### onSubmit(e)

| Handler | Action | Affected Property | Executed Hook | FORM | FIELD |
|---|---|---|---|---|
| onSubmit(e) | submit() > validate() | submitting, validating | onSubmit | YES | YES |

The `onSubmit(e)` will `validate` the form and will call respectively `onSuccess(form)` or `onError(form)` **Validation Hooks** if they are implemented.

The `onSuccess(form)` and `onError(form)` methods takes the `form` object in input. So you can perform more actions after the validation occurs.

You can easly include the `onSubmit(e)` handler in your component:

```html
<button type="submit" onClick={form.onSubmit}>Submit</button>
```

---

## Handle Files

#### onDrop(e)

| Handler | Affected Property | Executed Hook | Result |
|---|---|---|---|
| onDrop(e) | files | onDrop | Retrieve the files |

The `onDrop(e)` Event Handler will retrive the files into the `files` Field prop and exeute the `onDrop` Hook function.

Define the field `type` property as `file` and then use `bind()` on your input:

```html
<input multiple=true {...field.bind()} />
```

Otherwise, (without defining the `type` prop) delegate the input `onChange` Handler with the `onDrop(e)` Handler on the `bind()` method (or create a [custom bindings](../bindings/custom.md)).

```html
<input
  multiple=true
  {...field.bind({
    onChange: field.onDrop,
  })}
/>
```
