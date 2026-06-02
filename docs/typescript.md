# TypeScript Usage

mobx-react-form ships with first-class TypeScript support, providing type inference for form fields, autocomplete for field properties, and nested path autocomplete for the `$()` selector.

> TypeScript version `>= 4.1` is recommended for full support of recursive conditional types (`PathsOf`).

---

## Typed Form Constructor

Use the generic type parameter `F` on `Form<F>` to describe the shape of your form values:

```typescript
import { Form } from 'mobx-react-form';

interface LoginForm {
  email: string;
  password: string;
}

const form = new Form<LoginForm>({ ... });
// form.values() returns { email?: string; password?: string }
// form.$('email') returns Field<string>
```

---

## FieldDefinition — Autocomplete for Field Props

When defining fields in unified mode, annotate the object with `Record<string, FieldDefinition>` to get full autocomplete on every field property:

```typescript
import { Form } from 'mobx-react-form';
import type { FieldDefinition } from 'mobx-react-form';

const fields: Record<string, FieldDefinition> = {
  username: {
    label: 'Username',     // ← autocomplete on label
    value: 'SteveJobs',    // ← autocomplete on value
    rules: 'required|string|between:5,15',  // ← autocomplete on rules
    placeholder: 'Enter username',
    disabled: false,
    type: 'text',
    autoFocus: true,
    nullable: false,
    autoComplete: 'username',
    related: ['email'],
  },
};

const form = new Form({ fields }, { name: 'MyForm' });
```

### Available `FieldDefinition` Properties

| Property | Type | Description |
|---|---|---|
| `value` | `any` | Field value |
| `label` | `string` | Field label |
| `placeholder` | `string` | Field placeholder |
| `rules` | `string` | Validation rules (DVR format) |
| `type` | `string` | Field type (default: `"text"`) |
| `disabled` | `boolean` | Disabled state |
| `related` | `string[]` | Related field paths |
| `default` | `any` | Default value (on reset) |
| `initial` | `any` | Initial value |
| `bindings` | `string` | Binding name |
| `extra` | `Record<string, any>` | Extra metadata |
| `options` | `OptionsModel` | Field-level options |
| `hooks` | `Record<string, any>` | Event hooks |
| `handlers` | `Record<string, any>` | Event handlers |
| `validators` | `any[]` | VJF validation functions |
| `validatedWith` | `string` | Prop to validate instead of `value` |
| `ref` | `any` | React ref |
| `nullable` | `boolean` | Allow null values |
| `autoFocus` | `boolean` | Auto-focus on mount |
| `inputMode` | `string` | Mobile keyboard mode |
| `autoComplete` | `string` | HTML autocomplete attribute |
| `converter` | `Function` | Value converter function |
| `converters` | `Function[]` | Array of converter functions |
| `computed` | `any` | Computed value function |
| `observers` | `any[]` | MobX observers |
| `interceptors` | `any[]` | MobX interceptors |
| `name` | `string` | Field name (overrides key) |
| `class` | `any` | Custom Field class |
| `fields` | `any` | Nested sub-field definitions |

---

## Transparent Nested Path Autocomplete

The `$()` method on `Form<F>` is typed to accept **both top-level keys** (`keyof F`) and **nested paths** (`PathsOf<F>`) automatically — no explicit type annotations needed:

```typescript
interface ClubForm {
  club: { name: string; city: string };
  members: { firstname: string; lastname: string }[];
}

const form = new Form<ClubForm>({ ... });

form.$('club');             // ✓ autocomplete from keyof F
form.$('club.name');        // ✓ autocomplete after dot!
form.$('members[].firstname'); // ✓ array notation supported
form.$('club.unknown');     // ✗ TypeScript error — not a valid path
```

### How It Works

The `PathsOf<T>` utility type recursively derives all possible field paths from a type `T`:

```typescript
import { PathsOf } from 'mobx-react-form';

type ClubForm = {
  club: { name: string; city: string };
  members: { firstname: string; lastname: string }[];
};

// PathsOf<ClubForm> = "club" | "members"
//   | "club.name" | "club.city"
//   | "members[].firstname" | "members[].lastname"
```

> `PathsOf` is integrated directly into the `$()` method signature — you don't need to import it for autocomplete to work.

---

## Explicit PathsOf Usage

You can also use `PathsOf` explicitly in helper functions or components:

```typescript
import { Form, PathsOf } from 'mobx-react-form';
import type { FieldDefinition } from 'mobx-react-form';

// Helper function with typed path
function getField<T extends Record<string, any>>(
  form: Form<T>,
  path: keyof T | PathsOf<T>
) {
  return form.$(path as any);
}

// Typed callback for each()
form.each((field) => {
  if (field.path === 'email') {
    // field is typed as Field<any>
  }
});
```

---

## Extending Form & Field with Types

When extending classes, propagate the generic parameter:

```typescript
import { Form, Field } from 'mobx-react-form';

interface MyFormValues {
  email: string;
  password: string;
}

class MyField extends Field {
  // custom methods...
}

class MyForm extends Form<MyFormValues> {
  makeField(props: any) {
    return new MyField(props);
  }
}

const form = new MyForm({ ... });
form.$('email'); // autocomplete works!
```

---

## Typed `values()` Output

The `values()` method returns a partial object typed from the generic `F` parameter:

```typescript
const form = new Form<LoginForm>({ ... });
const vals = form.values();
//    ^? { email?: string; password?: string }
```

> Nested object keys are flattened. For flat map values (path → value), use `form.flatMapValues`.
