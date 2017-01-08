# Custom Bindings

Here we can see how to register custom bindings for a **Material-UI TextField**

<br>

## Implement a `Rewriter`

In the Form Class implement a `bindings()` methods which will return an object with our **Rewriter** object.

```javascript
class MyForm extends MobxReactForm {

  bindings() {
    return {
      // we can choose a name as key
      MaterialTextField: {
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
    <TextField {...field.bind()} />
  </div>
));

```

Eventually we can use properties overwrite:

```javascript
import TextField from 'material-ui/TextField';

export default observer(({ field, type = 'password', placeholder = 'Insert Password' }) => (
  <div>
    <TextField {...field.bind({ type, placeholder })} />
  </div>
));

```

> When passing properties to the `bind()` method, the field properties which are defined on form initialization will be treated as **fallbacks** (until you implement a new `Template`).


<br>

## Implement a `Template`

The `Template` is useful if you need to change how the properties are obtained, for example we  want to reimplement an Event Handler one time for all the same kind of fields or we want to swap their properties priorities and use those passed to the `bind()` method as **fallbacks**.

In the Form Class implement a `bindings()` methods which will return an object with our **Template** function.

In the following example some props passed to the `bind()` method will be the fallback of the `fields` ones and the `onChange` Handler is reimplemented by providing a custom function.

```javascript
class MyForm extends MobxReactForm {

  bindings() {
    return {
      MaterialTextField: ({ $try, field, props }) => ({
        type: $try(field.type, props.type, 'text'),
        id: $try(field.id, props.id),
        name: $try(field.name, props.name),
        value: $try(field.value, props.value),
        floatingLabelText: $try(field.label, props.label),
        hintText: $try(field.placeholder, props.placeholder, 'Insert Something...'),
        errorText: $try(field.error, props.error),
        disabled: $try(field.disabled, props.disabled),
        onChange: myOnChange($try(props.onChange, field.onChange)),
        onFocus: $try(props.onFocus, field.onFocus),
        onBlur: $try(props.onBlur, field.onBlur),
      }),
    };
  }
}
```

> `$try()` is a small helper function which takes unlimited arguments in input, it returns the first defined.

> In the default `Template` the `props` takes precedence on `field`.

Now we can use `MaterialTextField` as `bindings` prop on a field and use the `bind()` method on our components.
