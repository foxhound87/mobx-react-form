## Custom Declarative Validation Rules (DVR)

Using `skaterdav85/validatorjs` as plugin, the Declarative Validation Rules (**DVR**) funcionalities will be enabled and can be extended too.

> See the skaterdav85/validatorjs documentation: [Registering Custom Validation Rules](https://github.com/skaterdav85/validatorjs#registering-custom-validation-rules) for a deeper explaination

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

The `extend` function takes in input an object with the following props:

* the `form` instance
* the `validator` instance

```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

const plugins = {
  dvr: dvr({
    package: validatorjs,
    extend: ({ validator, form }) => {
      // here we can access the `validatorjs` instance (validator)
      // and we can add the rules using the `register()` method.
      Object.keys(rules).forEach((key) =>
        validator.register(key, rules[key].function, rules[key].message));
    };
  }),
};

// create the form using the extended `plugins` object
new Form({ ... }, { plugins });
```

%accordion% **VERSION < 1.37** %accordion%

No need to import the plugin function:

```javascript
import validatorjs from 'validatorjs';

const plugins = {
  dvr: {
    package: validatorjs,
    extend: () => { ... },
  },
};

```

%/accordion%
