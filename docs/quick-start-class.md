# Getting Started (class)

## Install

```bash
npm install --save mobx-react-form
```

---

## 1. Choose a Validation Plugin

MobX React Form supports multiple validation plugins. Below we use **DVR** (Declarative Validation Rules) with `validatorjs`:

```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';
```

> See [Validation Plugins](validation/plugins.html) for all supported validators: **VJF** (vanilla functions), **DVR** (declarative rules), **SVK** (JSON Schema), **YUP**, **JOI**, **ZOD**.

---

## 2. Define the Form Class

Extend the `Form` class and use its lifecycle methods to configure plugins, fields, and hooks:

```javascript
import { Form } from 'mobx-react-form';
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

class MyForm extends Form {

  // Validation plugins
  plugins() {
    return {
      dvr: dvr({ package: validatorjs }),
    };
  }

  // Fields definition
  setup() {
    return {
      fields: [{
        name: 'email',
        label: 'Email',
        placeholder: 'Insert Email',
        rules: 'required|email|string|between:5,25',
        value: 's.jobs@apple.com',
      }, {
        name: 'password',
        label: 'Password',
        placeholder: 'Insert Password',
        rules: 'required|string|between:5,25',
      }, {
        name: 'passwordConfirm',
        label: 'Password Confirmation',
        placeholder: 'Confirm Password',
        rules: 'required|string|same:password',
      }],
    };
  }

  // Event hooks
  hooks() {
    return {
      onSuccess(form) {
        alert('Form is valid! Send the request here.');
        console.log('Form Values!', form.values());
      },
      onError(form) {
        alert('Form has errors!');
        console.log('All form errors', form.errors());
      },
    };
  }
}
```

> The `setup()` method replaces the first constructor argument. Similarly, `options()`, `plugins()`, `bindings()`, `hooks()`, and `handlers()` can be defined as class methods.

---

## 3. Create the Form

```javascript
const form = new MyForm();
```

---

## 4. Use in a React Component

The form provides built-in Event Handlers: `onSubmit(e)`, `onClear(e)`, `onReset(e)` & [more](events/event-handlers.html).

```jsx
import React from 'react';
import { observer } from 'mobx-react';

export default observer(({ form }) => (
  <form>
    <label htmlFor={form.$('email').id}>
      {form.$('email').label}
    </label>
    <input {...form.$('email').bind()} />
    <p>{form.$('email').error}</p>

    {/* ... other fields ... */}

    <button type="submit" onClick={form.onSubmit}>Submit</button>
    <button type="button" onClick={form.onClear}>Clear</button>
    <button type="button" onClick={form.onReset}>Reset</button>

    <p>{form.error}</p>
  </form>
));
```

> All field props are accessible via `form.$('fieldName')` — see [Field Properties](api-reference/fields-properties.html).

---

## What's Next?

| Topic | Link |
|-------|------|
| Simple (non-class) form definition | [Quick Start](quick-start.html) |
| TypeScript usage | [TypeScript Guide](typescript.html) |
| Nested & array fields | [Defining Fields](fields/README.html) |
| Validation plugins deep-dive | [Validation](validation/README.html) |
| Live demo | [foxhound87.github.io/mobx-react-form-demo](https://foxhound87.github.io/mobx-react-form-demo) |

---

> 💡 **TypeScript** — The `Form` class accepts a generic for type-safe field access:
> ```typescript
> class MyForm extends Form<{ email: string; password: string }> {
>   // ...
> }
>
> const form = new MyForm();
> form.$('email').value; // typed as string
> ```
> See the [TypeScript Guide](typescript.html) for details.
