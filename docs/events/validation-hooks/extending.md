# Validation Hooks

* [On Form Initialization](constructor.md)
* [Extending the Class](extending.md)
* [Override on Manual Submit](override.md)

---

## Extending the Class
#### onSuccess() & onError()

These methods are called when the form validation is done.

> They can return promises to wait on submit.

Extend the **Form** or **Field** class with an `hooks()` method which will return the `onSuccess(form)` or `onError(form)` Validation Hooks.

```javascript
import MobxReactForm from 'mobx-react-form';

class MyForm extends MobxReactForm {

  hooks() {
    return {
      onSuccess() {
        alert('Form is valid! Send the request here.');
        // get field values
        console.log('Form Values!', this.values());
        // can return a promise here!
      },
      onError() {
        // get all form errors
        console.log('All form errors', this.errors());
        // invalidate the form with a custom error message
        this.invalidate('This is a generic error message!');
        // can return a promise here!
      },
    };
  }
}
```

%accordion% **VERSION < 1.32** %accordion%

```javascript
import MobxReactForm from 'mobx-react-form';

class MyForm extends MobxReactForm {

  onSuccess() {
    console.log('Form Values!', form.values());
  }

  onError() {
    console.log('All form errors', this.errors());
  }
}
```

%/accordion%

# Sub-Form Submission
#### onSuccess(fieldset) & onError(fieldset)

The Validation Hooks can be implemented on extended Field class as well.

[Read more on how to extend custom Field](../../form/extend/custom.md)

[Read more on how to register Sub-Form Validation Hooks without extendig the Fields](constructor.md)

