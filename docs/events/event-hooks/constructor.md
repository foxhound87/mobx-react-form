# Event Hooks

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)

---

## On Form Initialization

Define an `hooks` object with an Event Hook function and pass them to the **Form Constructor**:

#### Defining hooks on Form

Availables Handlers on Form: `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`.

> Pass the `hooks` object to the **Second Argument**.

```javascript
const hooks = {
  onSubmit(form) {
    console.log('-> onSubmit HOOK - isValid?', form.isValid);
  },
};

new Form({ ... }, { hooks }); <---
```

#### Defining hooks on Field

Availables Handlers on Field: `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`, `onKeyUp`, `onKeyDown`.

> Pass the `hooks` object to the **First Argument** in the field definitions (unified or separated).

```javascript
const fields = {
  username: {
    label 'Username',
    value: 'SteveJobs',
    hooks: {
      onBlur(field) {
        console.log('-> onBlur HOOK', field.path);
      },
    },
  },
};

new Form({ fields }, { ... }); <---
```
