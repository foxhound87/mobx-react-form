# MobX React Form DevTools

---

## Install

```bash
npm install --save mobx-react-form-devtools
```

## Usage

```javascript
import MobxReactFormDevTools from 'mobx-react-form-devtools';
import 'mobx-react-form-devtools/style/devtools.css';

// register forms
MobxReactFormDevTools.register({
  loginForm,
  registerForm,
  supportForm,
});

// select form to show into the devtools
MobxReactFormDevTools.select('registerForm');
```

## Screenshot

![DevTools](https://github.com/foxhound87/mobx-react-form-devtools/blob/master/screenshot.png?raw=true)
