# Custom Event Handlers

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)

---

## On Form Initialization

Define a `handlers` object with Event Handler functions and pass them to the **Form Constructor** (second argument) or to the **Field Definition** (first argument).

#### Defining handlers on Form

Available handlers on Form: `onInit`, `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel`.

> Pass the `handlers` object to the **Second Argument**.

```javascript
const handlers = {
  onSubmit: (form) => (e) => {
    console.log('-> onSubmit HANDLER - Form isValid?', form.isValid);
  },
};

new Form({ ... }, { handlers }); // <--- second argument
```

#### Defining handlers on Field

Available handlers on Field: `onInit`, `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel`, `onKeyUp`, `onKeyDown`.

> Pass the `handlers` object to the **First Argument** in the field definitions (unified or separated).

**Unified mode:**

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    handlers: {
      onChange: (field) => (e) => {
        console.log('-> onChange HANDLER - Field:', field.path, 'new value:', field.value);
        field.set(e.target.value);
      },
    },
  },
};

new Form({ fields }, { ... });
```

**Separated mode:**

```javascript
const handlers = {
  username: {
    onChange: (field) => (e) => {
      console.log('-> onChange HANDLER - Field:', field.path, 'new value:', field.value);
      field.set(e.target.value);
    },
  },
};

new Form({ fields: ['username'], handlers });
```

> Handlers defined on initialization take precedence over built-in handlers.
