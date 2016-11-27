# UMD Setup

---

Import `mobx` and `mobx-react-form` into your html:

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
    <script src="https://unpkg.com/mobx@2.6.0/lib/mobx.umd.js"></script>
    <script src="https://unpkg.com/mobx-react-form@1.15.0/umd/mobx-react-form.umd.min.js"></script>
    <script src="source.js"></script>
  </body>
</html>
```

Access the `MobxReactForm` from your source:

> source.js

```javascript
/* eslint no-console: 0 */
/* eslint no-undef: 0 */

const { Form } = MobxReactForm;

const form = new Form({
  fields: {
    email: 'test@test.com',
  },
});

form.update({ email: 'email@test.com' });

console.log('form.values()', form.values());
```
