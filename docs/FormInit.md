## Form Initialization

| Property | Description | Help |
|---|---|---|
| **fields**    | Object which represents the fields: name, label, value. | [defining fields](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md) |
| **labels**    | Object which represents the labels if you want to provide them separately from the `fields` object. | [defining labels](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md#defining-labels-separately) |
| **options**   | Options used by the `form` or the imported `plugins` which may alter the validation behavior. | [form options](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#form-options) |
| **plugins**   | Enable additional functionalities using external libraries. | [validation plugins](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#validation-plugins) |
| **schema**    | The json-schema for the validation (if **SVK** mode is active). | [json schema](http://json-schema.org) |

## Usage

``` javascript
import Form from 'mobx-react-form';

... // define all needed objects

new Form({ fields, options, plugins, schema });
```

## Form Events

### onInit

If you need to execute some code just after the form is initialized,
you can extend the form implementing the `onInit()` mehtod:

```javascript
import Form from 'mobx-react-form';

export default class MyForm extends MobxReactForm {

  onInit(form) {
    // do staff on the form
  }
}
```

> It takes the `form in input.
