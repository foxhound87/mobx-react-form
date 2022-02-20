import _ from "lodash";
import { $try } from "./utils";

import { FieldPropsEnum, FieldPropsInterface } from "./models/FieldProps";
import BindingsInterface from "./models/BindingsInterface";

export default class Bindings implements BindingsInterface {
  templates = {
    // default: ({ field, props, keys, $try }) => ({
    //   [keys.id]: $try(props.id, field.id),
    // }),
  };

  rewriters = {
    default: {
      id: FieldPropsEnum.id,
      name: FieldPropsEnum.name,
      type: FieldPropsEnum.type,
      value: FieldPropsEnum.value,
      initial: FieldPropsEnum.initial,
      default: FieldPropsEnum.default,
      checked: FieldPropsEnum.checked,
      label: FieldPropsEnum.label,
      placeholder: FieldPropsEnum.placeholder,
      error: FieldPropsEnum.error,
      // handlers
      onChange: FieldPropsEnum.onChange,
      onBlur: FieldPropsEnum.onBlur,
      onFocus: FieldPropsEnum.onFocus,
      onToggle: FieldPropsEnum.onToggle,
      onSubmit: FieldPropsEnum.onSubmit,
      onReset: FieldPropsEnum.onReset,
      onClear: FieldPropsEnum.onClear,
      onAdd: FieldPropsEnum.onAdd,
      onDel: FieldPropsEnum.onDel,
      autoFocus: FieldPropsEnum.autoFocus,
    },
  };

  load(field: any, name: string = "default", props: FieldPropsInterface) {
    if (_.has(this.rewriters, name)) {
      const $bindings = {};

      _.each(_.get(this.rewriters, name), ($v, $k) =>
        _.merge($bindings, { [$v]: $try(props[$k], field[$k]) })
      );

      return $bindings;
    }

    return _.get(
      this.templates,
      name
    )({
      keys: _.get(this.rewriters, name),
      $try,
      field,
      props,
    });
  }

  register(bindings: FieldPropsInterface): Bindings {
    _.each(bindings, (val, key) => {
      if (_.isFunction(val)) _.merge(this.templates, { [key]: val });
      if (_.isPlainObject(val)) _.merge(this.rewriters, { [key]: val });
    });

    return this;
  }
}
