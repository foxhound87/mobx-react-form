## Form Initialization

###### Initialization

| Property | Description | Help |
|---|---|---|
| **plugins**   | Enable additional functionalities using external libraries. | [validation plugins](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#validation-plugins) |
| **options**   | Options used by the `form` or the imported `plugins` which may alter the validation behavior. | [form options](https://github.com/foxhound87/mobx-react-form/blob/master/DOCUMENTATION.md#form-options) |
| **fields**    | Object which represents the fields with all their properties. | [defining fields](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md) |

###### Field Properties

| Property | Description | Help |
|---|---|---|
| **values**    | Object which represents the `value`property for each field key - if you want to provide them separately from the `fields` object. | [defining values](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md#defining-values) |
| **labels**    | Object which represents the `label` property for each field key - if you want to provide them separately from the `fields` object. | [defining labels](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md#defining-labels) |
| **defaults**  | Object which represents the `default` property for each field key - if you want to provide them separately from the `fields` object. | [defining labels](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md#defining-labels) |
| **disabled**  | Object which represents the `disabled` property for each field key - if you want to provide them separately from the `fields` object. | [defining labels](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md#defining-disabled) |
| **related**  | Object which represents the `related` property to validate others fields at the same time for each field key - if you want to provide them separately from the `fields` object. | [defining related](https://github.com/foxhound87/mobx-react-form/blob/master/docs/DefiningFields.md#defining-related) |

###### Validation

| Property | Description | Help |
|---|---|---|
| **validate**  | The validation functions for the **VJF** mode. | [VJF](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingVJFValidation.md) |
| **rules**    | The rules for the validation (if **DVR** mode is active). | [DVR](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingDVRValidation.md) |
| **schema**    | The json-schema for the validation (if **SVK** mode is active). | [SVK](https://github.com/foxhound87/mobx-react-form/blob/master/docs/EnablingSVKValidation.md) |

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

> It takes the `form` in input.
