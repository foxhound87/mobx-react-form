# Events Hooks

Events Hooks be used to catch an event for a particular field or nested field.

We can hook these events: `validate`, `update`, `clear`, `reset`.

```javascript
form.on('validate@state.city', ({ form, path }) => {

  form.$(path); // access 'state.city' on field 'validate'
});
```

```javascript
form.on('update@state.city', ({ form, path }) => {

  form.$(path); // access 'state.city' on field 'update'
});
```

```javascript
form.on('clear@state.city', ({ form, path }) => {

  form.$(path); // access 'state.city' on field 'clear'
});
```

```javascript
form.on('reset@state.city', ({ form, path }) => {

  form.$(path); // access 'state.city' on field 'reset'
});
```
