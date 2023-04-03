import { FieldPropsEnum, FieldPropsOccurrence, SeparatedPropsMode } from "./models/FieldProps";

export interface PropsGroupsInterface {
  editable: string[];
  handlers: string[];
  computed: string[];
  functions: string[];
  validation: string[];
  exceptions: string[];
  separated: string[];
  occurrences: {
    [index: string]: "some" | "every";
  };
}

export const props: PropsGroupsInterface = {
  editable: [
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
    FieldPropsEnum.disabled,
    FieldPropsEnum.autoFocus,
    FieldPropsEnum.inputMode,
    FieldPropsEnum.ref,
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
    FieldPropsEnum.validating,
    FieldPropsEnum.submitting,
    FieldPropsEnum.resetting,
    FieldPropsEnum.clearing,
    FieldPropsEnum.blurred,
    FieldPropsEnum.deleted,
    FieldPropsEnum.disabled,
  ],
  separated: [
    SeparatedPropsMode.values,
    SeparatedPropsMode.labels,
    SeparatedPropsMode.placeholders,
    SeparatedPropsMode.defaults,
    SeparatedPropsMode.initials,
    SeparatedPropsMode.disabled,
    SeparatedPropsMode.deleted,
    SeparatedPropsMode.types,
    SeparatedPropsMode.related,
    SeparatedPropsMode.rules,
    SeparatedPropsMode.options,
    SeparatedPropsMode.bindings,
    SeparatedPropsMode.extra,
    SeparatedPropsMode.hooks,
    SeparatedPropsMode.handlers,
    SeparatedPropsMode.validatedWith,
    SeparatedPropsMode.validators,
    SeparatedPropsMode.observers,
    SeparatedPropsMode.interceptors,
    SeparatedPropsMode.input,
    SeparatedPropsMode.output,
    SeparatedPropsMode.autoFocus,
    SeparatedPropsMode.inputMode,
    SeparatedPropsMode.refs,
  ],
  functions: [
    FieldPropsEnum.observers,
    FieldPropsEnum.interceptors,
    FieldPropsEnum.input,
    FieldPropsEnum.output,
  ],
  validation: [
    FieldPropsEnum.rules,
    FieldPropsEnum.validators,
    FieldPropsEnum.validatedWith,
  ],
  exceptions: [
    FieldPropsEnum.isDirty,
    FieldPropsEnum.isPristine
  ],
  occurrences: {
    isDirty: FieldPropsOccurrence.some,
    isPristine: FieldPropsOccurrence.every,
    isDefault: FieldPropsOccurrence.every,
    isValid: FieldPropsOccurrence.every,
    isEmpty: FieldPropsOccurrence.every,
    hasError: FieldPropsOccurrence.some,
    focused: FieldPropsOccurrence.some,
    blurred: FieldPropsOccurrence.some,
    touched: FieldPropsOccurrence.some,
    deleted: FieldPropsOccurrence.every,
    disabled: FieldPropsOccurrence.every,
    clearing: FieldPropsOccurrence.every,
    resetting: FieldPropsOccurrence.every,
  },
};
