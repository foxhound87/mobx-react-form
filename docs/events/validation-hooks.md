# Validation Hooks

* [On Form Initialization](validation-hooks/constructor.md)
* [Extending the Class](validation-hooks/extending.md)
* [Override on Manual Submit](validation-hooks/override.md)

---

Validation Hooks are special Event Hooks called after the submit or validation actions. They can return Promises.

#### Available Validation Hooks

| Action | Executed Hook | Form | Field |
|--------|---------------|------|-------|
| submit() → validate() | onSuccess | ✓ | ✓ |
| submit() → validate() | onError | ✓ | ✓ |

> The Validation Hooks can return a Promise to wait for async operations.

---

%accordion% **Legacy API — Version < 1.32** %accordion%

In older versions, `onClear`, `onReset` & `onSubmit` were handled differently:

- If defined in the **Form or Field Class**, they were treated as **Event Handlers**.
- If defined in the **Field Definition**, they were treated as **Event Hooks**.
- `onSuccess` & `onError` defined in the **Form or Field Class** were always **Event Hooks**.

Also, Validation Hooks were passed as `onSubmit` instead of `hooks`:

```javascript
const onSubmit = {
  onSuccess(form) {
    console.log('Form Values!', form.values());
  },
  onError(form) {
    console.log('All form errors', form.errors());
  },
};

new Form({ ... }, { onSubmit }); // <--- was `onSubmit`, now `hooks`
```

%/accordion%
