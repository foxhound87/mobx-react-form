import { each, get, has, isPlainObject, merge } from "lodash";
import { $try } from "./utils";

import { FieldPropsEnum, FieldPropsType } from "./models/FieldProps";
import { BindingsInterface } from "./models/BindingsInterface";

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
      autoComplete: FieldPropsEnum.autoComplete,
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
    each(bindings, (val, key) => {
      if ((typeof val === 'function')) merge(this.templates, { [key]: val });
      if (isPlainObject(val)) merge(this.rewriters, { [key]: val });
    });

    return this;
  }

  load(field: any, name: string = FieldPropsEnum.default, props: FieldPropsType) {
    const args = ({
      keys: get(this.rewriters, FieldPropsEnum.default),
      form: field.state.form,
      field,
      props,
      $try,
    });

    if (has(this.templates, FieldPropsEnum.default)) {
      return get(this.templates, name)(args);
    }

    if (has(this.rewriters, name)) {
      const $bindings = {};

      each(get(this.rewriters, name), ($v, $k) =>
        merge($bindings, { [$v]: $try(props[$k], field[$k]) })
      );

      return $bindings;
    }

    return get(this.templates, name)(args);
  }
}
