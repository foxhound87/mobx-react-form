## Enabling VINEJS schema validation

[@vinejs/vine](https://github.com/vinejs/vine) is a schema validation library with synchronous rules and an async validation API.

`@vinejs/vine` is not included in the package, so you have to install it manually.

```bash
npm install --save @vinejs/vine
```

#### Define the VineJS schema

```javascript
import { Vine } from '@vinejs/vine';

const vine = new Vine();

const $schema = vine.object({
  email: vine.string().email(),
  age: vine.number().min(18),
  user: vine.object({
    zip: vine.string().minLength(5),
  }),
});
```

#### Define a plugins object

VINEJS requires the `package` prop (a Vine instance) together with the previously defined `schema`. The schema is compiled by the driver.

```javascript
import vinejs from 'mobx-formikit/lib/validators/VINEJS';

const plugins = {
  vinejs: vinejs({
    package: vine, // Vine instance
    schema: $schema,
  })
};
```

#### Create the form passing the `plugins` object

```javascript
new Form({ ... }, { plugins });
```

#### Async (promise-based) validation

VineJS `validate()` is async-by-design at the API level — even for synchronous rules. The driver consumes the mobx-formikit async contract (`setValidationAsyncData` + `promises`), so always await validation:

```javascript
await form.validate();
await form.submit();
```

Errors are matched per-path from VineJS `error.messages` (dot-notation paths like `user.zip`), so nested field errors land on the correct field automatically.

> **Note:** VINEJS supports the `extend` callback (`{ validator, form }`). For custom rules use VineJS `.rule()` / `.refine()` on the schema directly.