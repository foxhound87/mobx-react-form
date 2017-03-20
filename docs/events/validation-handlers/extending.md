# Validation Handlers

* [Extending the Form with Validation Handlers](extending.md)
* [Decupling the Validation Handlers from the Form](decoupling.md)

## Extending the Form Instance
#### onSuccess() & onError()

These methods are called when the form validation is done.

Extend the Form Class with `onSuccess()` and `onError()` methods:

```javascript
import MobxReactForm from 'mobx-react-form';

class MyForm extends MobxReactForm {

  onSuccess() {
    alert('Form is valid! Send the request here.');
    // get field values
    console.log('Form Values!', this.values());
  }

  onError() {
    // get all form errors
    console.log('All form errors', this.errors());
    // invalidate the form with a custom error message
    this.invalidate('This is a generic error message!');
  }
}
```

> They take the `form` parameter in input.

