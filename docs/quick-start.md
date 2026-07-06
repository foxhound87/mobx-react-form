# Getting Started

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

const plugins = {
  dvr: dvr({ package: validatorjs }),
};
```

> See [Validation Plugins](validation/plugins.md) for all supported validators: **VJF** (vanilla functions), **DVR** (declarative rules), **SVK** (JSON Schema), **YUP**, **JOI**, **ZOD**.

---

## 2. Define the Fields

```javascript
const fields = [{
  name: 'email',
  label: 'Email',
  placeholder: 'Insert Email',
  rules: 'required|email|string|between:5,25',
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
}];
```

> Fields can also be defined as an **object** (unified mode) or via **separated props** — see [Defining Fields](fields/README.md).

---

## 3. Define Hooks

```javascript
const hooks = {
  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    console.log('Form Values!', form.values());
  },
  onError(form) {
    alert('Form has errors!');
    console.log('All form errors', form.errors());
  },
};
```

---

## 4. Create the Form

```javascript
import { Form } from 'mobx-react-form';

const form = new Form({ fields }, { plugins, hooks });
```

---

## 5. Use in a React Component

The form provides built-in Event Handlers: `onSubmit(e)`, `onClear(e)`, `onReset(e)` & [more](events/event-handlers.md).

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

> All field props are accessible via `form.$('fieldName')` — see [Field Properties](api-reference/fields-properties.md).

---

## What's Next?

| Topic | Link |
|-------|------|
| Class-based form definition | [Quick Start (class)](quick-start-class.md) |
| TypeScript usage | [TypeScript Guide](typescript.md) |
| Nested & array fields | [Defining Fields](fields/README.md) |
| Validation plugins deep-dive | [Validation](validation/README.md) |
| Live demo | [foxhound87.github.io/mobx-react-form-demo](https://foxhound87.github.io/mobx-react-form-demo) |

---

> 💡 **TypeScript** — The `Form` class accepts a generic for type-safe field access:
> ```typescript
> import { Form } from 'mobx-react-form';
>
> interface MyFields {
>   email: string;
>   password: string;
>   passwordConfirm: string;
> }
>
> const form = new Form<MyFields>({ fields }, { plugins, hooks });
> form.$('email').value; // typed as string
> ```
> See the [TypeScript Guide](typescript.md) for details.
