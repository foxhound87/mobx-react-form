# Form Initialization

The Form Constructor can take 2 arguments in input.

* [First Constructor Argument](#first-constructor-argument)
* [Second Constructor Argument](#second-constructor-argument)


* [Constructor Usage](#constructor-usage)
* [Initialization Methods](#initialization-methods)
* [Execute code on Form Init](#execute-code-on-form-init)

---

## First Constructor Argument

The first argument represent the fields data with their props.

Provide an object which expects the following properties:

###### Fields Definition
| Property | Description | Help |
|---|---|---|
| **fields**    | Using **Unified Properties Definition** mode: an object which represents the fields with all their properties. Using **Separated Properties Definition** mode: an array which represents the fields structure. | [defining fields](../defining-fields.md) |

###### Fields Properties
| Property | Description | Help |
|---|---|---|
| **values**    | Object which represents the `value`property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-values) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-values) |
| **labels**    | Object which represents the `label` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-labels) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **placeholders**    | Object which represents the `placeholder` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-placeholders) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **initials**  | Initial values to apply on init if the value prop is not provided. | [flat](../defining-flat-fields/separated-properties.md#defining-initials) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **defaults**  | Object which represents the `default` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-defaults) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **disabled**  | Object which represents the `disabled` property for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-disabled) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **related**  | Object which represents the `related` property to validate others fields at the same time for each field key. | [flat](../defining-flat-fields/separated-properties.md#defining-related) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **options**  | Additional options data for the field (useful for a select input). | [flat](../defining-flat-fields/separated-properties.md#defining-options) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **bindings**  | The name of the binding rewriter or template which will be used for the current field. | [flat](../defining-flat-fields/separated-properties.md#defining-bindings) or [nested](../defining-nested-fields/separated-properties.md#defining-nested-property) |
| **observers**  | The mobx observers to listen on **Fields Props** or **Fields Map** changes. | [help](../events/mobx-events.md#using-observers--interceptors-objects) |
| **interceptors**  | The mobx interceptors to listen on **Fields Props** or **Fields Map** changes. | [help](../events/mobx-events.md#using-observers--interceptors-objects) |


###### Validation Properties
| Property | Description | Help |
|---|---|---|
| **validate**  | The validation functions for the **VJF** mode. | [VJF](../validation/modes/vjf-enable.md) |
| **rules**    | The rules for the validation (if **DVR** mode is active). | [DVR](../validation/modes/dvr-enable.md) |
| **schema**    | The json-schema for the validation (if **SVK** mode is active). | [SVK](../validation/modes/svk-enable.md) |


> Some of these initialization properties are plurals.

> If you need to validate fields use the `validate`, `rules`, or `schema` props according to the choosen [validation plugin](https://foxhound87.github.io/mobx-react-form/docs/validation/plugins.html)

> If you are using the **Unified Properties Definition** mode, you will need only the `fields` property.

> If you are using the **Separated Properties Definition** mode, the `fields` property should be defined as structure.

## Second Constructor Argument

The second argument represents the form plugins and options.

Provide an object which expects the following properties:

| Property | Description | Help |
|---|---|---|
| **options**   | Options used by the `form` or the imported `plugins` which may alter the validation behavior. | [Form Options](form-options.md) |
| **plugins**   | Enable additional functionalities using external libraries. | [Validation Plugins](../validation/plugins.md) |
| **bindings**   | Define how the fields properties are passed to the input components. | [Props Bindings](../bindings/README.md) |

<br>

## Constructor Usage

> You can mix all the objects you need

``` javascript
import Form from 'mobx-react-form';

... // define all needed objects

// using unified fields properties definition
new Form({ fields });

// using validators with plugins, bindings and unified fields properties definition
new Form({ fields }, { plugins, bindings });

// using form options and separated fields properties definition
new Form({ values, labels, ... }, { options });

// using validators with plugins and separated fields properties definition
new Form({ values, labels, rules, ... }, { plugins });
```

## Initialization Methods
#### setup(), options(), plugins(), bindings().

Normally you have to pass the the fields properties to the constructor, otherwise you can implement one of these methods inside your extended Form Class.

For example, using the `setup()` method you can define the fields properties:

```javascript
import Form from 'mobx-react-form';

class MyForm extends MobxReactForm {

  setup() {
    // same of: new MyForm({ fields, values, labels,  ... });
    return { fields, values, labels, ... };
  }
}
```

> The methods have to return an object with all needed props/data.

This can be done with `options`, `plugins` and `bindings` as well.

> The object returned from the methods will be merged to the object provieded to the constructor when initializing the instance.


## Execute code on Form Init

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

[See Other Form Events](/docs/events)
