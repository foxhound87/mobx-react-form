### onInit()

If you need to execute some code just after the form is initialized,
you can extend the form implementing the `onInit(form)` mehtod:

```javascript
import Form from 'mobx-react-form';

class MyForm extends MobxReactForm {

  onInit(form) {
    // do staff on the form
  }
}
```

