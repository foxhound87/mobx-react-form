# Observe Fields Props

* [Observe with `observe()` Method]()
* [Observe with `observers` Init Prop]()
* [Disposers]()

---

## Observe with `observe()` Method

If you need to observe **on the fly** the **Field Props** or the **Fields Map** you can use the `observe()` method on the form instance:

```javascript
form.observe({
  path: 'password'
  key: 'value', // can be any field property
  call: ({ form, field, change }) => { ... },
});
```

> Specify the Field `path`, the prop `key` to observe and the function (`call`) to fire when the event occur.

The `call` function will receive the `Form` instance, the `Field` instance and the **mobx event object** (`change`).

> For more info on the mobx `change` event object take a look at the mobx [Event Overview Table](http://mobxjs.github.io/mobx/refguide/observe.html) for the `observe` method.

Eventually you can use `observe()` also on a selected Field:

```javascript
form.$('password').observe({
  key: 'value', // can be any field property
  call: ({ form, field, change }) => { ... },
});
```

> The `path` is omitted. It's defined by the selector.

## Observe with `observers` Init Prop

This method is useful if you need to handle nested fields or add/del fields dynamically.

Define an `observers` object like this:

```javascript
const observers = {
  'club': [{
    key: 'focus', // can be any field property
    call: data => console.log('CHANGED', data),
  }],
  'members[].hobbies[]': [{
    key: 'touched', // can be any field property
    call: data => console.log('CHANGED', data),
  }],
};
```

## Disposers

Each observer will automatically create its own `disposer` which will stop the related observable events.

You can use `dispose(key, path)` on the **Form** instance:

```javascript
form.dispose('value', 'password');
```

or providing only the key when selecting the Field:

```javascript
form.$('password').dispose('value');
```

> Nested fields paths can be used as well.


