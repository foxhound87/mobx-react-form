## Form Initialization

###### Initialization

| Property | Description | Help |
|---|---|---|
| **plugins**   | Enable additional functionalities using external libraries. | [validation plugins](../validation/plugins.md) |
| **options**   | Options used by the `form` or the imported `plugins` which may alter the validation behavior. | [form options](form-options.md) |
| **fields**    | Using **Unified Properties** mode: an object which represents the fields with all their properties. Using **Separated Properties** mode: an array which represents the fields structure. | [defining fields](../defining-fields.md) |

###### Validation
If you need to validate fields use the following properties according to the choosen [validation plugin](https://foxhound87.github.io/mobx-react-form/docs/validation/plugins.html)

| Property | Description | Help |
|---|---|---|
| **validate**  | The validation functions for the **VJF** mode. | [VJF](../validation/modes/vjf-enable.md) |
| **rules**    | The rules for the validation (if **DVR** mode is active). | [DVR](../validation/modes/dvr-enable.md) |
| **schema**    | The json-schema for the validation (if **SVK** mode is active). | [SVK](../validation/modes/svk-enable.md) |


###### Field Properties
If you are using the **Separated Properties** mode, provide the following properties:

| Property | Description | Help |
|---|---|---|
| **values**    | Object which represents the `value`property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-values) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-values) |
| **labels**    | Object which represents the `label` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-labels) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **placeholders**    | Object which represents the `placeholder` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-placeholders) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **defaults**  | Object which represents the `default` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-defaults) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **disabled**  | Object which represents the `disabled` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-disabled) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **related**  | Object which represents the `related` property to validate others fields at the same time for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-related) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |

> Some of these initialization properties are plurals.

## Usage

> You can mix all the objects you need

``` javascript
import Form from 'mobx-react-form';

... // define all needed objects

// using options and unified fields properties
new Form({ options, fields, ... });

// using options and separated fields properties
new Form({ options, values, labels, ... });

// using validators with plugins and unified fields properties
new Form({ options, plugins, fields });

// using validators with plugins and separated fields properties
new Form({ options, plugins, values, labels, rules, ... });
```

## setup()

Normally you have to pass the initialization object to the constructor, or you can implement the `setup()` method inside your extended form class which will return the object of all properties:

```javascript
import Form from 'mobx-react-form';

class MyForm extends MobxReactForm {

  setup() {
    // same of: new MyForm({ fields, ... });
    return { fields, ... };
  }
}
```

> The object returned from the `setup()` method will be deep-merged to the object provieded to the constructor when initializing the instance.


## onInit()

If you need to execute some code just after the form is initialized,
you can extend the form implementing the `onInit(form)` mehtod:

```javascript
import Form from 'mobx-react-form';

class MyForm extends MobxReactForm {

  onInit(form) {
    // do stuff on the form
  }
}
```

> It takes the `form` parameter in input.

[See Other Form Events](../events)
