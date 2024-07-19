## Enabling Json Schema Validation Keywords (SVK)

We are using [ajv](https://github.com/ajv-validator/ajv) to enable Schema Validation Keywords (**SVK**) with automatic Error Messages.

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

Pass the `ajv` package and the previously defined `schema` to the **SVK** plugin.

```javascript
import svk from 'mobx-react-form/lib/validators/SVK';
import ajv from 'ajv';

const plugins = {
  svk: svk({
    package: ajv,
    schema: $schema,
    options: { ... }, // ajv options
  })
};
```

%accordion% **VERSION < 1.37** %accordion%

No need to import the plugin function:

```javascript
import ajv from 'ajv';

const plugins = {
  svk: ajv
};
```

and the `schema` goes to the form initialization:

```javascript
new Form({ ..., schema }, { plugins });
```

%/accordion%

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
