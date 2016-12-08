## Form Initialization

###### Initialization

| Property | Description | Help |
|---|---|---|
| **plugins**   | Enable additional functionalities using external libraries. | [validation plugins](../validation/plugins.md) |
| **options**   | Options used by the `form` or the imported `plugins` which may alter the validation behavior. | [form options](form-options.md) |
| **fields**    | Object which represents the fields with all their properties. | [defining fields](../defining-fields.md) |

###### Field Properties

| Property | Description | Help |
|---|---|---|
| **values**    | Object which represents the `value`property for each field key - if you want to provide them separately from the `fields` object. | [flat](../defining-flat-fields/separated-properties.md#defining-values) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-values) |
| **labels**    | Object which represents the `label` property for each field key - if you want to provide them separately from the `fields` object. | [flat](../defining-flat-fields/separated-properties.md#defining-labels) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **placeholders**    | Object which represents the `placeholder` property for each field key - if you want to provide them separately from the `fields` object. | [flat](../defining-flat-fields/separated-properties.md#defining-placeholders) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **defaults**  | Object which represents the `default` property for each field key - if you want to provide them separately from the `fields` object. | [flat](../defining-flat-fields/separated-properties.md#defining-defaults) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **disabled**  | Object which represents the `disabled` property for each field key - if you want to provide them separately from the `fields` object. | [flat](../defining-flat-fields/separated-properties.md#defining-disabled) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **related**  | Object which represents the `related` property to validate others fields at the same time for each field key - if you want to provide them separately from the `fields` object. | [flat](../defining-flat-fields/separated-properties.md#defining-related) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |

> Some of these initialization properties are plurals.

###### Validation

| Property | Description | Help |
|---|---|---|
| **validate**  | The validation functions for the **VJF** mode. | [VJF](../validation/modes/vjf-enable.md) |
| **rules**    | The rules for the validation (if **DVR** mode is active). | [DVR](../validation/modes/dvr-enable.md) |
| **schema**    | The json-schema for the validation (if **SVK** mode is active). | [SVK](../validation/modes/svk-enable.md) |

## Usage

> You can mix all the objects you need

``` javascript
import Form from 'mobx-react-form';

... // define all needed objects

// using options and unified fields proprety
new Form({ options, fields, ... });

// using options and separated fields properties
new Form({ options, values, labels, ... });

// using validators with plugins and unified fields proprety
new Form({ options, plugins, fields });

// using validators with plugins and separated fields proprety
new Form({ options, plugins, values, labels, rules, ... });
```

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
