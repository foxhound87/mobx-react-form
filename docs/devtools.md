# MobX Formkit DevTools

DevTools for MobX Formkit — an in-app dock SDK and a browser extension
(Chrome / Firefox / Edge) to inspect form state, fields, and validation in
real time.

> The devtools are **opt-in**: they only activate on pages that import
> `mobx-formkit/devtools`.

---

## Prerequisite

Import the devtools hook **before** creating your forms (e.g. at the top of
your client entry):

```ts
import 'mobx-formkit/devtools';
```

---

## Install

```bash
npm install --save mobx-formkit-devtools
```

## Demo

[MobX Formkit DevTools Demo](https://foxhound87.github.io/mobx-formkit-demo/)

---

## Usage

```tsx
import DevTools from 'mobx-formkit-devtools/react';
import forms from './forms';

// register your forms ({ name: form })
DevTools.register(forms);

// select a form to show into the devtools (optional)
DevTools.select('login');

// open the devtools (closed by default)
DevTools.open(true);

function App() {
  return (
    <>
      {/* render the dock once, at the app root */}
      <DevTools.UI />
      {/* your app */}
    </>
  );
}
```

### API

- `DevTools.UI` — the dock component (render it once, at the app root).
- `DevTools.register(forms)` — register an object of forms (`{ name: form }`).
- `DevTools.select(key)` — select a form by key.
- `DevTools.open(flag)` — open/close the dock.
- `DevTools.Options` — the form-options component.
- `DevTools.theme({ … })` — override the color theme.

> The React SDK expects these **peer dependencies** (install them
> alongside): `react`, `react-dom`, `mobx` (`^6.12 || ^7`), `mobx-react`,
> and `mobx-formkit` (the legacy `mobx-react-form` name is also supported).

---

## Theme

```javascript
// custom theme colors
DevTools.theme({
  base00: '#2b303b',
  base01: '#343d46',
  base02: '#4f5b66',
  base03: '#65737e',
  base04: '#a7adba',
  base05: '#c0c5ce',
  base06: '#dfe1e8',
  base07: '#eff1f5',
  base08: '#bf616a',
  base09: '#d08770',
  base0A: '#ebcb8b',
  base0B: '#a3be8c',
  base0C: '#96b5b4',
  base0D: '#8fa1b3',
  base0E: '#b48ead',
  base0F: '#ab7967',
});
```

---

## Browser extension

The DevTools also ship as a browser extension (Chrome / Firefox / Edge).
See the [mobx-formkit-devtools](https://github.com/foxhound87/mobx-formkit-devtools)
repository for build and install instructions.
