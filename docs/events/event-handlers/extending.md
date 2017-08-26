# Custom Event Handlers

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)

---

## Extending the Field Class

Extend the **Form** or **Field** class with an `handlers()` method which will return a Event Handlers function.

Availables Handlers on Form: `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`.

Availables Handlers on Field: `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`.


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

> The handlers will not get the current field in input, just use `this`.
