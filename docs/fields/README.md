# Defining Fields

Fields can be defined in two modes: **Unified Properties** (props grouped per field) or **Separated Properties** (props split across objects). Both modes support flat and nested fields.

---

## Quick Decision Guide

| Use Case | Recommended Mode |
|---|---|
| Simple forms, few fields, quick prototyping | **Unified** — all props in one place |
| Complex forms, many fields, reusable configs | **Separated** — props decoupled from structure |
| Server-provided values (e.g. DB query) | **Separated** — pass `values` directly |
| Dynamic arrays (add/remove fields) | **Separated** — struct array + separated props |
| Deeply nested objects | **Separated** — dot notation is clearer |
| TypeScript autocomplete on field props | **Unified** with `Record<string, FieldDefinition>` |

---

## Mode Comparison

| Aspect | Unified | Separated |
|---|---|---|
| **Structure** | `{ fields: { username: { label, value, rules, ... } } }` | `{ fields: ['username'], values: { ... }, labels: { ... }, rules: { ... } }` |
| **Pros** | Compact, self-contained, TS-friendly | Flexible, decoupled, easy to dynamically generate |
| **Cons** | Verbose for large forms, harder to dynamically build | More boilerplate for tiny forms |
| **When to use** | Small forms, prototyping, TypeScript | Large forms, dynamic fields, server data |
| **Nested fields** | `fields: [{ name, fields: [...] }]` | Dot notation `'parent.child'` + array notation `'arr[]'` |

---

## Available Props Reference

### Unified Mode
Each field is an object keyed by name. Available props per field:

| Prop | Type | Description |
|---|---|---|
| `value` | any | Initial value |
| `label` | string | Field label |
| `placeholder` | string | Placeholder text |
| `rules` | string | DVR validation rules (e.g. `'required|email'`) |
| `validators` | array | VJF validation functions |
| `type` | string | Field type, default `"text"` |
| `disabled` | boolean | Disabled state |
| `deleted` | boolean | Soft-deleted state (needs `softDelete` option) |
| `related` | string[] | Related field paths to validate together |
| `default` | any | Default value (used on `reset`) |
| `initial` | any | Initial value (fallback for `value`) |
| `bindings` | string | Binding template/rewriter key |
| `options` | object | Field-level options (same as Form Options) |
| `extra` | any | Extra metadata (useful for select options) |
| `hooks` | object | Event hooks (see Events) |
| `handlers` | object | Event handlers (see Events) |
| `input` | function | Input converter: `value => stored` |
| `output` | function | Output converter: `stored => output` |
| `converter` | function | Value converter (alias for input/output) |
| `converters` | function[] | Array of converter functions |
| `computed` | function | Computed value function `({ form, field }) => value` |
| `validatedWith` | string | Field prop to validate instead of `value` |
| `observers` | array | MobX observers |
| `interceptors` | array | MobX interceptors |
| `autoFocus` | boolean | Auto-focus on init |
| `inputMode` | string | Mobile keyboard mode |
| `ref` | any | React ref |
| `nullable` | boolean | Allow null values |
| `autoComplete` | string | HTML autocomplete attribute |
| `class` | any | Custom Field class |
| `fields` | array | Nested sub-field definitions |
| `name` | string | Overrides the object key as field name |

### Separated Mode
Props are split across parallel objects keyed by field name or path:

| Object Key | Type | Description |
|---|---|---|
| `fields` | string[] | Field structure (array of paths) |
| `values` | object | Initial values |
| `labels` | object | Labels |
| `placeholders` | object | Placeholders |
| `defaults` | object | Default values (on reset) |
| `initials` | object | Initial values (fallback for `values`) |
| `disabled` | object | Disabled states |
| `deleted` | object | Soft-deleted states |
| `types` | object | Field types |
| `related` | object | Related field paths |
| `rules` | object | DVR validation rules |
| `validators` | object | VJF validation functions |
| `bindings` | object | Binding keys |
| `extra` | object | Extra metadata |
| `options` | object | Field-level options |
| `hooks` | object | Event hooks |
| `handlers` | object | Event handlers |
| `validatedWith` | object | Validation prop overrides |
| `validators` | object | VJF functions |
| `observers` | object | MobX observers |
| `interceptors` | object | MobX interceptors |
| `input` | object | Input converter functions |
| `output` | object | Output converter functions |
| `converters` | object | Converter functions |
| `computed` | object | Computed value functions |
| `autoFocus` | object | Auto-focus flags |
| `inputMode` | object | Input modes |
| `refs` | object | React refs |
| `classes` | object | Custom Field classes |
| `nullable` | object | Nullable flags |
| `autoComplete` | object | Autocomplete attributes |

---

## Flat Fields

### Flat: Unified Mode

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    placeholder: 'Enter username',
    rules: 'required|string|between:5,15',
    type: 'text',
    disabled: false,
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
    rules: 'required|email',
  },
};

new Form({ fields });
```

> TypeScript tip: annotate with `Record<string, FieldDefinition>` for autocomplete:
> ```typescript
> const fields: Record<string, FieldDefinition> = { username: { label: '...' } };
> ```

**Shorthand:** you can also pass an array of objects with a `name` key:

```javascript
const fields = [
  { name: 'username', label: 'Username', value: 'SteveJobs' },
  { name: 'email', label: 'Email', value: 's.jobs@apple.com' },
];

new Form({ fields });
```

### Flat: Separated Mode

Define the field names as an array (or object), then provide props in parallel objects:

```javascript
const fields = ['username', 'email', 'password'];

