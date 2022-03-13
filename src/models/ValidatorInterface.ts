import FieldInterface from "./FieldInterface";
import StateInterface from "./StateInterface";

export default interface ValidatorInterface {
  promises: Promise<any>[];
  form: any;
  drivers: any;
  plugins: ValidationPlugins;
  error: string | null;
  initDrivers(): void;
  validate(opt?: any, obj?: any): Promise<any>;
  validateField(opt: any): void;
  validateRelatedFields(field: any, showErrors: boolean): void;
  checkSVKValidationPlugin(): void;
}

export interface ValidationPlugins {
  vjf?: any;
  dvr?: any;
  svk?: any;
  yup?: any;
}

export interface ValidationPluginConstructor {
  config: any;
  state: StateInterface;
  promises: Promise<unknown>[];
}

export interface ValidationPluginInterface extends ValidationPluginConstructor {
  extend: any;
  validator: any;
  schema?: any;
  validate(field: FieldInterface);
}

export interface DriversMap {
  [index: string]: ValidationPluginInterface;
}
