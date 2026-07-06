# Custom Event Hooks

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)

---

## On Form Initialization

Define a `hooks` object with Event Hook functions and pass them to the **Form Constructor** (second argument) or to the **Field Definition** (first argument).

#### Defining hooks on Form

Available hooks on Form: `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`.

> Pass the `hooks` object to the **Second Argument**.

```javascript
const hooks = {
  onSubmit(form) {
    console.log('-> onSubmit HOOK - isValid?', form.isValid);
  },
};

new Form({ ... }, { hooks }); // <--- second argument
```

#### Defining hooks on Field

Available hooks on Field: `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`, `onKeyUp`, `onKeyDown`.

> Pass the `hooks` object to the **First Argument** in the field definitions (unified or separated).

**Unified mode:**

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    hooks: {
      onBlur(field) {
        console.log('-> onBlur HOOK', field.path);
      },
    },
  },
};

new Form({ fields }, { ... });
```

**Separated mode:**

```javascript
const hooks = {
  username: {
    onBlur(field) {
      console.log('-> onBlur HOOK - Field:', field.path);
    },
  },
};

new Form({ fields: ['username'], hooks });
```
