## Enabling VALIBOT schema validation

[valibot](https://github.com/fabian-hiller/valibot) is a TypeScript-first schema validation library with a tiny bundle size.

`valibot` is not included in the package, so you have to install it manually.

```bash
npm install --save valibot
```

#### Define the Valibot schema

```javascript
import * as v from 'valibot';

const $schema = v.object({
  email: v.pipe(v.string(), v.email()),
  age: v.pipe(v.number(), v.minValue(18)),
  user: v.object({
    zip: v.pipe(v.string(), v.minLength(5)),
  }),
});
```

#### Define a plugins object

VALIBOT does not need the `package` prop — pass the previously defined `schema` to the **VALIBOT** plugin:

```javascript
import valibot from 'mobx-formkit/lib/validators/VALIBOT';

const plugins = {
  valibot: valibot({
    schema: $schema,
  })
};
```

#### Create the form passing the `plugins` object

```javascript
new Form({ ... }, { plugins });
```

Errors are pushed per-field: nested paths like `user.zip` (and array paths like `members.0.name`) match the MRF field path automatically.

> **Note:** VALIBOT is **sync-only** through the plugin system. For custom and async rules, use Valibot's native `pipe`, `check`, `transform` and `custom()` on the schema directly. The `extend` callback is supported (`{ validator, form }`). TypeScript schemas type-check out of the box with TS ^5.