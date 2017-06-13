# Observe or Intercept Fields Props

* [Using `observe()` / `intercept()` Methods](#using-observe--intercept-methods)
* [Using `observers` / `interceptors` Props](#using-observers--interceptors-props)
* [Disposers](#disposers)

---

## Using `observe()` / `intercept()` Methods

If you need to observe or intercept **on the fly** the **Field Props** or the **Fields Map** you can use the `observe()` / `intercept()` methods on the form instance:

```javascript
// observe value of password

form.observe({
  path: 'password'
  key: 'value', // can be any field property
  call: ({ form, field, change }) => { ... },
});
```

```javascript
// intercept value of password

form.intercept({
  path: 'username'
  key: 'value', // only some field property allowed
  call: ({ form, field, change }) => { ... },
});
```

The `call` function will receive the `Form` instance, the `Field` instance and the **mobx event object** (`change`).

> Specify the Field `path`, the prop `key` to observe and the function (`call`) to fire when the event occurs.

> Specify `fields` as `key` and the nested fields map will be observed or intercepted (add/del).

> The **intercept** function must return a new mobx `change` event object.

> For more info on the mobx `change` event object take a look at the mobx [Event Overview Table](http://mobxjs.github.io/mobx/refguide/observe.html).


Eventually you can use `observe()` / `intercept()` also on a selected Field:

You can pass a **function** or an **object** with `key` and `call` props.

```javascript
// observe value of password

form.$('password')
  .observe(({ form, field, change }) => { ... });
```

```javascript
// intercept value of password

form.$('password')
  .intercept(({ form, field, change }) => { ... });
```

> Passing only a function the default `key` will be `value`.

> The `path` is omitted. It's defined by the selector.

> Specify `fields` as `key` and the nested fields map will be observed (add/del).

> The **intercept** function must return a new mobx `change` event object.

## Using `observers` / `interceptors` Props

Here we are defining observers or interceptors to be passed in the [First Argument of the Form Constructor](../form/form-initialization.md#first-constructor-argument).

This method is useful if you need to handle nested fields. The observers/interceptors will be automatically loaded when add/del fields dynamically.

Define an `observers` / `interceptors` **object** like this:

```javascript
const observers = {
  'club': [{
    key: 'focused', // can be any field property
    call: ({ form, field, change }) => { ... },
  }],
  'members[].hobbies[]': [{
    key: 'touched', // can be any field property
    call: ({ form, field, change }) => { ... },
  }],
};

new Form({ observers, interceptors, ... });
```

> This is an example using **Separated Field Properties Definition** mode but **Unified** mode is also supported.

## Disposers

#### Dispose All Events

Each observer/interceptor will automatically create their own `disposer` which will stop the related observable events.

Dispose all observers & interceptors recursively (for nested fields too):

```javascript
form.dispose()
```

> to be used only on the form instance.

#### Dispose Single Event

You can use `dispose({ type, key, path })` on the **Form** instance:

The `type` prop can be **observer** or **interceptor**

```javascript
form.dispose({
  type: 'observer',
  path: 'password',
  key: 'value',
});
```

or omitting the `path` when selecting the Field:

```javascript
form.$('password').dispose({
  type: 'interceptor',
  key: 'value',
});
```

> Nested fields paths can be used as well.
