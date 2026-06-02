# Form Initialization

The Form Constructor can take 2 arguments in input.

- [First Constructor Argument](#first-constructor-argument)
- [Second Constructor Argument](#second-constructor-argument)

- [Constructor Usage](#constructor-usage)
- [Initialization Methods](#initialization-methods)
- [Execute code on Form Init](../events/event-hooks.html#execute-code-on-instance-init)

---

## First Constructor Argument

The first argument represent the fields data with their props.

Provide an object which expects the following properties:

###### Fields Definition

| Property   | Description                                                                                                                                                                                                               | Help                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **struct** | Define fields structure as an array of strings representig the fields (dot notation ad array notation can be used)                                                                                                        | -                             |
| **fields** | Using **Unified Properties Definition** mode: an object which represents the fields with all their properties. Using **Separated Properties Definition** mode: an array of strings which represents the fields structure. | [defining fields](../fields/) |

###### Fields Properties

| Property          | Description                                                                                                                | Help                                                                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **values**        | Object which represents the `value`property for each field key.                                                            | [flat](../fields/#separated-mode) or [nested](../fields/#separated-mode-1)         |
| **computed**      | Object which represents the `computed` value for each field key.                                                           | [computed](../extra/computed-props.html)                                                                                                                                              |
| **labels**        | Object which represents the `label` property for each field key.                                                           | [flat](../fields/#separated-mode) or [nested](../fields/#separated-mode-1)       |
| **placeholders**  | Object which represents the `placeholder` property for each field key.                                                     | [flat](../fields/#separated-mode) or [nested](../fields/#separated-mode-1) |
| **initials**      | Initial values to apply on init if the value prop is not provided.                                                         | [flat](../fields/#separated-mode) or [nested](../fields/#separated-mode-1)     |
| **defaults**      | Object which represents the `default` property for each field key.                                                         | [flat](../fields/#separated-mode) or [nested](../fields/#separated-mode-1)     |
| **disabled**      | Object which represents the `disabled` property for each field key.                                                        | [flat](../fields/#separated-mode) or [nested](../fields/#separated-mode-1)     |
| **related**       | Object which represents the `related` property to validate others fields at the same time for each field key.              | [flat](../fields/#separated-mode) or [nested](../fields/#separated-mode-1)      |
| **options**       | Individual Field Options, with fallback on Form Options.                                                                   | [flat](../fields/#separated-mode) or [nested](../fields/#separated-mode-1)      |
| **extra**         | Additional extra data for the field (useful for a select input).                                                           | [flat](../fields/#separated-mode) or [nested](../fields/#separated-mode-1)        |
| **bindings**      | The name of the binding rewriter or template which will be used for the current field.                                     | [flat](../fields/#separated-mode) or [nested](../fields/#separated-mode-1)     |
| **observers**     | The mobx observers to listen on **Fields Props** or **Fields Map** changes.                                                | [help](../extra/mobx-events.html#using-observers--interceptors-objects)                                                                                                               |
| **interceptors**  | The mobx interceptors to listen on **Fields Props** or **Fields Map** changes.                                             | [help](../extra/mobx-events.html#using-observers--interceptors-objects)                                                                                                               |
| **validatedWith** | Specify a different **Field Prop** to use for the Field validation.                                                        | -                                                                                                                                                                                   |
| **autoFocus**     | Set this to `true` on the first field to be focused on form `initialization`                                               | -                                                                                                                                                                                   |
| **inputMode**     | Define the input mode of the field, accepted values: `none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url` | -                                                                                                                                                                                   |
| **nullable**      | Handle `null` field value.                                                                                                | -                                                                                                                                                                                   |
| **autoComplete**  | Define the `autocomplete` attribute for the field.                                                                        | -                                                                                                                                                                                   |
| **computed**      | Special field prop to handle computed values (defined as function).                                                        | [help](../extra/computed-props.html)                                                                                                                                                  |
| **converters**    | Array of converter functions for the field value.                                                                         | -                                                                                                                                                                                   |
| **classes**       | The classes used to instantiate the field. It must extend the mobx-react-form Field class                                  | [separated](../form/extend/configure.html#separated-definition) or [unified](../form/extend/configure.html#unified-definition)                                   |

###### Fields Event Hooks & Event Handlers

| Property     | Description                                                                                                                                                                                                                     | Help                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **hooks**    | An object with the Event Hooks functions. Availables Hooks: `onInit`, `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel`, `onKeyUp`, `onKeyDown` | [help](../events/event-hooks.html)    |
| **handlers** | An object with the Event Handlers functions: Availables Handlers: `onChange`, `onToggle`, `onFocus`, `onBlur`, `onDrop`, `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`, `onKeyUp`, `onKeyDown`                             | [help](../events/event-handlers.html) |

###### Validation Properties

| Property       | Description                                               | Help                                      |
| -------------- | --------------------------------------------------------- | ----------------------------------------- |
| **validators** | The validation functions for the **VJF** mode.            | [VJF](../validation/plugins/VJF/setup.html) |
| **rules**      | The rules for the validation (if **DVR** mode is active). | [DVR](../validation/plugins/DVR/setup.html) |

> Validate fields according to the choosen [validation plugin](https://foxhound87.github.io/mobx-react-form/docs/validation/plugins.html)

## Second Constructor Argument

The second argument represents the form plugins and options.

Provide an object which expects the following properties:

| Property     | Description                                                                                   | Help                                           |
| ------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **options**  | Options used by the `form` or the imported `plugins` which may alter the validation behavior. | [Form Options](form-options.html)                |
| **plugins**  | Enable additional functionalities using external libraries for validation.                    | [Validation Plugins](../validation/plugins.html) |
| **bindings** | Define how the fields properties are passed to the input components.                          | [Props Bindings](../bindings/)        |
| **extra**    | Inject extra objects to be accessed as `form.extra`                                            | -                                              |

###### Form Event Hooks & Event Handlers

| Property     | Description                                                                                                                                      | Help                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| **hooks**    | An object with the Event Hooks functions. Availables Hooks: `onInit`, `onSubmit`, `onSuccess`, `onError`, `onClear`, `onReset`, `onAdd`, `onDel` | [help](../events/event-hooks.html)    |
| **handlers** | An object with the Event Handlers functions. Availables Handlers: `onSubmit`, `onClear`, `onReset`, `onAdd`, `onDel`                             | [help](../events/event-handlers.html) |

<br>

## Constructor Usage

> You can mix all the objects you need

```javascript
import Form from 'mobx-react-form';

... // define all needed objects

// using unified fields properties definition
new Form({ fields });

// using validators with plugins, bindings and unified fields properties definition
new Form({ fields }, { plugins, bindings });

// using form options and separated fields properties definition
new Form({ values, labels, handlers, ... }, { options });

// using validators with plugins and separated fields properties definition
new Form({ values, labels, handlers, rules, ... }, { plugins });

// etc...
```

## Initialization Methods

#### setup(), options(), plugins(), bindings(), handlers(), hooks().

Normally you have to pass the fields properties to the constructor, otherwise you can implement one of these methods above inside your extended Form Class.

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

This can be done with `options`, `plugins`, `bindings`, `handlers` and `hooks` as well.

> The object returned from the methods will be merged to the object provieded to the constructor when initializing the instance.
