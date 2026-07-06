# Custom Event Hooks

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)

---

## Extending the Class

Extend the **Form** or **Field** class with a `hooks()` method which returns the Event Hook functions.

```javascript
import { Form, Field } from 'mobx-react-form';

class MyForm extends Form {
  hooks() {
    return {
      onSubmit(form) {
        console.log('-> onSubmit HOOK - isValid?', form.isValid);
      },
    };
  }
}

class MyField extends Field {
  hooks() {
    return {
      onChange(field) {
        console.log('-> onChange HOOK - changed:', field.path);
      },
    };
  }
}
```

Available hooks on Form: `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel`.

Available hooks on Field: `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel`, `onKeyUp`, `onKeyDown`.
