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

### Extend particular custom Field

In this example, you can see how to extend only a particular field:

```javascript
class CustomSelectField extends Field {

  // for example we want to provide options values for the select input
  options = ['Poor', 'Average', 'Excellent', 'Unsure'];

  constructor(data) {
    super(data);
  }
}
```

Into `makeField()` we have to match the `field.key` property with our sepcific field key/name.

```
class MyForm extends Form {

  makeField(field) {
    switch(field.key) {
      case 'mySelectField':
        return new CustomSelectField(field);
        break;
      default:
        return new Field(field);
    }
  }
}
