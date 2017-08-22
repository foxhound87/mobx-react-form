# Custom Handlers/Hooks

Define a **Custom Handlers/Hooks** to overwrite the default **Event Handlers**, **Event Hooks** or **Validation Handlers**.

All Custom Handlers can be defined in two different modes:

  * [On Form initialization](#on-form-initialization)
  * [Extending the Field class](#extending-the-field-class)

---

Available Handlers/Hooks: `onChange`, `onToggle`, `onDrop`, `onClear`, `onReset` & `onSubmit`.

On the **Form Instance**, only `onClear`, `onReset` and `onSubmit` are available.

After you defined your **Custom Event Handlers**, you can use the field `bind()` method on your inputs or rewire the props to specific ones defining [custom bindings](../bindings/custom.md).

---

### IMPORTANT!

The `onClear`, `onReset` & `onSubmit`, can be both **Event Handlers** or **Event Hooks**.

If you define them in the **Form or Field Class**, they are **Event Handlers**.

If you define them in the **Field Definition**, they are **Event Hooks**.

If you define `onSuccess` & `onError` in the **Form or Field Class**, they are **Event Hooks**.

> The Event Hooks are executed after the Event Handlers.

Read more info about the lifecycle of Handlers/Hooks in the [Event Handlers](events-handlers.md) and [Validation Handlers](validation-handlers.md) sections.

---

## On Form initialization

This is an example of a very basic `onChange` handler in the field definition which is setting the field value using the `set()` method:

```javascript
  new Form({
    fields: {
      username: {
        label: 'Username',
        onChange: field => (e) => field.set(e.target.value),
      },
    },
  });
```

> All defined handlers/hooks will get the current field in input.

> Separated Field Properties Definition is also supported.

## Extending the Field Class

This is a custom Field Class with a very basic custom `onChange` Handler which is setting the field value using the `set()` method:

```javascript
import { Form, Field } from 'mobx-react-form';

class CustomField extends Field {
  onChange = (e) => this.set(e.target.value);
}

class MyForm extends Form {
  makeField(field) {
    return new CustomField(field);
  }
}
```

> The handlers/hooks will not get the current field in input, just use `this`.


