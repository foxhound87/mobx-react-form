# Event Hooks

* [On Form Initialization](event-hooks/constructor.md)
* [Extending the Class](event-hooks/extending.md)
* [Execute code on Instance Init](event-hooks.md#execute-code-on-instance-init)

---

The Event Hooks are called just after the execution of Event Handlers.

The lifecycle of all events is:

`User Input` **>** `Event Handler` / `Action` **>** `Mutate Store` **>** `Event Hook`.

> All Event Hooks takes the current instance (Form or Field) in Input.

---

##### Available Event Hooks
> Triggered by Event Handlers

| Event Handler | Affected Property | Executed Hook | FORM | FIELD |
|---|---|---|---|---|
| onChange(e) | value | onChange | YES * | YES |
| onToggle(e) | value | onToggle | NO | YES |
| onFocus(e) | focused | onFocus | NO | YES |
| onBlur(e) | touched | onBlur | NO | YES |
| onDrop(e) | files | onDrop | NO | YES |

> (*) next pre-relase >= 5.1.0

##### Available Event Hooks w/ Actions
> Triggered by Event Handlers

| Event Handler | Executed Action | Affected Property | Executed Hook | FORM | FIELD |
|---|---|---|---|---|
| onSubmit(e) | submit() > validate() | submitting, validating | onSubmit | YES | YES |
| onClear(e) | clear() | value | onClear | YES | YES |
| onReset(e) | reset() | value | onReset | YES | YES |
| onAdd(e) | add() | fields | onAdd | YES | YES |
| onDel(e) | del() | fields | onDel | YES | YES |

---

#### Validation Hooks

We have some alternatives to deal with the Validation Hooks:

  * [Extending the Class](validation-hooks/extending.md)
  * [On Form Initialization](validation-hooks/constructor.md)
  * [Override on Manual Submit](validation-hooks/override.md)

---

## Execute code on Instance Init

The `onInit` hook is executed just after the instance (Form or Field) is created.

| Action | Affected Property | Executed Hook | FORM | FIELD |
|---|---|---|---|---|
| constructor() | ALL | onInit | YES | YES |

```javascript
new Form({ ... }, {
  hooks: {
    onInit(form) {
      console.log('-> onInit Form HOOK');
    },
  },
})
```

---

%accordion% **VERSION < 1.29** %accordion%

Event Hooks can be used to catch an event when selecting a particular field or nested field.

We can hook these events: `validate`, `update`, `clear`, `reset`.

The callback will receive:

* The Form Instance
* The Field Instance
* The Field Path
* The Event Name
* The mobx `change` object

```javascript
form.$('password').on('validate', ({ form, field, path, event, change }) => { ... });
```

```javascript
form.$('password').on('update', ({ form, field, path, event, change }) => { ... });
```

```javascript
form.$('password').on('clear', ({ form, field, path, event, change }) => { ... });
```

```javascript
form.$('password').on('reset', ({ form, field, path, event, change }) => { ... });
```

> For more info on the mobx `change` object take a look at the mobx [Event Overview Table](http://mobxjs.github.io/mobx/refguide/observe.html) for the `observe` method.

%/accordion%
