import BaseInterface from "./BaseInterface";
import FieldInterface, { FieldConstructor } from "./FieldInterface";
import OptionsModel from "./OptionsModel";
import ValidatorInterface, { ValidationPlugins } from "./ValidatorInterface";
export default interface FormInterface extends BaseInterface {
  name: string;
  validator: ValidatorInterface;
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
  disabled: boolean;
  // methods
  // init($fields: any): void;
  invalidate(message?: string | null): void;
  showErrors(show: boolean): void;
  clear(deep?: boolean, execHook?: boolean): void;
  reset(deep?: boolean, execHook?: boolean): void;

  makeField(data: FieldConstructor): FieldInterface;
}

export interface FieldsDefinitions {
  struct?: string[];
  fields?: any;
  computed?: any;
  values?: any;
  labels?: any;
  placeholders?: any;
  defaults?: any;
  initials?: any;
  disabled?: any;
  deleted?: any;
  types?: any;
  related?: any;
  rules?: any;
  options?: any;
  bindings?: any;
  extra?: any;
  hooks?: any;
  handlers?: any;
  validatedWith?: any;
  validators?: any;
  observers?: any;
  interceptors?: any;
  input?: any;
  output?: any;
  autoFocus?: any;
  inputMode?: any;
  refs?: any;
}

export interface FormConfig {
  name?: string;
  options?: OptionsModel;
  plugins?: ValidationPlugins;
  bindings?: any;
  hooks?: any;
  handlers?: any;
}
