import { observable, action, toJS, extendObservable } from 'mobx';

export default class Options {

  @observable options = {
    defaultGenericError: null,
    alwaysShowDefaultError: false,
    submitThrowsError: true,
    showErrorsOnInit: false,
    showErrorsOnSubmit: true,
    showErrorsOnBlur: true,
    showErrorsOnUpdate: false,
    showErrorsOnClear: false,
    showErrorsOnReset: true,
    validateOnInit: true,
    validateOnChange: true,
    strictUpdate: false,
    strictDelete: true,
    retrieveOnlyDirtyValues: false,
    retrieveAlsoDisabledFields: true,
    autoParseNumbers: false,
    allowRequired: false,
    validationDebounceWait: 250,
    validationDebounceOptions: { leading: true },
  };

  get(key = null) {
    if (key) return this.options[key];
    return toJS(this.options);
  }

  @action
  set(options) {
    extendObservable(this.options, options);
  }
}
