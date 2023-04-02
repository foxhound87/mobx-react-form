import _ from "lodash";
import { $try } from "./utils";

import { FieldPropsEnum, FieldPropsType } from "./models/FieldProps";
import BindingsInterface from "./models/BindingsInterface";

export default class Bindings implements BindingsInterface {
  templates = {
    // default: ({ field, form, props, keys, $try }) => ({
    //   [keys.id]: $try(props.id, field.id),
    // }),
  };

  rewriters = {
    default: {
      id: FieldPropsEnum.id,
      name: FieldPropsEnum.name,
      type: FieldPropsEnum.type,
      value: FieldPropsEnum.value,
      checked: FieldPropsEnum.checked,
      label: FieldPropsEnum.label,
      placeholder: FieldPropsEnum.placeholder,
      disabled: FieldPropsEnum.disabled,
      onChange: FieldPropsEnum.onChange,
      onBlur: FieldPropsEnum.onBlur,
      onFocus: FieldPropsEnum.onFocus,
      autoFocus: FieldPropsEnum.autoFocus,
      inputMode: FieldPropsEnum.inputMode,
      onKeyUp: FieldPropsEnum.onKeyUp,
      onKeyDown: FieldPropsEnum.onKeyDown,
    },
  };

  register(bindings: FieldPropsType): Bindings {
    _.each(bindings, (val, key) => {
      if (_.isFunction(val)) _.merge(this.templates, { [key]: val });
      if (_.isPlainObject(val)) _.merge(this.rewriters, { [key]: val });
    });

    return this;
  }

  load(field: any, name: string = FieldPropsEnum.default, props: FieldPropsType) {
    const args = ({
      keys: _.get(this.rewriters, FieldPropsEnum.default),
      form: field.state.form,
      field,
      props,
      $try,
    });

    if (_.has(this.templates, FieldPropsEnum.default)) {
      return _.get(this.templates, name)(args);
    }

    if (_.has(this.rewriters, name)) {
      const $bindings = {};

      _.each(_.get(this.rewriters, name), ($v, $k) =>
        _.merge($bindings, { [$v]: $try(props[$k], field[$k]) })
      );

      return $bindings;
    }

    return _.get(this.templates, name)(args);
  }
}
