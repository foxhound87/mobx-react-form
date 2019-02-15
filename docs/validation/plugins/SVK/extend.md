## Custom Json Schema Validation Keywords (SVK)

Using `epoberezkin/ajv` as plugin, the Schema Validation Keywords (**SVK**) funcionalities will be enabled and can be extended too.

> See the epoberezkin/ajv documentation: [Defining Custom Keywords](https://github.com/epoberezkin/ajv/blob/master/CUSTOM.md) for a deeper explaination

Below we see how to implement it in `mobx-react-form`:

#### Define a keywords object with the custom keyword

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

#### Define a JSON schema using the new keyword

```javascript
var $schema = {
  type: 'object',
  properties: {
    fieldname: {
      "range": [2, 4],
      "exclusiveRange": true,
    },
  },
};
```

#### Implement the `extend` callback for the `plugins` object

The `extend` function takes in input an object with the following props:

* the `form` instance
* the `validator` instance

```javascript
import svk from 'mobx-react-form/lib/validators/SVK';
import ajv from 'ajv';

const plugins = {
  svk: svk({
    package: ajv,
    schema: $schema,
    options: { ... }, // ajv options
    extend: ({ validator, form }) => {
      // here we can access the `ajv` instance (validator) and we can
      // add the keywords of our object using the `addKeyword()` method.
      Object.keys(keywords).forEach((key) =>
        validator.addKeyword(key, keywords[key]));
    };
  }),
};

// create the form using extended plugins

new Form({ fields }, { plugins });
```

%accordion% **VERSION < 1.37** %accordion%

No need to import the plugin function:

```javascript
import ajv from 'ajv';

const plugins = {
  svk: {
    package: ajv,
    extend: () => { ... },
  },
};
```

and the `schema` goes to the form initialization:

```javascript
new Form({ ..., schema }, { plugins });
```

%/accordion%

<br />

> See here more info about [epoberezkin/ajv options](https://github.com/epoberezkin/ajv#options).

#### Additional Options

| Option | Type | Default | Info |
|---|---|---|---|
| **allowRequired** | boolean | false | The json-schema `required` property can work only if the object does not contain the field key/value pair, `allowRequired` can remove it when needed to make `required` work properly. Be careful because enabling it will make `minLength` uneffective when the `string` is `empty`. |
