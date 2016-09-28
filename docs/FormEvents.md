## Form Events

###### We have two alternatives to deal with events:

- Extending the Form object with Events Handlers

- Decopling the Events Handlers from Form object

> We can choose to use the Built-In handlers, override them or reimplement them to provide different features or behaviors.

The package provide those ready to use event handlers:

`onSubmit(e)`, `onSuccess(e)`, `onError(e)`.

---


> The `onSubmit` will `validate` the form and will call respectively `onSuccess` or `onError` mehtods if they are implemented in the `extended` class.


The `onSuccess` and `onError` mehtods takes the `form` object in input. So you can perform more actions after the validation occurs.

All Event Handlers methods take the `Proxy` object and can be easly included in yours components:

```javascript
...

<button onClick={form.onSubmit} type="submit">Submit</button>
<button onClick={form.onClear}>Clear</button>
<button onClick={form.onReset}>Reset</button>

...
```

### Extending the Form object with the Events Handlers

Extend the Form Class with `onSuccess` and `onError` methods.

```javascript
import MobxReactForm from 'mobx-react-form';

export default class MyForm extends MobxReactForm {

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

### Decopling the Events Handlers from the Form object

Define an `event` object with `onSuccess()` or `onError()` mehtods.

```javascript
const events = {
  onSuccess(form) { ... // access form },
  onError(form) { ... // access form },
};
```

Then pass the events to the `onSubmit` events handler:

```javascript
...

<button
  type="submit"
  onClick={e => form.onSubmit(e, {
    onSuccess: events.onSuccess,
    onError: events.onError,
  })}
>Submit</button>

...
```
