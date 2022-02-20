export default interface OptionsModel {
  uniqueId?: Function;
  fallback?: boolean;
  defaultGenericError?: null | string;
  submitThrowsError?: boolean;
  showErrorsOnInit?: boolean;
  showErrorsOnSubmit?: boolean;
  showErrorsOnBlur?: boolean;
  showErrorsOnChange?: boolean;
  showErrorsOnClear?: boolean;
  showErrorsOnReset?: boolean;
  validateOnInit?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnChangeAfterInitialBlur?: boolean;
  validateOnChangeAfterSubmit?: boolean;
  validateDisabledFields?: boolean;
  validateDeletedFields?: boolean;
  validatePristineFields?: boolean;
  strictUpdate?: boolean;
  strictDelete?: boolean;
  softDelete?: boolean;
  retrieveOnlyDirtyValues?: boolean;
  retrieveOnlyEnabledFields?: boolean;
  autoParseNumbers?: boolean;
  validationDebounceWait?: number;
  validationDebounceOptions?: {
    leading?: boolean;
    trailing?: boolean;
  };
  stopValidationOnError?: boolean;
  validationOrder?: undefined | string[];
}
