# MobX Ajv Form

##### Easly manage Forms with MobX and automatic validation with AJV json-schema rules.

---

## TODO:

- Add new features
- Add documentation
- Add examples
- Add unit tests

## Install

```bash
npm i --save mobx-ajv-form
```

## Usage

```
// define a json schema
const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
  },
};

// define fields
const fields = {
  username: {
    value: 'SteveJobs',
    label: 'Username',
  },
  email: {
    value: 's.jobs@apple.com',
    label: 'Email',
  },
  password: {
    value: 'thinkdifferent',
    label: 'Password',
  },
};

// create the form
this.forms.register = new Form(fields, schema);
```

Pass the form to a react component:

````
<TextField
  name={form.fields.username.name}
  value={form.fields.username.value}
  hintText={form.fields.username.label}
  floatingLabelText={form.fields.username.label}
  errorText={form.fields.username.errorMessage}
  onChange={form.syncValue}
/>
````

Deal with events:

```
registerOrShowError() {
  const form = this.forms.register;
  if (!form.validate()) return;

  dispatch('auth.register', form.values())
    .then(() => dispatch('ui.authModal.toggleSection', 'signin'))
    .then(() => dispatch('ui.snackBar.open', 'Register Successful.'))
    .then(() => form.clear())
    .catch(() => form.invalidate('The user already exist.'));
}
```
