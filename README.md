
### [Documentation](https://foxhound87.github.io/mobx-react-form) &bull; [Live Demo](https://foxhound87.github.io/mobx-react-form-demo) &bull; [Demo Code](https://github.com/foxhound87/mobx-react-form-demo) &bull; [Tutorial](https://medium.com/@foxhound87/automagically-manage-react-forms-state-with-mobx-and-automatic-validation-2b00a32b9769) &bull; [Join Discord Channel](https://discord.gg/CVV8w4zat4)

# MobX React Form

### Reactive MobX Form State Management

[![NPM](https://nodei.co/npm/mobx-react-form.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mobx-react-form/)

![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/foxhound87/mobx-react-form/ci.yml?branch=next)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/foxhound87/mobx-react-form)
![npm bundle size](https://img.shields.io/bundlephobia/min/mobx-react-form)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/foxhound87/mobx-react-form/master.svg)](https://codecov.io/gh/foxhound87/mobx-react-form)
[![node](https://img.shields.io/node/v/mobx-react-form.svg)]()
[![GitHub license](https://img.shields.io/github/license/foxhound87/mobx-react-form.svg)]()
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/foxhound87/mobx-react-form)
![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/foxhound87/mobx-react-form)
[![Downloads](https://img.shields.io/npm/dt/mobx-react-form.svg)]()
[![Downloads](https://img.shields.io/npm/dm/mobx-react-form.svg)]()
[![Backers on Open Collective](https://opencollective.com/mobx-react-form/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/mobx-react-form/sponsors/badge.svg)](#sponsors)


<br>

## Features

- Extensibles [Validation Plugins](https://foxhound87.github.io/mobx-react-form/docs/validation/plugins.html).
- Sync & Async Validation (w/ Promises & automatic errors).
- Nested Fields (w/ Serialization & Validation).
- Nested Forms (w/ Nested Submission & Validation Hooks).
- [Event Hooks](https://foxhound87.github.io/mobx-react-form/docs/events/event-hooks.html), [Event Handlers](https://foxhound87.github.io/mobx-react-form/docs/events/event-handlers.html) & [Validation Hooks](https://foxhound87.github.io/mobx-react-form/docs/events/validation-hooks.html)
- Functional [Computed Field Props](https://foxhound87.github.io/mobx-react-form/docs/extra/computed-props.html)
- Field Props [Observers & Interceptors](https://foxhound87.github.io/mobx-react-form/docs/extra/mobx-events.html)
- Field [Props Bindings](https://foxhound87.github.io/mobx-react-form/docs/bindings) for custom Components.
- Support for Material UI, React Widgets, React Select & more.
- [Forms Composer](https://foxhound87.github.io/mobx-react-form/docs/extra/composer.html): to handle multi-forms submit, validations and other actions
- Dedicated [DevTools](https://github.com/foxhound87/mobx-react-form-devtools) Package.

<br>

## Quick Start


[![Edit form-quickstart](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/nrrZgG8y4)

```bash
npm install --save mobx-react-form
```

#### Choose and Setup a Validation Plugin

Below we are creating a `plugins` object using the `validatorjs` package to enable `DVR` functionalities (Declarative Validation Rules).

```javascript
import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';

const plugins = {
  dvr: dvr(validatorjs)
};
```

> See [Validation Plugins](https://foxhound87.github.io/mobx-react-form/docs/validation/plugins.html) for more info on supported packages.

#### Define the Form Fields

Define the `fields` as a collection with a `rules` property for the validation.

```javascript
const fields = [{
  name: 'email',
  label: 'Email',
  placeholder: 'Insert Email',
  rules: 'required|email|string|between:5,25',
}, {
  name: 'password',
  label: 'Password',
  placeholder: 'Insert Password',
  rules: 'required|string|between:5,25',
  type: 'password',
}, {
  name: 'passwordConfirm',
  label: 'Password Confirmation',
  placeholder: 'Confirm Password',
  rules: 'required|string|same:password',
  type: 'password',
}];
```

> See [Fields Definitions](https://foxhound87.github.io/mobx-react-form/docs/fields/) and all available [Field Props](https://foxhound87.github.io/mobx-react-form/docs/api-reference/fields-properties.html) on the docs.

#### Define the Validation Hooks

```javascript
const hooks = {
  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    // get field values
    console.log('Form Values!', form.values());
  },
  onError(form) {
    alert('Form has errors!');
    // get all form errors
    console.log('All form errors', form.errors());
  }
}
```

> See more on the docs about the [Validation Hooks](https://foxhound87.github.io/mobx-react-form/docs/events/validation-hooks.html) and the [Event Hooks](https://foxhound87.github.io/mobx-react-form/docs/events/event-hooks.html)

#### Initialize the Form

Simply pass the `fields`, `plugins` and `hooks` objects to the constructor

```javascript
import MobxReactForm from 'mobx-react-form';

const myForm = new MobxReactForm({ fields }, { plugins, hooks });
```

> Learn more on the docs about the [Form Instance](https://foxhound87.github.io/mobx-react-form/docs/form/)

#### Pass the myForm to a react component

The package provide some built-in and ready to use Event Handlers:

`onSubmit(e)`, `onClear(e)`, `onReset(e)` & [more...](https://foxhound87.github.io/mobx-react-form/docs/events/event-handlers.html)

```javascript
import React from 'react';
import { observer } from 'mobx-react';

export default observer(({ myForm }) => (
  <form onSubmit={myForm.onSubmit}>
    <label htmlFor={myForm.$('email').id}>
      {myForm.$('email').label}
    </label>
    <input {...myForm.$('email').bind()} />
    <p>{myForm.$('email').error}</p>

    {/* ... other inputs ... */}

    <button type="submit" onClick={myForm.onSubmit}>Submit</button>
    <button type="button" onClick={myForm.onClear}>Clear</button>
    <button type="button" onClick={myForm.onReset}>Reset</button>

    <p>{myForm.error}</p>
  </form>
));
```

> See more on the docs about the [Field Props Bindings](https://foxhound87.github.io/mobx-react-form/docs/bindings)

###### Extending the Form class

[See how to implement the same configuration of this quickstart extending the Form class](https://foxhound87.github.io/mobx-react-form/docs/quick-start-class.html)

<br>

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
<a href="graphs/contributors"><img src="https://opencollective.com/mobx-react-form/contributors.svg?width=890&button=false" /></a>


### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/mobx-react-form#backer)]

<a href="https://opencollective.com/mobx-react-form#backers" target="_blank"><img src="https://opencollective.com/mobx-react-form/backers.svg?width=890"></a>


### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/mobx-react-form#sponsor)]

<a href="https://opencollective.com/mobx-react-form/sponsor/0/website" target="_blank"><img src="https://opencollective.com/mobx-react-form/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/mobx-react-form/sponsor/1/website" target="_blank"><img src="https://opencollective.com/mobx-react-form/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/mobx-react-form/sponsor/2/website" target="_blank"><img src="https://opencollective.com/mobx-react-form/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/mobx-react-form/sponsor/3/website" target="_blank"><img src="https://opencollective.com/mobx-react-form/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/mobx-react-form/sponsor/4/website" target="_blank"><img src="https://opencollective.com/mobx-react-form/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/mobx-react-form/sponsor/5/website" target="_blank"><img src="https://opencollective.com/mobx-react-form/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/mobx-react-form/sponsor/6/website" target="_blank"><img src="https://opencollective.com/mobx-react-form/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/mobx-react-form/sponsor/7/website" target="_blank"><img src="https://opencollective.com/mobx-react-form/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/mobx-react-form/sponsor/8/website" target="_blank"><img src="https://opencollective.com/mobx-react-form/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/mobx-react-form/sponsor/9/website" target="_blank"><img src="https://opencollective.com/mobx-react-form/sponsor/9/avatar.svg"></a>


