## Enabling Declarative Validation Rules (DVR)

We are using [skaterdav85/validatorjs](https://github.com/skaterdav85/validatorjs) to enable Declarative Validation Rules (**DVR**) with automatic Error Messages.

#### Install `skaterdav85/validatorjs` Package
`skaterdav85/validatorjs` is not included in the package, so you have to install it manually.

```bash
npm install --save validatorjs
```

#### Define a plugins object

Pass the `validatorjs` package to the **DVR** plugin.

```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

const plugins = {
  dvr: dvr({ package: validatorjs })
};
```

%accordion% **VERSION < 6.9.0** %accordion%

Shortcut:

```javascript

import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

const plugins = {
  dvr: dvr(validatorjs)
};
```

%accordion% **VERSION < 1.37** %accordion%

No need to import the plugin function:

```javascript
import validatorjs from 'validatorjs';

const plugins = {
  dvr: validatorjs
};
```

%/accordion%


#### Add the `rules` property to the form fields

> Check the [Available Rules](https://github.com/skaterdav85/validatorjs#available-rules)

```javascript
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    rules: 'required|string|between:5,15',
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
    rules: 'required|email|string|between:5,15',
  },
};
```

#### Create the form passing the `plugins` object

```javascript
new Form({ fields }, { plugins });
```
