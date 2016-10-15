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

### Implement the `extend` callback using `registerAsyncRule()`

```javascript
...
extend: ($validator) => Object.keys(asyncRules)
  .forEach((key) => $validator.registerAsyncRule(key, asyncRules[key]));
...
```

> Read more about [Asynchronous Validation](https://github.com/skaterdav85/validatorjs#asynchronous-validation) on the official ValidatorJS documentation.