const values = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
};

const labels = {
  username: 'Username',
  email: 'Email',
  password: 'Password',
};

const rules = {
  username: 'required|string|between:5,15',
  email: 'required|email',
  password: 'required|string|between:5,25',
};

new Form({ fields, values, labels, rules });
```

> Providing only `values` (without `fields` array) will implicitly create the fields:
> ```javascript
> new Form({ values: { username: 'SteveJobs' } }); // field 'username' auto-created
> ```

#### Validation in Separated Mode

```javascript
// DVR rules
const rules = {
  email: 'required|email',
  password: 'required|string|min:6',
};

// VJF functions
const validators = {
  email: isEmail,
  emailConfirm: [isEmail, shouldBeEqualTo('email')],
};

new Form({ fields, rules, validators, ... });
```

---

## Nested Fields

Nested fields allow grouping fields into objects and arrays. The syntax differs between modes.

### Nested: Unified Mode

Use the `fields` property inside a field definition to create nested sub-fields:

```javascript
const fields = [{
  name: 'address',
  label: 'Address',
  fields: [{
    name: 'street',
    label: 'Street',
    value: 'Broadway',
    default: '5th Avenue',
  }, {
    name: 'city',
    label: 'City',
    value: 'New York',
  }],
}];

new Form({ fields });
```

> The `name` property is required for each field when using array syntax.

**Arrays of nested fields:**

```javascript
const fields = [{
  name: 'members',
  label: 'Team Members',
  fields: [{
    name: 'firstname',
    label: 'First Name',
  }, {
    name: 'lastname',
    label: 'Last Name',
  }],
}];

new Form({ fields });

// Add a new member dynamically:
form.$('members').add({ firstname: 'John', lastname: 'Doe' });

// Or with explicit value wrapper (equivalent for simple fields):
form.$('hobbies').add({ value: 'Tennis' });
```

**Related fields across nesting levels:**

```javascript
const fields = [{
  name: 'user',
  fields: [{
    name: 'email',
    label: 'Email',
    validators: [isEmail],
    related: ['user.emailConfirm'], // reference by full path
  }, {
    name: 'emailConfirm',
    label: 'Confirm Email',
    validators: [isEmail, shouldBeEqualTo('email')],
  }],
}];
```

### Nested: Separated Mode

Define the structure using **dot notation** for nested objects and **`[]` notation** for arrays:

```javascript
const fields = [
  'club.name',
  'club.city',
  'members',
  'members[].firstname',
  'members[].lastname',
  'members[].hobbies',
  'members[].hobbies[]',
];

const values = {
  club: {
    name: 'Jazz Club',
    city: 'New York',
  },
  members: [{
    firstname: 'Clint',
    lastname: 'Eastwood',
    hobbies: ['Soccer', 'Baseball'],
  }, {
    firstname: 'Charlie',
    lastname: 'Chaplin',
    hobbies: ['Golf', 'Basket'],
  }],
};

const labels = {
  'club': 'Club',
  'club.name': 'Club Name',
  'club.city': 'Club City',
  'members': 'All Members',
  'members[].firstname': 'Member First Name',
  'members[].lastname': 'Member Last Name',
};

const rules = {
  'club.name': 'required|min:3',
  'club.city': 'required|min:3',
  'members[].firstname': 'required|min:3',
  'members[].lastname': 'required|min:3',
};

new Form({ fields, values, labels, rules });
```

> Dot notation keys reference field paths. Array notation `members[]` applies to every element in the array.

**Property values as nested objects** (alternative syntax):

```javascript
const labels = {
  club: {
    name: 'Club Name',
    city: 'Club City',
  },
  members: [{
    firstname: 'First Name',
    lastname: 'Last Name',
  }],
};
```

---

## Mixed Mode (Unified / Separated)

You can mix both modes in the same form definition. Props defined in the unified `fields` object take precedence over separated props.

```javascript
new Form({
  // Separated mode props
  values: {
    username: 'SteveJobs',
  },
  labels: {
    username: 'Username',
  },
  rules: {
    username: 'required|string',
  },
  // Unified mode override for specific fields
  fields: {
    username: {
      type: 'email', // overrides the default 'text' type
      disabled: false,
    },
  },
});
```

---

## Common Patterns

### Fields with Default & Initial Values

```javascript
const fields = {
  newsletter: {
    label: 'Subscribe',
    type: 'checkbox',
    value: true,    // initial value on mount
    default: false, // value after reset
  },
};
```

### Fields with Per-Field Options

Each field can override form-level options:

```javascript
const fields = {
  email: {
    label: 'Email',
    rules: 'required|email',
    options: {
      validateOnChange: true,       // validate on every keystroke
      validateOnBlur: false,        // skip blur validation
      showErrorsOnChange: true,     // show errors immediately
    },
  },
};
```

### Fields with Custom Bindings

```javascript
const fields = {
  username: {
    label: 'Username',
    bindings: 'MaterialTextField', // use a registered binding
  },
};
```

---

## Accessing Fields at Runtime

Once the form is created, access fields via `$()` or `select()`:

```javascript
form.$('username');              // flat field
form.$('address.city');          // nested field
form.$('members[0].firstname');  // array element by index
form.$('members').$(0).$('firstname'); // chained selector
```

> The `$()` method supports transparent autocomplete for both top-level and nested paths when using TypeScript with `Form<F>` (see [TypeScript Usage](../typescript.html)).
