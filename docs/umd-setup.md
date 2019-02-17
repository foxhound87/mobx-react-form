# UMD Setup

---

Import `mobx` and `mobx-react-form` into your html:

* Download [latest version of lodash](https://unpkg.com/lodash/lodash.min.js)
* Download [latest version of mobx](https://unpkg.com/mobx/lib/mobx.umd.js)
* Download [latest version of mobx-react-form](https://unpkg.com/mobx-react-form/umd/MobxReactForm.umd.min.js)
* Download a [Validation Plugin](validation/plugins.md)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>MobX React Form (UMD)</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <script src="https://unpkg.com/lodash@x.x.x/lodash.min.js"></script>
    <script src="https://unpkg.com/mobx@x.x.x/lib/mobx.umd.js"></script>
    <script src="https://unpkg.com/mobx-react-form@x.x.x/umd/MobxReactForm.umd.min.js"></script>
    <script src="https://unpkg.com/mobx-react-form@x.x.x/umd/MobxReactFormValidatorDVR.umd.min.js"></script>
    <script src="https://unpkg.com/validatorjs@x.x.x/dist/validator.js"></script>
    <script src="source.js"></script>
  </body>
</html>

```

Access the `MobxReactForm` from your source:

> source.js

```javascript
/* eslint no-console: 0 */
/* eslint no-undef: 0 */

console.log('lodash', _ && '>>> OK');
console.log('mobx', mobx && '>>> OK');
console.log('MobxReactForm', MobxReactForm && '>>> OK');
console.log('MobxReactFormValidatorDVR', MobxReactFormValidatorDVR && '>>> OK');
console.log('Validator', Validator && '>>> OK');

const { Form } = MobxReactForm;

const form = new Form({
  fields: {
    email: {
      label: 'Email',
      rules: 'required|email',
    },
  },
}, {
  name: 'UMD',
  options: {
    validateOnInit: true,
    showErrorsOnInit: true,
  },
  plugins: {
    dvr: MobxReactFormValidatorDVR({
      package: Validator
    })
  },
});

console.log('form.values()', form.values()); // { email: "" }
console.log('form.errors()', form.errors()); // { email: "The Email format is invalid." }
```
