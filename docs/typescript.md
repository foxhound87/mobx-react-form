# TypeScript Usage

mobx-react-form ships with first-class TypeScript support, providing type inference for form fields, autocomplete for field properties, and nested path autocomplete for the `$()` selector.

> TypeScript version `>= 4.1` is recommended for full support of recursive conditional types (`PathsOf`).

---

* [Typed Form Constructor](#typed-form-constructor)
* [FieldDefinition — Autocomplete for Field Props](#fielddefinition--autocomplete-for-field-props)
* [Available `FieldDefinition` Properties](#available-fielddefinition-properties)
* [Transparent Nested Path Autocomplete](#transparent-nested-path-autocomplete)
* [How `PathsOf` Works](#how-pathsof-works)
* [Explicit `PathsOf` Usage](#explicit-pathsof-usage)
* [Typed Values Output](#typed-values-output)
* [Extending Form & Field with Types](#extending-form--field-with-types)
* [FormInterface & FieldsDefinitions](#forminterface--fieldsdefinitions)
* [Third-Party Validation Plugin Types](#third-party-validation-plugin-types)

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

The generic propagates through all methods:
- `form.values()` — returns `{ [K in keyof F]?: F[K] }`
- `form.$('email')` — returns `Field<F['email']>` → `Field<string>`
- `form.errors()` — returns `{ [K in keyof F]?: any }`
- `form.get('value')` — retains type context

---

## FieldDefinition — Autocomplete for Field Props

When defining fields in unified mode, annotate with `Record<string, FieldDefinition>` for full autocomplete:

```typescript
import { Form } from 'mobx-react-form';
import type { FieldDefinition } from 'mobx-react-form';

const fields: Record<string, FieldDefinition> = {
  username: {
    label: 'Username',          // ← autocomplete
    value: 'SteveJobs',         // ← autocomplete
    rules: 'required|string|min:3',
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

---

## Available `FieldDefinition` Properties

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
| `fields` | `any` | Nested sub-field definitions |
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
| `input` | `Function` | Input converter |
| `output` | `Function` | Output converter |
| `converter` | `Function` | Value converter |
| `converters` | `Function[]` | Array of converter functions |
| `computed` | `any` | Computed value function |
| `observers` | `any[]` | MobX observers |
| `interceptors` | `any[]` | MobX interceptors |
| `name` | `string` | Field name (overrides key) |
| `class` | `any` | Custom Field class |

---

## Transparent Nested Path Autocomplete

The `$()` method on `Form<F>` is typed to accept **both top-level keys** (`keyof F`) and **nested paths** (`PathsOf<F>`) automatically:

```typescript
interface ClubForm {
  club: { name: string; city: string };
  members: { firstname: string; lastname: string }[];
}

const form = new Form<ClubForm>({ ... });

form.$('club');                  // ✓ autocomplete from keyof F
form.$('club.name');             // ✓ autocomplete after dot!
form.$('members[].firstname');   // ✓ array notation supported
form.$('club.unknown');          // ✗ TypeScript error — not a valid path
```

---

## How `PathsOf` Works

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

**How it works internally** (simplified from source):

```typescript
type PathsOf<T> = T extends (infer U)[]
  ? PathsOf<U>                                  // arrays: recurse into element type
  : T extends Date | File | Blob | RegExp       // skip non-plain objects
    ? never
    : T extends object
      ? { [K in keyof T & string]:
          T[K] extends (infer U)[]
            ? K | `${K}[].${PathsOf<U>}`        // array properties: add [] suffix
            : T[K] extends object
              ? K | `${K}.${PathsOf<T[K]>}`     // nested objects: add dot notation
              : K                                // primitive: just the key
        }[keyof T & string]
      : never;
```

It correctly excludes built-in types like `Date`, `File`, `Blob`, `RegExp`, `Map`, `Set`, and `Promise`.

---

## Explicit `PathsOf` Usage

```typescript
import { Form, PathsOf } from 'mobx-react-form';

// Helper with typed path
function getField<T extends Record<string, any>>(
  form: Form<T>,
  path: keyof T | PathsOf<T>
) {
  return form.$(path as any);
}

// Typed callback
form.each((field) => {
  if (field.path === 'email') {
    // field is typed as Field<any>
  }
});
```

---

## Typed Values Output

```typescript
const form = new Form<LoginForm>({ ... });
const vals = form.values();
//    ^? { email?: string; password?: string }
```

The `values()` method returns a partial object (all keys optional) typed from `F`.

> For flat map values (path → value), use `form.flatMapValues`:
> ```typescript
> form.flatMapValues; // Record<string, any>
> ```

---

## Extending Form & Field with Types

When extending classes, propagate the generic parameter for full type safety:

```typescript
import { Form, Field } from 'mobx-react-form';

interface MyFormValues {
  email: string;
  password: string;
}

class MyField extends Field {
  onChange = (e: any) => this.set(e.target.value);
}

class MyForm extends Form<MyFormValues> {
  makeField(props: any) {
    return new MyField(props);
  }

  hooks() {
    return {
      onSuccess() {
        console.log(this.values().email); // typed as string | undefined
      },
    };
  }
}

const form = new MyForm({ ... });
form.$('email'); // Field<string> — autocomplete works in IDE
```

---

## FormInterface & FieldsDefinitions

The library exports interfaces for advanced typing:

```typescript
import type {
  FormInterface,
  FieldsDefinitions,
  FormConfig,
} from 'mobx-react-form';

// FormInterface<F> — the full form contract
// FieldsDefinitions — the constructor shape (fields, values, labels, etc.)
// FormConfig — the second argument shape (options, plugins, bindings, hooks, etc.)
```

### FieldsDefinitions

The first argument to `new Form()` accepts `FieldsDefinitions`, which supports both unified and separated modes:

```typescript
interface FieldsDefinitions {
  fields?: any;                    // unified objects or separated array
  struct?: string[];               // alias for fields in separated mode
  values?: Record<string, any>;    // initial values
  labels?: Record<string, any>;    // field labels
  placeholders?: Record<string, any>;
  defaults?: Record<string, any>;
  initials?: Record<string, any>;
  types?: Record<string, any>;
  disabled?: Record<string, any>;
  deleted?: Record<string, any>;
  rules?: Record<string, any>;
  validators?: Record<string, any>;
  related?: Record<string, any>;
  options?: Record<string, any>;
  bindings?: Record<string, any>;
  extra?: Record<string, any>;
  hooks?: Record<string, any>;
  handlers?: Record<string, any>;
  computed?: Record<string, any>;
  input?: Record<string, any>;
  output?: Record<string, any>;
  converters?: Record<string, any>;
  autoFocus?: Record<string, any>;
  inputMode?: Record<string, any>;
  refs?: Record<string, any>;
  classes?: Record<string, any>;
  nullable?: Record<string, any>;
  autoComplete?: Record<string, any>;
}
```

### FormConfig

```typescript
interface FormConfig {
  name?: string;
  options?: OptionsModel;
  plugins?: ValidationPlugins;
  bindings?: Record<string, any>;
  hooks?: Record<string, any>;
  handlers?: Record<string, any>;
  extra?: Record<string, any>;
}
```

---

## Third-Party Validation Plugin Types

Each validation plugin can be typed for custom extend functions:

```typescript
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

// The extend callback receives typed arguments:
const plugins = {
  dvr: dvr({
    package: validatorjs,
    extend: ({ validator, form }) => {
      // validator: TValidator (the validatorjs instance)
      // form: FormInterface
      validator.register('customRule', ...);
    },
  }),
};
```

The plugin interfaces are:

```typescript
interface ValidationPluginConfig {
  extend?: (args: {
    validator: TValidator;
    form: FormInterface;
  }) => void;
}
```
