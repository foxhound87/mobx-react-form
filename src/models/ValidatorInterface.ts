import {FieldInterface} from "./FieldInterface";
import {FormInterface} from "./FormInterface";
import {StateInterface} from "./StateInterface";

export interface ValidatorInterface {
  promises: Promise<any>[];
  form: FormInterface;
  drivers: any;
  plugins: ValidationPlugins;
  error: string | null;
  initDrivers(): void;
  validate(opt?: any, obj?: any): Promise<any>;
  validateField(opt: {
    showErrors: boolean,
    related: boolean,
    field: FieldInterface,
    path: string,
  }): void;
  validateRelatedFields(field: any, showErrors: boolean): void;
  checkSVKValidationPlugin(): void;
}

export type ValidationPlugin  = {
  class: any,
  config?: ValidationPluginConfig,
};

export interface ValidationPlugins {
  vjf?: ValidationPlugin;
  dvr?: ValidationPlugin;
  svk?: ValidationPlugin;
  yup?: ValidationPlugin;
  zod?: ValidationPlugin;
}

export type ValidationPackage = any;

export type ExtendPlugin = ({ validator, form }: {
  validator: any, // the plugin instance
  form: FormInterface
}) => void;

export interface ValidationPluginConfig {
  package: ValidationPackage;
  schema?: any;
  options?: any;
  extend?: ExtendPlugin;
}

export interface ValidationPluginConstructor {
  config: ValidationPluginConfig;
  state: StateInterface;
  promises: Promise<unknown>[];
}

export interface ValidationPluginInterface extends ValidationPluginConstructor {
  validator: ValidatorInterface;
  schema?: any;
  extend?: ExtendPlugin;
  validate(field: FieldInterface);
  class?(constructor: ValidationPluginConstructor): void;
}

export type DriversMap = {
  [key in keyof ValidationPlugins]: ValidationPluginInterface;
}

export enum ValidationHooks {
  onSuccess = 'onSuccess',
  onError = 'onError',
}

export default ValidatorInterface;