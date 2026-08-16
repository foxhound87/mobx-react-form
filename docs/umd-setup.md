# UMD Setup

---

Import `mobx` and `mobx-formikit` into your html:

* Download [latest version of lodash](https://unpkg.com/lodash/lodash.min.js)
* Download [latest version of mobx](https://unpkg.com/mobx/lib/mobx.umd.js)
* Download [latest version of mobx-formikit](https://unpkg.com/mobx-formikit/umd/MobxFormikit.umd.min.js)
* Download a [Validation Plugin](validation/plugins.md)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>MobX Formikit (UMD)</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <script src="https://unpkg.com/lodash@x.x.x/lodash.min.js"></script>
    <script src="https://unpkg.com/mobx@x.x.x/lib/mobx.umd.js"></script>
    <script src="https://unpkg.com/mobx-formikit@x.x.x/umd/MobxFormikit.umd.min.js"></script>
    <script src="https://unpkg.com/mobx-formikit@x.x.x/umd/MobxFormikitValidatorDVR.umd.min.js"></script>
    <script src="https://unpkg.com/validatorjs@x.x.x/dist/validator.js"></script>
    <script src="source.js"></script>
  </body>
</html>

```

Access the `MobxFormikit` from your source:

> source.js

```javascript
/* eslint no-console: 0 */
/* eslint no-undef: 0 */

console.log('lodash', _ && '>>> OK');
console.log('mobx', mobx && '>>> OK');
console.log('MobxFormikit', MobxFormikit && '>>> OK');
console.log('MobxFormikitValidatorDVR', MobxFormikitValidatorDVR && '>>> OK');
console.log('Validator', Validator && '>>> OK');

const { Form } = MobxFormikit;

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
    dvr: MobxFormikitValidatorDVR({
      package: Validator
    })
  },
});

console.log('form.values()', form.values()); // { email: "" }
console.log('form.errors()', form.errors()); // { email: "The Email format is invalid." }
```
