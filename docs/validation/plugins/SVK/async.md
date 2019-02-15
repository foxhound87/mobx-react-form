## Async Json Schema Validation Keywords (SVK)

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

> Read more about [Asynchronous Validation](https://github.com/epoberezkin/ajv#asynchronous-validation) on the official epoberezkin/ajv documentation.
