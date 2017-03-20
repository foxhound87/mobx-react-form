# Extend Form & Field

* [Extend Form & generic Field](generic.md)
* [Extend particular custom Field](custom.md)

---

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

```javascript
class MyForm extends Form {

  makeField(field) {
    switch(field.key) {
      case 'mySelectField':
        return new CustomSelectField(field);
      default:
        return new Field(field);
    }
  }
}
```
