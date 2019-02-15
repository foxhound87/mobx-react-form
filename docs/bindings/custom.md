# Custom Bindings

Here we can see how to register custom bindings for a **Material-UI TextField**

* [Implement a Rewriter](#implement-a-rewriter)
* [Implement a Template](#implement-a-template)

---

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
        onBlur: 'onBlur',
        onFocus: 'onFocus',
        autoFocus: 'autoFocus',
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

<br>

---

## Implement a `Template`

The `Template` is useful if you need to change how the properties are obtained, for example we  want to reimplement an Event Handler one time for all the same kind of fields or we want to swap their properties priorities and use those passed to the `bind()` method as **fallbacks**.

In the Form Class implement a `bindings()` methods which will return an object with our **Template** function.

In the following example some props passed to the `bind()` method will get priority over the `fields` ones. The new bindings will enable validation on `onBlur` handler (it is reimplemented by providing a custom function), and ErrorText & ErrorStyle are henanched to display a custom loading indicator for async calls.

```javascript
// custom onBlur with field validation
const onBlur = field => (e) => {
  e.preventDefault();
  field.onBlur();
  field.validate();
};

// define bindings templates
class MyForm extends MobxReactForm {

  bindings() {
    return {
      MaterialTextField: ({ $try, field, props }) => ({
        type: $try(props.type, field.type),
        id: $try(props.id, field.id),
        name: $try(props.name, field.name),
        value: $try(props.value, field.value),
        floatingLabelText: $try(props.label, field.label),
        hintText: $try(props.placeholder, field.placeholder),
        errorText: field.validating ? props.validatingText : $try(props.error, field.error),
        errorStyle: field.validating ? { background: 'yellow', color: 'black' } : {},
        disabled: $try(props.disabled, field.disabled),
        onChange: $try(props.onChange, field.onChange),
        onBlur: $try(props.onBlur, onBlur(field)),
        onFocus: $try(props.onFocus, field.onFocus),
        autoFocus: $try(props.autoFocus, field.autoFocus),
      }),
    };
  }
}
```

> `$try()` is a small helper function which takes unlimited arguments in input, it returns the first defined.

> In the default `Template` the `props` takes precedence on `field`.

Now we can use `MaterialTextField` as `bindings` prop on a field and use the `bind()` method on our components.
