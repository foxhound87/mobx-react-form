# Custom Event Handlers

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)

---

## Extending the Field Class

Override handlers by extending the **Form** or **Field** class with a `handlers()` method or by directly assigning handler properties.

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

> When extending, handlers receive the field/form instance as `this` — no argument needed. The handlers will not get the current field in input, just use `this`.

Available handlers on Form: `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`.

Available handlers on Field: `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`.
