## Enabling JSON Schema Validation Keywords (AJV)

We are using [ajv](https://github.com/ajv-validator/ajv) to enable Schema Validation Keywords (**AJV**) with automatic Error Messages.

#### Install `ajv` Package
`ajv` is not included in the package, so you have to install it manually.

```bash
npm install --save ajv
```

#### Create the json schema

> See [json-schema.org](http://json-schema.org) for more info

```javascript
const $schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 }
  }
};
```

#### Define a plugins object

Pass the `ajv` package and the previously defined `schema` to the **AJV** plugin.

```javascript
import ajv from 'mobx-react-form/lib/validators/AJV';
import Ajv from 'ajv';

const plugins = {
  ajv: ajv({
    package: Ajv,
    schema: $schema,
    options: { ... }, // ajv options
  })
};
```

<details markdown="1">
<summary><strong>VERSION &lt; 1.37</strong></summary>

No need to import the plugin function:

```javascript
import Ajv from 'ajv';

const plugins = {
  ajv: Ajv
};
```

and the `schema` goes to the form initialization:

```javascript
new Form({ ..., schema }, { plugins });
```

</details>


<br />

> See here more info about [epoberezkin/ajv options](https://github.com/epoberezkin/ajv#options).

#### Create the form passing the `plugins` object

```javascript
new Form({ ... }, { plugins });
```

#### Default AJV options used by mobx-react-form

```javascript
{
  errorDataPath: 'property',
  allErrors: true,
  coerceTypes: true,
  v5: true,
}
```

## Remove AJV Warnings from webpack

Add this line to your webpack config in the `plugins` array:

```javascript
new webpack.IgnorePlugin(/regenerator|nodent|js\-beautify/, /ajv/)
```
