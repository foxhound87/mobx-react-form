/**
  Fields Bindings
*/
export default {

  MaterialTextFieldReimplemented: ({ field, props }) => ({
    type: props.type || field.type,
    id: props.id || field.id,
    name: props.name || field.name,
    value: props.value || field.value,
    floatingLabelText: props.label || field.label,
    hintText: props.placeholder || field.placeholder,
    errorText: props.error || field.error,
    disabled: props.disabled || field.disabled,
    onChange: props.onChange || field.onChange,
    onFocus: props.onFocus || field.onFocus,
    onBlur: props.onBlur || field.onBlur,
  }),

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
