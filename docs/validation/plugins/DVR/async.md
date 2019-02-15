## Async Delcarative Validation Rules (DVR)

### Create an `asyncRules` object

```javascript
const asyncRules = {
  checkUser: (value, attr, key, passes) => {
    const msg = `Hey! The username ${value} is already taken.`;
    // show error if the call does not returns entries
    simulateAsyncFindUserCall({ user: value })
      .then((items) => (items.length === 0) ? passes() : passes(false, msg));
  },
};
```

### Implement the `extend` callback using `registerAsync()`

```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

const plugins = {
  dvr: dvr({
    package: validatorjs,
    extend: ({ plugin }) => {
      // here we can access the `validatorjs` instance (plugin) and we
      // can add the rules using the `registerAsyncRule()` method.
      Object.keys(asyncRules).forEach((key) =>
        plugin.registerAsync(key, asyncRules[key]));
    };
  }),
};

// create the form using extended plugins
new Form({ ... }, { plugins });
```

> Read more about [Asynchronous Validation](https://github.com/skaterdav85/validatorjs#asynchronous-validation) on the official skaterdav85/validatorjs documentation.
