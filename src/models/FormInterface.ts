import StateInterface from "./StateInterface";
import ValidatorInterface from "./ValidatorInterface";

export default interface FormInterface {
  name: string | null;
  state: StateInterface;
  validator: ValidatorInterface;
  $hooks: any;
  $handlers: any;
  fields: any;
  debouncedValidation: any;
  // getters
  validatedValues: object;
  clearing: boolean;
  resetting: boolean;
  error: string | null;
  hasError: boolean;
  isValid: boolean;
  isPristine: boolean;
  isDirty: boolean;
  isDefault: boolean;
  isEmpty: boolean;
  focused: boolean;
  touched: boolean;
  changed: boolean;
  disabled: boolean;
  // methods
  init($fields: any): void;
  invalidate(message: string | null): void;
  showErrors(show: boolean): void;
  clear(): void;
  reset(): void;
}
