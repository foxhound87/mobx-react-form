# Forms Composer

Forms composer is an useful helper that can be used to manage a group of related `Froms` instances.
For example we have multiple forms and each of them is a part of a multi-step application.
With the `composer` you can execute some actions on all forms at same time.

#### How to use Composer

```javascript
import { composer } from 'mobx-react-form/lib/composer';

const forms = composer({
    formA: new FormA({ ...formDefinitionsA }),
    formB: new FormB({ ...formDefinitionsB }),
    formC: new FormC({ ...formDefinitionsC }),
});
```
> Each Form instance have to be a MobxReactForm instance.

#### Available Methods

| Method | Input | Output | Info | Help |
|---|---|---|---|---|
| **instances()** | - | object | Get the plain object with forms instances. | - |
| **select(key)** | string | Form | Select a form by object `key`. | - |
| **check(prop)** | string | object | Return an object with a boolean of the checked prop for each form. | - |
| **get(prop)** | string | object | Return an object with a value of the getted prop for each form. | - |
| **valid()** | - | boolean | Check if all forms are valid. | - |
| **error()** | - | boolean | Check if all forms has errors. | - |
| **clear({ deep, execHook })** | - | void | Clear all forms. | - |
| **reset({ deep, execHook })** | - | void | Reset all forms. | - |
| **validate()** | - | Promise | Validate all forms. | - |
| **validate({ showErrors })** | - | Promise | Validate all forms (with options). | - |
| **submit()** | - | Promise | Submit all forms. | - |
| **submit({ validate, execOnSubmitHook, execValidationHooks })** | - | Promise | Submit all forms (with options). | - |

> The Promises resolves an object with the forms status and the composer functions