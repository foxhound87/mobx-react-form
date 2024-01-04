# Extend Form & Field

* [Extend Form & generic Field](generic.md)
* [Extend specific custom Field](custom.md)
* [Extend Field in Field Definition](configure.md)

---

### Extend Field in Field Definition

Import the base `Form` and `Field` class:

```javascript
import MobxReactForm, { Field } from "mobx-react-form";
```

or you can also import the base `Form` like this:

```javascript
import { Form, Field } from "mobx-react-form";
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

#### Specify the class to use in the field definition

##### Separated Definition

```javascript
export default new Form({
  fields: [
    "aStandardField", // will default to Field
    "aCustomField",
  ],
  classes: {
    aCustomField: CustomSelectField,
  },
});
```

##### Unified Definition

```javascript
export default new Form({
  fields: [
    {
      name: "aStandardField", // will default to Field
    },
    {
      name: "aCustomField",
      class: CustomSelectField,
    },
  ],
});
```
