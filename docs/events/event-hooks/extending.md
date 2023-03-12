# Event Hooks

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)

---

## Extending the Class

Extend the **Form** or **Field** class with an `hooks()` method which will return a Event Hooks function.

Availables Hooks on Form: `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel`.

Availables Hooks on Field: `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel`, `onKeyUp`, `onKeyDown`.

```javascript
import { Form, Field } from 'mobx-react-form';

class MyField extends Field {

  hooks() {
    return {
      onChange(field) {
        console.log('-> onChange HOOK - changed:', field.path);
      },
    };
  }
}

class MyForm extends Form {

  makeField(props) {
    return new MyField(props);
  }

  hooks() {
    return {
      onSubmit(form) {
        console.log('-> onSubmit HOOK - isValid?', form.isValid);
      },
    };
  }
}
```

