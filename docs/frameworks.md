# Render Engine Support

**mobx-formikit** is a **UI-agnostic** state library: the core depends only on `mobx` (plus `lodash-es`) and knows nothing about React, Vue, or any DOM. Any rendering engine that can consume MobX observables works out of the box — no changes to the library, no adapter, no fork.

| Render Engine | Binding Package | Status |
|---|---|---|
| [React](#react) | [`mobx-react`](https://github.com/mobxjs/mobx-react) / `mobx-react-lite` | ✅ Official, actively maintained |
| [Octane](#octane) | [`@octanejs/mobx`](https://github.com/octanejs/octane/tree/main/packages/mobx) | ✅ First-party, `mobx-react-lite` compatible surface |
| [Vue 3](#vue-3) | [`mobx-vue-lite`](https://github.com/mobxjs/mobx-vue-lite) | ✅ mobxjs org, Composition API |
| [Lit](#lit) | [`@adobe/lit-mobx`](https://github.com/adobe/lit-mobx) | ✅ Maintained by Adobe |
| [Angular](#angular) | [`mobx-angular`](https://github.com/mobxjs/mobx-angular) | ✅ mobxjs org |
| [Solid](#solid) | [`mobx-solid`](https://github.com/js2me/mobx-solid) | 🧪 Community |

> 💡 **Vanilla JS** also works trivially — render any form with plain `autorun` / `reaction`, no framework at all.

---

## Why it works

The form state lives entirely inside observable class instances (`Form`, `Field`, `Validator`). Rendering engines only need one thing: a way to **re-render when observables change**. Every binding below provides exactly that primitive — `observer` in React/Octane/Solid, `<Observer>` in Vue, a reaction mixin in Lit, and an autorun directive in Angular.

```javascript
// The exact same form definition, everywhere:
import { Form } from 'mobx-formikit';

const form = new Form({
  fields: {
    email: { label: 'Email', value: 's.jobs@apple.com', rules: 'required|email' },
    password: { label: 'Password', rules: 'required|min:6' },
  },
});
```

---

## React

Install `mobx-react` (or `mobx-react-lite`), wrap your components with `observer`, bind inputs with the form's field helpers.

```jsx
import { observer } from 'mobx-react-lite';

const EmailField = observer(({ form }) => (
  <input value={form.$('email').value} onChange={form.$('email').onChange} />
));
```

React is the reference integration — see the [Quick Start](quick-start.md), [Bindings](bindings/) and the live [demo](https://foxhound87.github.io/mobx-formikit-demo).

---

## Octane

[Octane](https://octanejs.dev/) — React's programming model, compiled. `@octanejs/mobx` re-exports the full `mobx` core and implements the `mobx-react-lite` surface (`observer`, `useObserver`, `Observer`, `useLocalObservable`, `enableStaticRendering`), so the integration is identical to React — in a compiled `.tsrx` component:

```tsx
import { observer } from '@octanejs/mobx';

export const EmailField = observer(({ form }) => (
  <input value={form.$('email').value} onChange={form.$('email').onChange} />
));
```

> ⚠️ The binding targets compiled Octane function components. React class components, legacy `Provider`/`inject`, and React DevTools integration are not included (v1 limits).

---

## Vue 3

Install `mobx-vue-lite` (Composition API, mobxjs org). Wrap any reactive region with the `<Observer>` component:

```vue
<script setup>
import { Observer } from 'mobx-vue-lite';
import { Form } from 'mobx-formikit';

const form = new Form({ fields: { email: { rules: 'required|email' } } });
</script>

<template>
  <Observer>
    <label>{{ form.$('email').label }}</label>
    <input
      :value="form.$('email').value"
      @input="form.$('email').onSync"
    />
    <p v-if="form.$('email').error">{{ form.$('email').error }}</p>
  </Observer>
</template>
```

`mobx-vue-lite` also ships `useLocalObservable` and `createGlobalObservable` helpers, and works with Nuxt 3 via `mobx-vue-lite/nuxt`.

---

## Lit

Install `@adobe/lit-mobx` and extend `MobxLitElement` — observables read in `render()` trigger updates automatically:

```javascript
import { html } from 'lit';
import { MobxLitElement } from '@adobe/lit-mobx';
import { Form } from 'mobx-formikit';

export class EmailField extends MobxLitElement {
  form = new Form({ fields: { email: { label: 'Email', rules: 'required|email' } } });

  render() {
    return html`
      <label>${this.form.$('email').label}</label>
      <input
        .value=${this.form.$('email').value}
        @input=${this.form.$('email').onChange}
      />
      ${this.form.$('email').error
        ? html`<p>${this.form.$('email').error}</p>`
        : ''}
    `;
  }
}
customElements.define('email-field', EmailField);
```

Perfect for Web Components that embed a reactive form with zero framework coupling.

---

## Angular

Install `mobx-angular` and use the `*mobxAutorun` directive — it observes every observable your template touches and runs change detection automatically (works great with `OnPush`):

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Form } from 'mobx-formikit';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *mobxAutorun>
      <input
        [value]="form.$('email').value"
        (input)="form.$('email').onSync($event)"
      />
      <p *ngIf="form.$('email').error">{{ form.$('email').error }}</p>
    </div>
  `,
})
export class EmailFieldComponent {
  form = new Form({ fields: { email: { rules: 'required|email' } } });
}
```

Don't forget to import `MobxAngularModule` in your module. For full performance, pair it with the `OnPush` change detection strategy.

---

## Solid

Install the community `mobx-solid` binding — the API mirrors `mobx-react-lite`, adapted to Solid's fine-grained reactivity model:

```jsx
import { observer } from 'mobx-solid';
import { Form } from 'mobx-formikit';

const EmailField = observer(({ form }) => (
  <input value={form.$('email').value} onChange={form.$('email').onChange} />
));
```

> 🧪 **Community binding** — functional, but maintained by a single contributor. Solid ships its own signal primitives, so treat this as a convenience integration.

---

## Engines not listed?

Because the core is UI-agnostic, any renderer with a MobX binding (or a `reaction`/`autorun` escape hatch) can drive a form. Missing yours? Drop a line in the [GitHub Discussions](https://github.com/foxhound87/mobx-formikit/discussions) — adding an integration page is a small docs PR.

---

> 📘 **Next:** [Quick Start](quick-start.md) · [Defining Fields](fields/) · [Validation](validation/)
