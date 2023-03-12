import {
  observable,
  action,
  toJS,
  extendObservable,
  set,
  makeObservable,
} from "mobx";

import _ from "lodash";

import { uniqueId } from "./utils";

import OptionsModel from "./models/OptionsModel";
import OptionsInterface from "./models/OptionsInterface";

export default class Options implements OptionsInterface {
  options: OptionsModel = {
    uniqueId,
    fallback: true,
    defaultGenericError: null,
    submitThrowsError: true,
    showErrorsOnInit: false,
    showErrorsOnSubmit: true,
    showErrorsOnBlur: true,
    showErrorsOnChange: true,
    showErrorsOnClear: false,
    showErrorsOnReset: true,
    validateOnInit: true,
    validateOnBlur: true,
    validateOnChange: false,
    validateOnChangeAfterInitialBlur: false,
    validateOnChangeAfterSubmit: false,
    validateOnClear: false,
    validateOnReset: false,
    validateDisabledFields: false,
    validateDeletedFields: false,
    validatePristineFields: true,
    strictUpdate: false,
    strictDelete: true,
    softDelete: false,
    retrieveOnlyDirtyFieldsValues: false,
    retrieveOnlyEnabledFieldsValues: false,
    retrieveOnlyEnabledFieldsErrors: false,
    autoParseNumbers: false,
    removeNullishValuesInArrays: false,
    validationDebounceWait: 250,
    validationDebounceOptions: {
      leading: false,
      trailing: true,
    },
    stopValidationOnError: false,
    validationOrder: undefined,
  };

  constructor() {
    makeObservable(this, {
      options: observable,
      set: action,
    });
  }

  get(key: string, field: any = null): OptionsModel {
    // handle field option
    if (_.has(field, "path")) {
      if (_.has(field.$options, key)) {
        return field.$options[key];
      }
    }

    // fallback on global form options
    if (key) return _.get(this.options, key);
    return toJS(this.options);
  }

  set(options: OptionsModel): void {
    if (set) {
      set(this.options, options);
    } else {
      extendObservable(this.options, options);
    }
  }
}
