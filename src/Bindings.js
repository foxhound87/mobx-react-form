import _ from 'lodash';

export default class Bindings {

  templates = {
    // default: ({ field, props, keys, $try }) => ({
    //   [keys.id]: $try(props.id, field.id),
    // }),
  };

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
    // eslint-disable-next-line
    _.each(arguments, (val, key) => {
      if (!found && !_.isNil(val)) found = val;
    });
    return found;
  }
}
