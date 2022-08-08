export enum OptionsEnum {
  uniqueId = 'uniqueId',
  fallback = 'fallback',
  defaultGenericError = 'defaultGenericError',
  submitThrowsError = 'submitThrowsError',
  showErrorsOnInit = 'showErrorsOnInit',
  showErrorsOnSubmit = 'showErrorsOnSubmit',
  showErrorsOnBlur = 'showErrorsOnBlur',
  showErrorsOnChange = 'showErrorsOnChange',
  showErrorsOnClear = 'showErrorsOnClear',
  showErrorsOnReset = 'showErrorsOnReset',
  validateOnInit = 'validateOnInit',
  validateOnBlur = 'validateOnBlur',
  validateOnChange = 'validateOnChange',
  validateOnChangeAfterInitialBlur = 'validateOnChangeAfterInitialBlur',
  validateOnChangeAfterSubmit = 'validateOnChangeAfterSubmit',
  validateDisabledFields = 'validateDisabledFields',
  validateDeletedFields = 'validateDeletedFields',
  validatePristineFields = 'validatePristineFields',
  strictUpdate = 'strictUpdate',
  strictDelete = 'strictDelete',
  softDelete = 'softDelete',
  retrieveOnlyDirtyValues = 'retrieveOnlyDirtyValues',
  retrieveOnlyEnabledFields = 'retrieveOnlyEnabledFields',
  autoParseNumbers = 'autoParseNumbers',
  validationDebounceWait = 'validationDebounceWait',
  validationDebounceOptions = 'validationDebounceOptions',
  stopValidationOnError = 'stopValidationOnError',
  validationOrder = 'validationOrder',
}


export default interface OptionsModel {
  [OptionsEnum.uniqueId]?: Function;
  [OptionsEnum.fallback]?: boolean;
  [OptionsEnum.defaultGenericError]?: null | string;
  [OptionsEnum.submitThrowsError]?: boolean;
  [OptionsEnum.showErrorsOnInit]?: boolean;
  [OptionsEnum.showErrorsOnSubmit]?: boolean;
  [OptionsEnum.showErrorsOnBlur]?: boolean;
  [OptionsEnum.showErrorsOnChange]?: boolean;
  [OptionsEnum.showErrorsOnClear]?: boolean;
  [OptionsEnum.showErrorsOnReset]?: boolean;
  [OptionsEnum.validateOnInit]?: boolean;
  [OptionsEnum.validateOnBlur]?: boolean;
  [OptionsEnum.validateOnChange]?: boolean;
  [OptionsEnum.validateOnChangeAfterInitialBlur]?: boolean;
  [OptionsEnum.validateOnChangeAfterSubmit]?: boolean;
  [OptionsEnum.validateDisabledFields]?: boolean;
  [OptionsEnum.validateDeletedFields]?: boolean;
  [OptionsEnum.validatePristineFields]?: boolean;
  [OptionsEnum.strictUpdate]?: boolean;
  [OptionsEnum.strictDelete]?: boolean;
  [OptionsEnum.softDelete]?: boolean;
  [OptionsEnum.retrieveOnlyDirtyValues]?: boolean;
  [OptionsEnum.retrieveOnlyEnabledFields]?: boolean;
  [OptionsEnum.autoParseNumbers]?: boolean;
  [OptionsEnum.validationDebounceWait]?: number;
  [OptionsEnum.validationDebounceOptions]?: {
    leading?: boolean;
    trailing?: boolean;
  };
  [OptionsEnum.stopValidationOnError]?: boolean;
  [OptionsEnum.validationOrder]?: undefined | string[];
}