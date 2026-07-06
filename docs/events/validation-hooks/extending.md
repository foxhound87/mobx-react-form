# Validation Hooks

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)
* [Override on Manual Submit](override.md)

---

## Extending the Class

#### onSuccess() & onError()

Extend the **Form** or **Field** class with a `hooks()` method which returns Validation Hooks.

```javascript
import { Form } from 'mobx-react-form';

class MyForm extends Form {
  hooks() {
    return {
      onSuccess() {
        alert('Form is valid! Send the request here.');
        console.log('Form Values!', this.values());
        // can return a promise here!
      },
      onError() {
        console.log('All form errors', this.errors());
        this.invalidate('This is a generic error message!');
        // can return a promise here!
      },
    };
  }
}
```

#### Sub-Form Submission

Validation Hooks can be implemented on extended Field classes as well for sub-form patterns.

[Read more on how to extend custom Field](../../form/extend/custom.md)

[Read more on how to register Sub-Form Validation Hooks without extending the Fields](constructor.md)
