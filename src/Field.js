import { observable, computed, isObservableArray } from 'mobx';
import debounce from 'debouncy';
import clsc from 'coalescy';

export default class Field {
  @observable _value;
  @observable _interacted;
  @observable _valid = true;
  @observable errorMessage;
  @observable interactive = true;

  _originalErrorMessage;

  @computed get valid() {
    return this._valid;
  }

  get value() {
    if (isObservableArray(this._value)) {
      return [].slice.call(this._value);
    }
    return this._value;
  }

  set value(val) {
    if (!this._interacted) {
      this._interacted = true;
    }

    if (this._value === val) {
      return;
    }

    this._value = val;

    if (this.interactive) {
      this._debouncedValidation();
    } else {
      this._debounceClearValidation();
    }
  }

  clearValidation() {
    this._valid = true;
    this.errorMessage = '';
  }

  validate(force = false) {
    if (!this._validateFn) {
      return;
    }

    if (!force && !this._interacted) {
      // if we're not forcing the validation
      // and we haven't interacted with the field
      // we asume this field pass the validation status
      this._valid = true;
      this.errorMessage = '';
      return;
    }
    const res = this._validateFn(this, this.model.fields);

    // if the function returned a boolean we assume it is
    // the flag for the valid state
    if (typeof res === 'boolean') {
      this._valid = res;
      this.errorMessage = res ? '' : this._originalErrorMessage;
      return;
    }

    // otherwise we asumme we have received a promise
    const p = Promise.resolve(res);
    return new Promise((resolve) => { // eslint-disable-line consistent-return
      p.then(
        () => {
          this._valid = true;
          this.errorMessage = '';
          resolve(); // we use this to chain validators
        },
        ({ error } = {}) => {
          this.errorMessage = (error || '').trim() || this._originalErrorMessage;
          this._valid = false;
          resolve(); // we use this to chain validators
        });
    });
  }

  constructor(model, value, validatorDescriptor = {}) {
    this.model = model;
    this._originalErrorMessage = validatorDescriptor.errorMessage;
    this._validateFn = validatorDescriptor.fn || (() => Promise.resolve());
    this._debouncedValidation = debounce(this.validate, 300, this);
    this._debounceClearValidation = debounce(this.clearValidation, 300, this);
    this._value = value;
    this.interactive = clsc(validatorDescriptor.interactive, true);
  }
}
