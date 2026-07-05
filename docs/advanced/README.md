# Advanced

This section covers advanced features and patterns, including the complete set of **interactive demo implementations** available in the [live demo](https://foxhound87.github.io/mobx-react-form-demo).

Each demo below links to its source code so you can see the implementation in context.

---

## Demo Implementations

| Demo | Description | Source |
|------|-------------|--------|
| [Sortable List](sortable.md) | Drag-and-drop reordering of array fields using `move()` | [FormSortableList.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormSortableList.tsx) |
| [Interceptors](interceptors.md) | Intercept field value changes before they propagate | [FormInterceptors.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormInterceptors.tsx) |
| [Observers](observers.md) | Observe field changes with MobX reactivity | [FormObservers.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormObservers.tsx) |
| [Forms Composer](../extra/composer.md) | Manage multiple forms as a single unit (API) | [FormComposer.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormComposer.tsx) |
| [Reactive Computed](reactive-computed.md) | Row-level computed totals reacting to input changes | [FormReactiveComputed.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormReactiveComputed.tsx) |
| [Cross Validation](cross-validation.md) | Validate related fields across form groups | [FormCrossValidation.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormCrossValidation.tsx) |
| [Nested Composition](nested-composition.md) | Compose independent Form instances together | [FormNestedComposition.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormNestedComposition.tsx) |
| [Wizard](wizard.md) | Multi-step wizard with per-step validation | [FormWizard.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormWizard.tsx) |
| [Bindings Demo](bindings-demo.md) | Custom field bindings for different input types | [FormBindingsDemo.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormBindingsDemo.tsx) |
| [Markdown Editor](markdown.md) | Live markdown preview bound to a form field | [FormMarkdown.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormMarkdown.tsx) |
| [File Upload](file-upload.md) | File input and drag-and-drop upload handling | [FormFileUpload.tsx](https://github.com/foxhound87/mobx-react-form-demo/blob/master/src/components/forms/FormFileUpload.tsx) |

---

## Advanced Internals

| Topic | Description |
|-------|-------------|
| [ArrayMap](array-map.md) | The ordered key-value collection powering dynamic array fields |

---

> 💡 **Tip:** Run `npm run dev` in the demo repository to explore these implementations locally.  
> 📘 **API features** (Computed Props, Converters, MobX Events, Forms Composer) are in the [Extra](../extra/README.md) section.
