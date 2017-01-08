## Enabling Json Schema Validation Keywords (SVK)

We are using epoberezkin's [AJV](https://github.com/epoberezkin/ajv) to enable Json Schema Validation Keywords (**SVK**) with automatic Error Messages.

## Install `AJV` Package
`ajv` it's not included in the package, so you have to install it manually.

```bash
npm install --save ajv
```

#### Define a plugins object

We use `ajv` as **SVK** plugin.

```javascript
import ajv from 'ajv';

const plugins = { svk: ajv };
```

#### Create the json schema

> See [json-schema.org](http://json-schema.org) for more info

```javascript
const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 }
  }
};
```

#### Create the form passing all the objects

```javascript
new Form({ schema, ... }, { plugins });
```

<br>

## Remove AJV Warnings from webpack

Add this line to your webpack config in the `plugins` array:

```javascript
new webpack.IgnorePlugin(/regenerator|nodent|js\-beautify/, /ajv/)
```
