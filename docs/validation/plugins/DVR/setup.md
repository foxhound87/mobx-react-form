## Enabling Declarative Validation Rules (DVR)

We are using [validatorjs](https://github.com/mikeerickson/validatorjs) to enable Declarative Validation Rules (**DVR**) with automatic Error Messages.

#### Install `validatorjs` Package

`validatorjs` is not included in the package, so you have to install it manually.

```bash
npm install --save validatorjs
```

#### Define a plugins object

Pass the `validatorjs` package to the **DVR** plugin.

```javascript
import dvr from "mobx-react-form/lib/validators/DVR";
import validatorjs from "validatorjs";

const plugins = {
  dvr: dvr({ package: validatorjs }),
};
```

<details markdown="1">
<summary><strong>VERSION &lt; 6.9.0</strong></summary>

Shortcut:

```javascript
import dvr from "mobx-react-form/lib/validators/DVR";
import validatorjs from "validatorjs";

const plugins = {
  dvr: dvr(validatorjs),
};
```

</details>

<details markdown="1">
<summary><strong>VERSION &lt; 1.37</strong></summary>

No need to import the plugin function:

```javascript
import validatorjs from "validatorjs";

const plugins = {
  dvr: validatorjs,
};
```

</details>


#### Add the `rules` property to the form fields

> Check the [Available Rules](https://github.com/skaterdav85/validatorjs#available-rules)

```javascript
const fields = {
  username: {
    label: "Username",
    value: "SteveJobs",
    rules: "required|string|between:5,15",
  },
  email: {
    label: "Email",
    value: "s.jobs@apple.com",
    rules: "required|email|string|between:5,15",
  },
};
```

#### Create the form passing the `plugins` object

```javascript
new Form({ fields }, { plugins });
```
