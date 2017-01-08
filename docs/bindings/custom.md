# Custom Bindings

Here we can see how to register custom bindings for a **Material-UI TextField**

<br>

## Implement a `Rewriter`

In the Form Class implement a `bindings()` methods which will return an object with our **Rewriter** object.

```javascript
class MyForm extends MobxReactForm {

  bindings() {
    return {
      MaterialTextField: { // we can choose a name as key
        id: 'id',
        name: 'name',
        type: 'type',
        value: 'value',
        label: 'floatingLabelText',
        placeholder: 'hintText',
        disabled: 'disabled',
        error: 'errorText',
        onChange: 'onChange',
        onFocus: 'onFocus',
        onBlur: 'onBlur',
      },
    };
  }
}
```

> In every `Rewriter` the `props` passed to the `bind()` method always takes precedence on the `field` properties.

As you can see, the `keys` are the **Current Fields** properties, the `values` are the **Material-UI TextField** component properties.

If we want to use the `MaterialTextField` **Rewriter** on some fields, we need to assign it on each field we want using the `bindings` property, for example:

```javascript
...

username: {
  label: 'Username',
  value: 'SteveJobs',
  placeholder: 'Insert User Name',
  rules: 'checkUser|required|string|between:5,15',
  bindings: 'MaterialTextField', // <<< Use `MaterialTextField` Rewriter
},

...
```

Now we can use the `bind()` function on the component:

```javascript
import TextField from 'material-ui/TextField';

export default observer(({ field }) => (
  <div>
    <TextField {...field.bind()} /><br />
  </div>
));

```

Eventually we can use properties priority:

```javascript
import TextField from 'material-ui/TextField';

export default observer(({ field, type = 'password', placeholder = 'Insert Password' }) => (
  <div>
    <TextField {...field.bind({ type, placeholder })} /><br />
  </div>
));

```

> When passing properties to the `bind()` method, the field properties which are defined on form initialization will be treated as **fallbacks** (until you implement a new `Template`).


<br>

## Implement a `Template`

The `Template` is useful if you need to change how the properties are obtained, for example we  want to reimplement an Event Handler one time for all the same kind of fields or we want to swap their properties priorities and use those passed to the `bind()` method as **fallbacks**.

In the Form Class implement a `bindings()` methods which will return an object with our **Template** function.

In the following example some fields props will be the fallback of the ones passed to the `bind()` method and the `onChange` Handler is reimplemented by providing a custom function.

```javascript
class MyForm extends MobxReactForm {

  bindings() {
    return {
      MaterialTextField: ({ field, props }) => ({
        type: field.type || props.type,
        id: field.id || props.id,
        name: field.name || props.name,
        value: field.value || props.value,
        floatingLabelText: field.label || props.label,
        hintText: field.placeholder || props.placeholder,
        errorText: field.error || props.error,
        disabled: field.disabled || props.disabled,
        onChange: myOnChange(props.onChange || field.onChange)),
        onFocus: props.onFocus || field.onFocus,
        onBlur: props.onBlur || field.onBlur,
      }),
    };
  }
}
```

> In the default `Template` the `props` takes precedence on `field`.

Now we can use pass `MaterialTextField` as `bindings` prop on a field and use the `bind()` method on our components.
