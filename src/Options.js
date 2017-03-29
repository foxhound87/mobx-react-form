import { observable, action, toJS, extendObservable } from 'mobx';

export default class Options {

  @observable options = {
    defaultGenericError: null,
    submitThrowsError: true,
    showErrorsOnUpdate: true,
    showErrorsOnInit: false,
    alwaysShowDefaultError: false,
    validateOnInit: true,
    validateOnChange: true,
    strictUpdate: false,
    strictDelete: true,
    allowRequired: false,
    autoParseNumbers: false,
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
