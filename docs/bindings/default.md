# Default Bindings

- [Simple Usage](#simple-usage)
- [Properties Overwrite](#properties-overwrite)

- [Default Bindings](#built-in-default-template--rewriter)
  - [Default Rewriter](#default-rewriter)
  - [Default Template](#default-template)
  - [Override Default Bindings Template](#override-default-bindings-template)

---

## Simple Usage

The **Default Bindings** can be used on any input component using the fields `bind()` method:

```javascript
export default observer(({ field }) => (
  <div>
    <input {...field.bind()} />
  </div>
));
```

<br>

## Properties Overwrite

The `bind()` method will **overwrite any component property**, just pass to it an object with all properties you want to overwrite:

```javascript
export default observer(({ field, type = 'password', placeholder = 'Insert Password' }) => (
  <div>
    <input {...field.bind({ type, placeholder })} />
  </div>
));
```

> When passing properties to the `bind()` method, the field properties which are defined on form initialization will be treated as **fallbacks** (until you implement a new `Template`).


#### IMPORTANT!

The props passed to the `bind()` method will not mutate the package's store but only your component.

Do this only for handling edge cases, as it's not the default behavior to handle field props, [define fields](../defining-fields.md) normally instead.


<br>
<br>

---

## BUILT-IN `default` Template & Rewriter

Here you can see the structure of the `default` Template & Rewriter.

The `default` rewriter define which component properties has assigned to the field property key


### Default Rewriter

```javascript
export default {
  default: {
    id: 'id',
    name: 'name',
    type: 'type',
    value: 'value',
    label: 'label',
    placeholder: 'placeholder',
    disabled: 'disabled',
    onChange: 'onChange',
    onBlur: 'onBlur',
    onFocus: 'onFocus',
    autoFocus: 'autoFocus',
  }
}
```

> In every `Rewriter` the `props` passed to the `bind()` method always takes precedence on the `field` properties.


Then these keys are assigned to the template which will handle the props values priorities and fallbacks:

### Default Template

```javascript
export default {
  default: ({ $try, form, field, props, keys }) => ({
    [keys.id]: $try(props.id, field.id),
    [keys.name]: $try(props.name, field.name),
    [keys.type]: $try(props.type, field.type),
    [keys.value]: $try(props.value, field.value),
    [keys.label]: $try(props.label, field.label),
    [keys.placeholder]: $try(props.placeholder, field.placeholder),
    [keys.disabled]: $try(props.disabled, field.disabled),
    [keys.onChange]: $try(props.onChange, field.onChange),
    [keys.onBlur]: $try(props.onBlur, field.onBlur),
    [keys.onFocus]: $try(props.onFocus, field.onFocus),
    [keys.autoFocus]: $try(props.autoFocus, field.autoFocus),
  }),
}
```

> `$try()` is a small helper function which takes unlimited arguments in input, it returns the first defined.

The function takes in input an object with the following props:

- the `form`: which is the form instance, you can retrieve the form properites form it.
- the `field`: which is the current field, you can retrieve the fields properites form it.
- the `props`: which are the properties passed from the components as fallback.
- the `keys`: which contains the properties defined in the `rewriter` that will match the components properties.


### Override Default Bindings Template

If you want to override the default bindings with a custom template for all defined fields you can name the template function as `default`.

> No need to update fields bindings name because they are already `default`

Using `default` template with Form Constructor:

```javascript
const bindings = {
  default: ({ $try, form, field, props, keys }) => ({
    ... define bindings here
  }),
}

new Form({ ... }, { bindings, ... })
```

Using `default` template extending Form Class:

```javascript
class MyForm extends Form {

  bindings() {
    return {
      default: ({ $try, form, field, props }) => ({
        ... define bindings here
      }),
    };
  }
}
```
