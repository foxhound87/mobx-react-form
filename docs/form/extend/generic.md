# Extend Form & Field

* [Extend Form & generic Field](generic.md)
* [Extend particular custom Field](custom.md)

---

# Extend Form & Field

Import the base `Form` and `Field` class:

```javascript
import MobxReactForm, { Field } from 'mobx-react-form';
```

or you can also import the base `Form` like this:

```javascript
import { Form, Field } from 'mobx-react-form';
```

extend the `Field` (for example with custom props):

```javascript
class MyField extends Field {

  // ...

  constructor(data) {
    super(data);

    // ...
  }
}
```

implement `MyField` into the `makeField()` method of the `Form` class:

```javascript
class MyForm extends Form {

  makeField(data) {
    return new MyField(data);
  }
}

export default new MyForm( ... );
```
