import _ from 'lodash';

export default class Bindings {

  rewriters = {
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
    },
  };

  templates = {
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
  };

  load(field, name = 'default', props) {
    if (_.has(this.rewriters, name)) {
      const $bindings = {};

      _.each(this.rewriters[name], ($v, $k) =>
        _.merge($bindings, { [$v]: props[$k] || field[$k] }));

      return $bindings;
    }

    return this.templates[name]({ field, props, keys: this.rewriters[name] });
  }

  register(bindings) {
    _.each(bindings, (val, key) => {
      if (_.isFunction(val)) _.merge(this.templates, { [key]: val });
      if (_.isPlainObject(val)) _.merge(this.rewriters, { [key]: val });
    });

    return this;
  }
}
