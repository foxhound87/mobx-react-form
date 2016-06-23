import { action, observable, computed, isObservableArray } from 'mobx';
import _ from 'lodash';

export default class Field {

  form;
  key;
  name;
  label;
  @observable $value;
  @observable interacted = false;
  @observable disabled = false;
  @observable valid = false;
  @observable errorMessage = null;
  // @observable interactive = true;
  originalErrorMessage = null;
  validateFunction = null;

  constructor(form, key, obj = {}) {
    this.initField(key, form, obj);
    this.validate(true, false);
  }

  @action
  initField(key, form, obj) {
    this.key = key;
    this.form = form;

    /**
      Assume the obj is a plain value.
      Example:

        {
          username: 'test',
          password: '12345',
        }
    */
    if (!_.isObject(obj)) {
      this.name = key;
      this.label = key;
      this.$value = obj; // the object IS the value here!
      this.originalValue = obj; // the object IS the value here!
      return;
    }

    /**
      Assume the obj is an object.
      Example:

        {
          username: {
            value: 'test';
            label: 'Username',
            message: 'This is a message!'
            validate: (field, fields) => {},
          },
        }
    */
    const { name, label, value, disabled, message, validate } = obj;
    this.$value = value || '';
    this.originalValue = value || '';
    this.name = name || key;
    this.label = label || key;
    this.disabled = disabled || false;
    this.originalErrorMessage = message;
    this.validateFunction = validate || (() => Promise.resolve());
  }

  get isValid() {
    return this.valid;
  }

  @computed
  get value() {
    if (isObservableArray(this.$value)) {
      return [].slice.call(this.$value);
    }
    return this.$value;
  }

  @action
  setValue(val) {
    if (!this.interacted) this.interacted = true;
    if (this.$value === val) return;
    this.$value = val;
    this.validate();
  }

  @action
  clear() {
    if (!_.isBoolean(this.$value)) this.$value = null;
    this.interacted = true;
    this.setInvalid(false);
  }

  @action
  reset() {
    if (!_.isBoolean(this.$value)) this.$value = this.originalValue;
    this.interacted = true;
    this.setInvalid(false);
  }

  @action
  setValid() {
    this.valid = true;
    this.errorMessage = null;
  }

  @action
  setInvalid(showErrors = true) {
    if (!_.isBoolean(this.$value)) this.valid = false;
    this.errorMessage = showErrors ? this.originalErrorMessage : null;
  }

  @action
  setInvalidWithMessage(message, showErrors = true) {
    this.valid = false;
    this.errorMessage = showErrors ? message : null;
  }

  @action
  validate(force = false, showErrors = true) {
    // not execute if no valid function or ajv rules
    if (!this.validateFunction && !this.form.ajvValidate) return false;

    // invalidate if not forced and not interacted with field
    if (!force && !this.interacted) return this.setInvalid(showErrors);

    // Use "ajv" Rules
    if (this.form.ajvValidate) return this.handleAjvValidationRules(showErrors);

    // Use "validate" Function
    if (this.validateFunction) return this.handleValidateFunction(showErrors);

    return false;
  }

  @action
  handleAjvValidationRules(showErrors) {
    // const values = this.form.values();
    const validate = this.form.ajvValidate;
    const formIsValid = validate({ [this.name]: this.$value });

    if (!formIsValid) {
      // find current field error message from ajv errors
      const fieldErrorObj = _.find(validate.errors, (item) =>
        _.includes(item.dataPath, `.${this.name}`));

      // if fieldErrorObj is not undefined, the current field is valid.
      if (!_.isUndefined(fieldErrorObj)) {
        // the current field is now invalid
        // add additional info to the message
        const message = `${this.label} ${fieldErrorObj.message}`;
        // invalidate the current field with message
        this.setInvalidWithMessage(message, showErrors);
        return;
      }

      this.setValid();
      return;
    }

    this.setValid();
    return;
  }

  handleValidateFunction(showErrors) {
    const res = this.validateFunction(this, this.form.fields);

    /**
      Handle "simple" Custom Rule
    */
    if (_.isBoolean(res)) {
      // the function returned a boolean, we assume it is the flag for the valid state
      if (res === true) this.setValid();
      if (res === false) this.setInvalid(showErrors);
      return;
    }

    /**
      Handle "promise" Custom Rule
    */
    const p = Promise.resolve(res);
    return new Promise((resolve) => p.then( // eslint-disable-line consistent-return
      () => {
        this.setValid();
        resolve(); // we use this to chain validators
      },
      ({ error } = {}) => {
        const message = ((error || '').trim() || this.originalErrorMessage);
        this.setInvalidWithMessage(message, showErrors);
        resolve(); // we use this to chain validators
      }));
  }
}
