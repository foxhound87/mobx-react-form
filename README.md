# MobX Formkit

**Reactive MobX Form State Management** — extensible validation, nested fields, event hooks, and bindings for any UI framework, with full TypeScript support.

[Documentation](https://foxhound87.github.io/mobx-formkit/) &bull; [Quick Start](https://foxhound87.github.io/mobx-formkit/quick-start) &bull; [Live Demo](https://foxhound87.github.io/mobx-formkit-demo) &bull; [Demo Code](https://github.com/foxhound87/mobx-formkit-demo) &bull; [NPM](https://www.npmjs.com/package/mobx-formkit) &bull; [AI Skills](https://github.com/foxhound87/skills) &bull; [Discord](https://discord.gg/CVV8w4zat4)

[![npm version](https://img.shields.io/npm/v/mobx-formkit?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/mobx-formkit)
[![npm downloads](https://img.shields.io/npm/dm/mobx-formkit?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/mobx-formkit)
[![license](https://img.shields.io/github/license/foxhound87/mobx-formkit?style=for-the-badge)](https://github.com/foxhound87/mobx-formkit/blob/master/LICENSE)
[![bundle size](https://img.shields.io/badge/bundle%20size-~8%20kB%20gzip-e11d48?style=for-the-badge)](https://foxhound87.github.io/mobx-formkit/performance-ssr)
[![documentation](https://img.shields.io/badge/docs-mobx--formkit-e11d48?style=for-the-badge)](https://foxhound87.github.io/mobx-formkit/)

MobX Formkit is a form state management library built on MobX observables. The core is UI-agnostic — it depends only on `mobx` and renders in React, Vue 3, Lit, Angular, Solid, or vanilla JS through the matching MobX binding. Define your fields declaratively and get reactivity, validation, change tracking, and component bindings automatically.

Read the [full documentation](https://foxhound87.github.io/mobx-formkit/) or jump straight to the [Quick Start](https://foxhound87.github.io/mobx-formkit/quick-start).

## Features

- **8 Validation Plugins** — [DVR, VJF, AJV, YUP, JOI, ZOD, VALIBOT & VINEJS](https://foxhound87.github.io/mobx-formkit/validation/plugins): sync & async, extendable, and mixable on the same form.
- **Nested Fields & Arrays** — deeply nested [field structures](https://foxhound87.github.io/mobx-formkit/fields/) with dot notation, dynamic add/remove/move, ordered `ArrayMap` collections, and full serialization.
- **Event Hooks & Handlers** — full lifecycle control: `onInit`, `onChange`, `onFocus`, `onBlur`, `onSubmit`, `onSuccess`, `onError` & [more](https://foxhound87.github.io/mobx-formkit/events/).
- **UI-Agnostic Core** — the same `Form` instance renders in [React, Vue 3, Lit, Angular, Solid, Octane, or vanilla JS](https://foxhound87.github.io/mobx-formkit/frameworks) with a MobX binding.
- **Field Props Bindings** — one-line [`bind()`](https://foxhound87.github.io/mobx-formkit/bindings/) for standard inputs, plus custom rewriters & templates for Material UI, Ant Design, React Aria, Headless UI, React Widgets, React Select, Chakra UI, PrimeReact & more.
- **TypeScript First** — generics (`Form<F>`), typed field access, and [autocomplete for nested field paths](https://foxhound87.github.io/mobx-formkit/typescript).
- **Reactive Computed Props** — [functional field props](https://foxhound87.github.io/mobx-formkit/extra/computed-props) that re-evaluate automatically when their MobX dependencies change.
- **Forms Composer** — [orchestrate multiple forms](https://foxhound87.github.io/mobx-formkit/extra/composer) for wizards and multi-step flows with batch validate/submit/clear.
- **Tiny & SSR-Ready** — ~8 kB gzip, tree-shakeable, zero DOM dependencies; works with Next.js, Remix, Vite & any [SSR setup](https://foxhound87.github.io/mobx-formkit/performance-ssr).
- **MobX 5, 6 & 7** — one peer dependency range: `^5.15.0 || ^6.0.0 || ^7.0.0`.
- **DevTools** — a dedicated [DevTools package & browser extension](https://foxhound87.github.io/mobx-formkit/devtools) to inspect form state, fields, and validation in real time.
- **AI Agent Skills** — installable [skill files](https://foxhound87.github.io/mobx-formkit/skills) for Cursor, Windsurf, Claude Code, Codebuff & Copilot.

## Quick Example

```bash
npm install --save mobx-formkit
```

```javascript
import { Form } from "mobx-formkit";
import dvr from "mobx-formkit/lib/validators/DVR";
import validatorjs from "validatorjs";

const plugins = {
  dvr: dvr({ package: validatorjs }),
};

const fields = [
  {
    name: "email",
    label: "Email",
    placeholder: "Insert Email",
    rules: "required|email|string|between:5,25",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Insert Password",
    rules: "required|string|between:5,25",
    type: "password",
  },
  {
    name: "passwordConfirm",
    label: "Password Confirmation",
    placeholder: "Confirm Password",
    rules: "required|string|same:password",
    type: "password",
  },
];

const hooks = {
  onSuccess(form) {
    alert("Form is valid! Send the request here.");
  },
  onError(form) {
    alert("Form has errors!");
  },
};

const form = new Form({ fields }, { plugins, hooks });
```

```jsx
import React from "react";
import { observer } from "mobx-react";

export default observer(({ form }) => (
  <form onSubmit={form.onSubmit}>
    <label htmlFor={form.$("email").id}>{form.$("email").label}</label>
    <input {...form.$("email").bind()} />
    <p>{form.$("email").error}</p>

    <button type="submit">Submit</button>
    <button type="button" onClick={form.onClear}>
      Clear
    </button>
    <button type="button" onClick={form.onReset}>
      Reset
    </button>

    <p>{form.error}</p>
  </form>
));
```

Follow the [full Quick Start guide](https://foxhound87.github.io/mobx-formkit/quick-start) or the [class-based setup](https://foxhound87.github.io/mobx-formkit/quick-start-class) for the complete walkthrough.

## Documentation

| Topic | Links |
| --- | --- |
| **Getting Started** | [Quick Start](https://foxhound87.github.io/mobx-formkit/quick-start) &middot; [Class-based Setup](https://foxhound87.github.io/mobx-formkit/quick-start-class) &middot; [TypeScript](https://foxhound87.github.io/mobx-formkit/typescript) &middot; [UMD Setup](https://foxhound87.github.io/mobx-formkit/umd-setup) |
| **Form & Fields** | [Form Instance](https://foxhound87.github.io/mobx-formkit/form/) &middot; [Form Options](https://foxhound87.github.io/mobx-formkit/form/form-options) &middot; [Defining Fields](https://foxhound87.github.io/mobx-formkit/fields/) |
| **Actions** | [Form Actions](https://foxhound87.github.io/mobx-formkit/actions/form) &middot; [Get, Set & Update](https://foxhound87.github.io/mobx-formkit/actions/get-set) &middot; [Add, Delete & Move](https://foxhound87.github.io/mobx-formkit/actions/add-del) &middot; [Validation & Submit](https://foxhound87.github.io/mobx-formkit/actions/validate) |
| **Validation** | [Choosing a Plugin](https://foxhound87.github.io/mobx-formkit/validation/) &middot; [Plugins & Packages](https://foxhound87.github.io/mobx-formkit/validation/plugins) &middot; [Validation Lifecycle](https://foxhound87.github.io/mobx-formkit/validation/lifecycle) |
| **Events** | [Event Handlers](https://foxhound87.github.io/mobx-formkit/events/event-handlers) &middot; [Event Hooks](https://foxhound87.github.io/mobx-formkit/events/event-hooks) &middot; [Validation Hooks](https://foxhound87.github.io/mobx-formkit/events/validation-hooks) |
| **Bindings** | [Default Bindings](https://foxhound87.github.io/mobx-formkit/bindings/default) &middot; [Custom Bindings](https://foxhound87.github.io/mobx-formkit/bindings/custom) |
| **API Reference** | [Form Properties](https://foxhound87.github.io/mobx-formkit/api-reference/form-properties) &middot; [Form Methods](https://foxhound87.github.io/mobx-formkit/api-reference/form-methods) &middot; [Fields Properties](https://foxhound87.github.io/mobx-formkit/api-reference/fields-properties) &middot; [Fields Methods](https://foxhound87.github.io/mobx-formkit/api-reference/fields-methods) |
| **Advanced** | [Overview](https://foxhound87.github.io/mobx-formkit/advanced/) &middot; [Wizard (multi-step)](https://foxhound87.github.io/mobx-formkit/advanced/wizard) &middot; [Sortable Lists](https://foxhound87.github.io/mobx-formkit/advanced/sortable) &middot; [File Upload](https://foxhound87.github.io/mobx-formkit/advanced/file-upload) |
| **Extra** | [Computed Props](https://foxhound87.github.io/mobx-formkit/extra/computed-props) &middot; [Input & Output Converters](https://foxhound87.github.io/mobx-formkit/extra/converters) &middot; [Forms Composer](https://foxhound87.github.io/mobx-formkit/extra/composer) &middot; [Recipes & Patterns](https://foxhound87.github.io/mobx-formkit/recipes) &middot; [Troubleshooting & FAQ](https://foxhound87.github.io/mobx-formkit/troubleshooting) |
| **Guides** | [Migration Guide](https://foxhound87.github.io/mobx-formkit/migration-guide) &middot; [Error Handling](https://foxhound87.github.io/mobx-formkit/error-handling) &middot; [Performance & SSR](https://foxhound87.github.io/mobx-formkit/performance-ssr) &middot; [Render Engine Support](https://foxhound87.github.io/mobx-formkit/frameworks) |
| **Ecosystem** | [DevTools](https://foxhound87.github.io/mobx-formkit/devtools) &middot; [AI Agent Skills](https://foxhound87.github.io/mobx-formkit/skills) &middot; [Live Demo](https://foxhound87.github.io/mobx-formkit-demo) |

## Legacy: mobx-react-form (MRF)

MobX Formkit is the successor of [**mobx-react-form**](https://www.npmjs.com/package/mobx-react-form) (MRF). The legacy package has been **renamed and deprecated on npm** — the codebase and its API continue here. To migrate, swap the package and update your imports:

```bash
npm uninstall mobx-react-form
npm install --save mobx-formkit
```

[![mobx-react-form version](https://img.shields.io/npm/v/mobx-react-form?style=for-the-badge&label=mobx-react-form&logo=npm)](https://www.npmjs.com/package/mobx-react-form)
[![legacy weekly downloads](https://img.shields.io/npm/dw/mobx-react-form?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/mobx-react-form)
[![legacy monthly downloads](https://img.shields.io/npm/dm/mobx-react-form?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/mobx-react-form)

As of August 2026, the final legacy release (`mobx-react-form@7.1.0`) still sees **~8.0k downloads/week**, **~47.4k downloads/month**, and **~664k downloads/year** (npm API). If you are still on MRF, this is the drop-in replacement.

See the [Migration Guide](https://foxhound87.github.io/mobx-formkit/migration-guide) on the docs for breaking changes across major versions.

## Contributing

1. Fork the repository
2. Make applicable changes (with tests!)
3. To run tests: `npm run test`
4. Ensure builds succeed: `npm run build`
5. Commit and run pre-commit checks: `npm run commit`

### New Issues

When opening new issues, provide the setup of your form in a [CodeSandbox](https://codesandbox.io/).

These issues, and the ones which provides also PR with failing tests will get higher priority.

### Contributors

This project exists thanks to all the people who contribute.

<a href="https://github.com/foxhound87/mobx-formkit/graphs/contributors"><img src="https://contrib.rocks/image?repo=foxhound87/mobx-formkit" /></a>

### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/mobx-formkit#backer)]

<a href="https://opencollective.com/mobx-formkit#backers" target="_blank"><img src="https://opencollective.com/mobx-formkit/backers.svg?width=890"></a>

### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/mobx-formkit#sponsor)]

<a href="https://opencollective.com/mobx-formkit#sponsors" target="_blank"><img src="https://opencollective.com/mobx-formkit/sponsors.svg?width=890"></a>

## License

[MIT](https://github.com/foxhound87/mobx-formkit/blob/master/LICENSE) &copy; [Claudio Savino](https://github.com/foxhound87)
