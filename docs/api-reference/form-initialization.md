# Form Initialization

The Form Constructor can take 2 arguments in input.

## First Argument

The first argument is an object which expects the following properties:

###### Fields Definition
| Property | Description | Help |
|---|---|---|
| **fields**    | Using **Unified Properties** mode: an object which represents the fields with all their properties. Using **Separated Properties** mode: an array which represents the fields structure. | [defining fields](../defining-fields.md) |

###### Fields Properties
| Property | Description | Help |
|---|---|---|
| **values**    | Object which represents the `value`property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-values) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-values) |
| **labels**    | Object which represents the `label` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-labels) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **placeholders**    | Object which represents the `placeholder` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-placeholders) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **defaults**  | Object which represents the `default` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-defaults) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **disabled**  | Object which represents the `disabled` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-disabled) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **related**  | Object which represents the `related` property to validate others fields at the same time for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-related) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **options**  | Additional options data for the field (useful for a select input). | [flat](../defining-flat-fields/separated-properties.md#defining-related) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |


###### Validation Properties
| Property | Description | Help |
|---|---|---|
| **validate**  | The validation functions for the **VJF** mode. | [VJF](../validation/modes/vjf-enable.md) |
| **rules**    | The rules for the validation (if **DVR** mode is active). | [DVR](../validation/modes/dvr-enable.md) |
| **schema**    | The json-schema for the validation (if **SVK** mode is active). | [SVK](../validation/modes/svk-enable.md) |


> Some of these initialization properties are plurals.

> If you need to validate fields use the `validate`, `rules`, or `schema` props according to the choosen [validation plugin](https://foxhound87.github.io/mobx-react-form/docs/validation/plugins.html)

> If you are using the **Unified Properties** mode, you will need only the `fields` property.

> If you are using the **Separated Properties** mode, the `fields` property should be defined as structure.

## Second Argument

The second argument is an object which expects the following properties:

| Property | Description | Help |
|---|---|---|
| **options**   | Options used by the `form` or the imported `plugins` which may alter the validation behavior. | [Form Options](form-options.md) |
| **plugins**   | Enable additional functionalities using external libraries. | [Validation Plugins](../validation/plugins.md) |
| **bindings**   | Define how the fields properties are passed the input components. | [Props Bindings](../bindings/README.md) |

<br>

## Usage

> You can mix all the objects you need

``` javascript
import Form from 'mobx-react-form';

... // define all needed objects

// using unified fields properties
new Form({ fields, ... });

// using form options and separated fields properties
new Form({ values, labels, options, ... }, { options });

// using validators with plugins, bindings and unified fields properties
new Form({ fields }, { plugins, bindings });

// using validators with plugins and separated fields properties
new Form({ values, labels, rules, ... }, { plugins });
```

## Initialization Methods
#### setup(), options(), plugins(), bindings().

Normally you have to pass the the initialization properties to the constructor, or you can implement the one of these methods inside your extended form class which will return the object of all properties.

For example, using the `setup()` method you can initialize the fields properties:

```javascript
import Form from 'mobx-react-form';

class MyForm extends MobxReactForm {

  setup() {
    // same of: new MyForm({ fields, values, labels,  ... });
    return { fields, values, labels, ... };
  }
}
```

This can be done with `options`, `plugins` and `bindings` as well.

> The object returned from the methods will be deep-merged to the object provieded to the constructor when initializing the instance.


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
