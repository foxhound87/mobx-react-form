export default interface ValidatorInterface {
  promises: Promise<any>[];
  form: any;
  drivers: any;
  plugins: ValidationPlugins;
  error: string | null;
  initDrivers(): void;
  validate(opt: any, obj?: any): Promise<any>;
  validateField(opt: any): void;
  validateRelatedFields(field: any, showErrors: boolean): void;
  checkSVKValidationPlugin(): void;
}

export interface ValidationPlugins {
  vjf: any;
  dvr: any;
  svk: any;
  yup: any;
}
