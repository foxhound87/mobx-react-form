## Custom Json Schema Validation Keywords

Using `ajv` as plugins, the Json Schema Validation Keywords (**SVK**) funcionalities will be enabled and can be extended too.

> See the AJV documentation: [Defining Custom Keywords](https://github.com/epoberezkin/ajv/blob/master/CUSTOM.md) for a deeper explaination

Below we see how to implement it in `mobx-react-form`:

### Define a `keywords` object with the custom keyword

```javascript

const keywords = {
  /**
    Define a `range` keyword
  */
  range: {
    type: 'number',
    compile: (sch, parentSchema) => {
      const min = sch[0];
      const max = sch[1];

      return parentSchema.exclusiveRange === true
              ? (data) => (data > min && data < max)
              : (data) => (data >= min && data <= max);
    },
  },
};
```

### Implement the `extend` callback for the `plugins` object

```javascript
import ajv from 'ajv';

const plugins = {
  svk: {
    package: ajv,
    extend: ($ajv) => {
      // here we can access the `ajv` instance and we
      // can add the keywords of our object using `$ajv.addKeyword()`
      Object.keys(keywords).forEach((key) =>
        $ajv.addKeyword(key, keywords[key]));
    };
  },
};

// create the form using extended plugins

new Form({ fields, schema, plugins });

```

### Now you can use the new `keyword` in your json schemas

```javascript
var schema = {
  type: 'object',
  properties: {
    fieldname: {
      "range": [2, 4],
      "exclusiveRange": true,
    },
  },
};

```

<br>

## Async Validation Keywords

### Set `async:true` into the keyword object

```javascript
const extend = {
  keywords: {
    checkUser: {
      async: true, // <<---
      validate: (field, value) =>
        simulateAsyncFindUserCall({ [field]: value })
          .then((items) => (items.length === 0)),
    },
  },
};
```

### And set `$async:true` into the json-schema as well

```javascript
const schema = {
  $async: true, // <<---
  type: 'object',
  properties: {
    ...
  },
};
```

> Read more about [Asynchronous Validation](https://github.com/epoberezkin/ajv#asynchronous-validation) on the official AJV documentation.
