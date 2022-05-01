import { FieldPropsEnum } from "./models/FieldProps";

export interface PropsGroupsInterface {
  field: FieldPropsEnum[];
  handlers: FieldPropsEnum[];
  computed: FieldPropsEnum[];
  separated: string[];
  functions: string[];
  validation: string[];
  exceptions: string[];
  types: {
    [index: string]: "some" | "every";
  };
}

export const props: PropsGroupsInterface = {
  field: [
    FieldPropsEnum.type,
    FieldPropsEnum.value,
    FieldPropsEnum.initial,
    FieldPropsEnum.default,
    FieldPropsEnum.label,
    FieldPropsEnum.placeholder,
    FieldPropsEnum.related,
    FieldPropsEnum.options,
    FieldPropsEnum.extra,
    FieldPropsEnum.bindings,
    FieldPropsEnum.hooks,
    FieldPropsEnum.handlers,
    FieldPropsEnum.error,
    FieldPropsEnum.deleted,
  ],
  handlers: [
    FieldPropsEnum.onChange,
    FieldPropsEnum.onToggle,
    FieldPropsEnum.onFocus,
    FieldPropsEnum.onBlur,
    FieldPropsEnum.onDrop,
    FieldPropsEnum.onSubmit,
    FieldPropsEnum.onReset,
    FieldPropsEnum.onClear,
    FieldPropsEnum.onAdd,
    FieldPropsEnum.onDel,
  ],
  computed: [
    FieldPropsEnum.hasError,
    FieldPropsEnum.isValid,
    FieldPropsEnum.isDirty,
    FieldPropsEnum.isPristine,
    FieldPropsEnum.isDefault,
    FieldPropsEnum.isEmpty,
    FieldPropsEnum.focused,
    FieldPropsEnum.touched,
    FieldPropsEnum.changed,
    FieldPropsEnum.resetting,
    FieldPropsEnum.clearing,
    FieldPropsEnum.blurred,
    FieldPropsEnum.deleted,
    FieldPropsEnum.disabled,
  ],
  separated: [
    "values",
    "initials",
    "defaults",
    "labels",
    "placeholders",
    "disabled",
    "related",
    "options",
    "extra",
    "bindings",
    "types",
    "hooks",
    "handlers",
    "deleted",
    "error",
  ],
  functions: ["observers", "interceptors", "input", "output"],
  validation: ["rules", "validators", "validateWith"],
  exceptions: ["isDirty", "isPristine"],
  types: {
    isDirty: "some",
    isPristine: "every",
    isDefault: "every",
    isValid: "every",
    isEmpty: "every",
    hasError: "some",
    focused: "some",
    blurred: "some",
    touched: "some",
    deleted: "every",
    disabled: "every",
    clearing: "every",
    resetting: "every",
  },
};
