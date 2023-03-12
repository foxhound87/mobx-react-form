# Custom Event Handlers

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)

---

## On Form Initialization

Define an `handlers` object with an Event Handlers function and pass them to the **Form Constructor**:

#### Defining handlers on Form

Availables handlers on Form: `onInit`, `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel`.

> Pass the `handlers` object to the **Second Argument**.

```javascript
const handlers = {
  onSubmit: (form) => (e) => {
    console.log('-> onSubmit HANDLER - Form isValid?', form.isValid);
  },
};

new Form({ ... }, { handlers }); <---
```

#### Defining handlers on Field

Availables handlers on Field: `onInit`, `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel`, `onKeyUp`, `onKeyDown`.

> Pass the `handlers` object to the **First Argument** in the field definitions (unified or separated).

```javascript
const fields = {
  username: {
    label 'Username',
    value: 'SteveJobs',
    handlers: {
      onChange: (field) => (e) => {
        console.log('-> onChange HANDLER - Field:', field.path, 'new value:' field.value);
        field.set(e.target.value);
      },
    },
  },
};

new Form({ fields }, { ... }); <---
```
