## Enabling ZOD TypeScript-first schema validation

`zod` is not included in the package, so you have to install it manually.

First of all install [zod](https://github.com/colinhacks/zod) to enable the `ZOD` plugin.

```bash
npm install --save zod
```

#### Define the ZOD schema

```javascript
const $schema = z.object({
	products: z.array(
		z.object({
			name: z.string().min(3),
			qty: z.number().min(0),
			amount: z.number().min(0),
		}))
		.optional(),
})
```

#### Define a plugins object

Pass the `ZOD` package and the previously defined `schema` to the **ZOD** plugin.

```javascript
import zod from 'mobx-react-form/lib/validators/ZOD';
import z from 'zod';

const plugins = {
  zod: zod({
    package: z,
    schema: $schema,
    extend: ({ validator, form }) => {
      ... // access zod validator and form instances
    },
  })
};
```

#### Create the form passing the `plugins` object

```javascript
new Form({ ... }, { plugins });
```
