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
  init($fields: any): void;
  invalidate(message?: string | null): void;
  showErrors(show: boolean): void;
  clear(): void;
  reset(): void;

  makeField(data: FieldConstructor): FieldInterface;
}

export interface FieldsDefinitions {
  struct?: string[];
  fields?: any;
  values?: any;
  labels?: any;
  placeholders?: any;
  initials?: any;
  defaults?: any;
  disabled?: any;
  related?: any;
  options?: any;
  extra?: any;
  types?: any;
  input?: any;
  output?: any;
  bindings?: any;
  observers?: any;
  interceptors?: any;
  validatedWith?: any;
  hooks?: any;
  handlers?: any;
  validators?: any;
  rules?: any;
}

export interface FormConfig {
  name?: string;
  options?: OptionsModel;
  plugins?: ValidationPlugins;
  bindings?: any;
  hooks?: any;
  handlers?: any;
}
