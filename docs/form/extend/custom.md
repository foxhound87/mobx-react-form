# Extend Form & Field

* [Extend Form & generic Field](generic.md)
* [Extend specific custom Field](custom.md)
* [Extend Field in Field Definition](configure.md)

---

### Extend specific custom Field

Import the base `Form` and `Field` class:

```javascript
import MobxFormkit, { Field } from 'mobx-formkit';
```

or you can also import the base `Form` like this:

```javascript
import { Form, Field } from 'mobx-formkit';
```

In this example, you can see how to extend a specific field:

```javascript
class CustomSelectField extends Field {

  // for example we want to provide options values for the select input
  dropDownOptions = ['Poor', 'Average', 'Excellent', 'Unsure'];

  constructor(props) {
    super(props);

    // ...
  }
}
```

Into `makeField()` we have to match the `field.key` property with our sepcific field key/name.

```javascript
class MyForm extends Form {

  makeField(props) {
    switch(props.key) {
      case 'mySelectField':
        return new CustomSelectField(props);
      default:
        return new Field(props);
    }
  }
}
```

then create the form instance using `MyForm` class:

```javascript
export default new MyForm( ... );
```
