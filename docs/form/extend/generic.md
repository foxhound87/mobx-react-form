# Extend Form & Field

* [Extend Form & generic Field](generic.md)
* [Extend specific custom Field](custom.md)
* [Extend Field in Field Definition](configure.md)

---

### Extend Form & generic Field

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

  constructor(props) {
    super(props);

    // ...
  }
}
```

implement `MyField` into the `makeField()` method of the `Form` class:

```javascript
class MyForm extends Form {

  makeField(props) {
    return new MyField(props);
  }
}
```

then create the form instance using `MyForm` class:

```javascript
export default new MyForm( ... );
```
