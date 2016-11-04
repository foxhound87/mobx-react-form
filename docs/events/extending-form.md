## Extending the Form Object with the Events Handlers

### onInit()

If you need to execute some code just after the form is initialized,
you can extend the form implementing the `onInit()` mehtod:

```javascript
import Form from 'mobx-react-form';

class MyForm extends MobxReactForm {

  onInit(form) {
    // do staff on the form
  }
}
```

> It takes the `form` parameter in input.

### onSuccess() & onError()

These methods are called when the form validation is done.

Extend the Form Class with `onSuccess` and `onError` methods:

```javascript
import MobxReactForm from 'mobx-react-form';

class MyForm extends MobxReactForm {

  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    // get field values
    console.log('Form Values!', form.values());
  }

  onError(form) {
    // get all form errors
    console.log('All form errors', form.errors());
    // invalidate the form with a custom error message
    form.invalidate('This is a generic error message!');
  }
}
```

> They take the `form` parameter in input.

