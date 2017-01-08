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
    default: ({ field, props, keys, $try }) => ({
      [keys.id]: $try(props.id, field.id),
      [keys.name]: $try(props.name, field.name),
      [keys.type]: $try(props.type, field.type),
      [keys.value]: $try(props.value, field.value),
      [keys.label]: $try(props.label, field.label),
      [keys.placeholder]: $try(props.placeholder, field.placeholder),
      [keys.disabled]: $try(props.disabled, field.disabled),
      [keys.onChange]: $try(props.onChange, field.onChange),
      [keys.onFocus]: $try(props.onFocus, field.onFocus),
      [keys.onBlur]: $try(props.onBlur, field.onBlur),
    }),
  };

  load(field, name = 'default', props) {
    if (_.has(this.rewriters, name)) {
      const $bindings = {};

      _.each(this.rewriters[name], ($v, $k) =>
        _.merge($bindings, { [$v]: this.try(props[$k], field[$k]) }));

      return $bindings;
    }

    return this.templates[name]({
      keys: this.rewriters[name],
      $try: this.try,
      field,
      props,
    });
  }

  register(bindings) {
    _.each(bindings, (val, key) => {
      if (_.isFunction(val)) _.merge(this.templates, { [key]: val });
      if (_.isPlainObject(val)) _.merge(this.rewriters, { [key]: val });
    });

    return this;
  }

  try(/* arguments */) {
    let found = null;
    _.each(arguments, (val, key) => { // eslint-disable-line
      if (!found && !_.isNil(val)) found = val;
    });
    return found;
  }
}
