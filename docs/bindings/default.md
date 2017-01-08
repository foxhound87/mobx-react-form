# Default Bindings

<br>

## Simple Usage

The **Default Bindings** can be used on any input component using the fields `bind()` method:

```javascript
export default observer(({ field, type = 'text' }) => (
  <div>
    <input type={type} {... field.bind()} />
  </div>
));
```

<br>

## Properties Priority

The `bind()` method has a **priority** functionality for any **property**, just pass to it an object with all properties you want to overwrite:

```javascript
export default observer(({ field, type = 'password', placeholder="Insert Password" }) => (
  <div>
    <input {... field.bind({ type, placeholder })} />
  </div>
));
```

> When passing properties to the `bind()` method, the field properties which are defined on form initialization will be treated as **fallbacks** (until you implement a new `Template`).


### **We are done!**

<br>
<br>

---

### WARNING

> The following code is BUILT-IN and it's just an explaination on how the bindings modes works, **maybe** you DO NOT need to reimplement it!

> You can eventually reimplement it if you need more flexibility registering a new binding with the `default` key. Check out how to create [Custom Bindings](custom.md).


## BUILT-IN `default` Template & Rewriter.

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
    onFocus: 'onFocus',
    onBlur: 'onBlur',
  }
}
```

> In every `Rewriter` the `props` passed to the `bind()` method always takes precedence on the `field` properties.


Then these keys are assigned to the template which will handle the props values priorities and fallbacks:

### Default Template

```javascript
export default {
  default: ({ field, props, keys }) => ({
    [keys.id]: props.id || field.id,
    [keys.name]: props.name || field.name,
    [keys.type]: props.type || field.type,
    [keys.value]: props.value || field.value,
    [keys.label]: props.label || field.label,
    [keys.placeholder]: props.placeholder || field.placeholder,
    [keys.disabled]: props.disabled || field.disabled,
    [keys.onChange]: props.onChange || field.onChange,
    [keys.onFocus]: props.onFocus || field.onFocus,
    [keys.onBlur]: props.onBlur || field.onBlur,
  }),
}
```

The function takes in input an object with the following props:

- the `field`: which is the current field, you can retrieve the fields properites form it.
- the `props`: which are the properties passed from the components as fallback.
- the `keys`: which contains the properties defined in the `rewriter` that will match the components properties.
