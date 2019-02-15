## Enabling YUP Object Schema Validator

`jquense/yup` is not included in the package, so you have to install it manually.

First of all install [jquense/yup](https://github.com/jquense/yup) to enable the `YUP` plugin.

```bash
npm install --save yup
```

#### Define the YUP schema

Define a YUP schema using a function which takes in input the YUP instance and returns the schema:

```javascript
const $schema = (y) =>
  y.object().shape({
    club: y.string().required(),
    members: y.array().of(y.object().shape({
      firstname: y.string().required(),
      lastname: y.string().required(),
    })),
  });
```

#### Define a plugins object

Pass the `YUP` package and the previously defined `schema` to the **YUP** plugin.

```javascript
import yup from 'mobx-react-form/lib/validators/YUP';
import $pkg from 'yup';

const plugins = {
  yup: yup({
    package: $pkg,
    schema: $schema,
    extend: ({ validator, form }) => {
      ... // access yup validator and form instances
    },
  })
};
```

#### Create the form passing the `plugins` object

```javascript
new Form({ ... }, { plugins });
```
