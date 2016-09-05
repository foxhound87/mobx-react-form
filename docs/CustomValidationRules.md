## Custom Validation Rules

Using `ValidatorJS` as plugins, the **DVR** funcionalities will be enabled and can be extended too.

> See the AJV documentation: [Registering Custom Validation Rules](https://github.com/skaterdav85/validatorjs#registering-custom-validation-rules) for a deeper explaination

Below we see how to implement it in `mobx-react-form`:

### Define a `rules` object with the custom rules

```javascript
const rules = {
  telephone: {
    function: (value) => value.match(/^\d{3}-\d{3}-\d{4}$/),
    message: 'The :attribute phone number is not in the format XXX-XXX-XXXX.',
  },
};
```

### Implement the `extend` callback for the `plugins` object

```javascript
import validatorjs from 'validatorjs';

const plugins = {
  dvr: {
    package: validatorjs,
    extend: ($validator) => {
      // here we can access the `validatorjs` instance and we
      // can add the rules using `$validator.register()
      Object.keys(rules).forEach((key) =>
        $validator.register(key, rules[key].function, rules[key].message));
    };
  },
};

// create the form using extended plugins

new Form({ fields, plugins });

```

<br>

## Async Validation Rules

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

### Implement the `extend` callback using `registerAsyncRule()`

```javascript
...
extend: ($validator) => Object.keys(asyncRules)
  .forEach((key) => $validator.registerAsyncRule(key, asyncRules[key]));
...
```

> Read more about [Asynchronous Validation](https://github.com/skaterdav85/validatorjs#asynchronous-validation) on the official ValidatorJS documentation.
