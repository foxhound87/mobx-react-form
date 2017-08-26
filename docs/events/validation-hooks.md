# Validation Hooks

* [On Form Initialization](validation-hooks/constructor.md)
* [Extending the Class](validation-hooks/extending.md)
* [Override on Manual Submit](validation-hooks/override.md)

---

The Validation Hooks are special Event Hooks called after the submit or validation actions.

##### Available Validation Hooks
> Triggered by Actions

| Action | Executed Hook | FORM | FIELD |
|---|---|---|---|
| submit() > validate() | onSuccess | YES | YES |
| submit() > validate() | onError | YES | YES |

> The Validation Hooks can return a Promise

---

%accordion% **VERSION < 1.32** %accordion%

The `onClear`, `onReset` & `onSubmit` are handled differently:

If you define them in the **Form or Field Class**, they are **Event Handlers**.

If you define them in the **Field Definition**, they are **Event Hooks**.

If you define `onSuccess` & `onError` in the **Form or Field Class**, they are **Event Hooks**.

%/accordion%

