## Enabling JOI validator

`joi` is not included in the package, so you have to install it manually.

First of all install [joi](https://github.com/hapijs/joi) to enable the `JOI` plugin.

```bash
npm install --save joi
```

#### Define the JOI schema

```javascript
const $schema = j.object({
	products: j.array().items(
	  j.object({
        name: j.string().min(3).required(),
        qty: j.number().integer().min(0).required(),
        amount: j.number().min(0).required(),
      }).optional()
    )
  });

```

#### Define a plugins object

Pass the `JOI` package and the previously defined `schema` to the **JOI** plugin.

```javascript
import joi from 'mobx-react-form/lib/validators/JOI';
import j from 'joi';

const plugins = {
  joi: joi({
    package: j,
    schema: $schema,
    extend: ({ validator, form }) => {
      ... // access joi validator and form instances
    },
  })
};
```

#### Create the form passing the `plugins` object

```javascript
new Form({ ... }, { plugins });
```
