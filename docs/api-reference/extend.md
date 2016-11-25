# Extend Form & Field

Import the base `Field` class:

```javascript
import MobxReactForm, { Field } from 'mobx-react-form';
```

or you can import the base `Form` like this:

```javascript
import { Form, Field } from 'mobx-react-form';
```

extend it (for example with custom props):

```javascript
class MyField extends Field {

  myFieldCustomProp = false;

  constructor(data) {
    super(data);

    ...
  }
}
```

implement it into the `makeField()` method of the `Form` class:

```javascript
class MyForm extends Form {

  makeField(data) {
    return new MyField(data);
  }
}

export default new MyForm( ... );
```
