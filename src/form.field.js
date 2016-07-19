import { action, observable, computed, isObservableArray } from 'mobx';
import _ from 'lodash';

export default class Field {

  form;
  key;
  name;
  label;
  @observable $value;
  @observable $valid = false;
  @observable interacted = false;
  @observable disabled = false;
  @observable errorMessage = null;
  originalValue = null;
  originalErrorMessage = null;
  validateProperty = null;
  silent = null;

  constructor(form, key, obj = {}) {
    this.initField(key, form, obj);
    this.validate(false, false);
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
    this.originalErrorMessage = message || null;
    this.validateProperty = validate || (() => Promise.resolve());
  }

  @computed
  get isValid() {
    return this.$valid;
  }

  @computed
  get isDirty() {
    return this.originalValue !== this.$value;
  }

  @computed
  get value() {
    if (isObservableArray(this.$value)) {
      return [].slice.call(this.$value);
    }
    return this.$value;
  }

  getValue() {
    return this.$value;
  }

  @action
  setValue(val) {
    if (!this.interacted) this.interacted = true;
    if (this.$value === val) return;
    this.$value = val;
    this.validate();
  }

  getMessage() {
    return this.errorMessage;
  }

  @action
  clear() {
    if (_.isBoolean(this.$value)) return;
    if (_.isString(this.$value)) this.$value = '';
    this.interacted = false;
    this.setInvalid(false);
    this.silent = true;
  }

  @action
  reset() {
    if (!_.isBoolean(this.$value)) this.$value = this.originalValue;
    this.interacted = false;
    this.setInvalid(false);
  }

  @action
  update(obj) {
    this.$value = obj;
    return;
  }

  @action
  setValid() {
    this.$valid = true;
    this.errorMessage = null;
  }

  @action
  setInvalid(showErrors = true) {
    if (!_.isBoolean(this.$value)) this.$valid = false;
    this.errorMessage = showErrors ? this.originalErrorMessage : null;
  }

  @action
  setInvalidWithMessage(message, showErrors = true) {
    this.$valid = false;
    this.errorMessage = showErrors ? message : null;
  }

  @action
  validate(force = false, showErrors = true) {
    // exit on silent mode (on reset and clear)
    if (this.silent === true) {
      this.silent = false;
      return;
    }

    // not execute if no valid function or ajv rules
    if (!this.validateProperty || !this.form.ajvValidate) return;

    // invalidate field if validation not forced and not yet interacted with field
    if (!force && !this.interacted) {
      this.setInvalid(showErrors);
      return;
    }

    // Use "ajv" Rules
    if (this.form.ajvValidate) this.handleAjvValidationRules(showErrors);

    // Use "validate" Function
    if (this.validateProperty) this.handleValidateProperty(showErrors);
  }

  @action
  handleAjvValidationRules(showErrors) {
    const validate = this.form.ajvValidate;
    const formIsValid = validate({ [this.name]: this.$value });

    if (!formIsValid) {
      // find current field error message from ajv errors
      const fieldErrorObj = _.find(validate.errors, (item) =>
        _.includes(item.dataPath, `.${this.name}`));

      // if fieldErrorObj is not undefined, the current field is invalid.
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

  handleValidateProperty(showErrors) {
    const $validator = this.validateProperty;

    // check if is an array of validator functions
    if (_.isArray($validator)) {
      // loop validation functions
      _.forEach($validator, ($fn) => {
        if (_.isFunction($fn)) this.handleValidateFunction($fn, showErrors);
      });
    }

    // if it's not an array, it's a function
    if (_.isFunction($validator)) {
      return this.handleValidateFunction($validator, showErrors);
    }

    return false;
  }

  handleValidateFunction($validator, showErrors) {
    const res = $validator(this, this.form.fields);

    /**
      Handle "array"
    */
    if (_.isArray(res)) {
      const isValid = res[0] || false;
      const message = res[1] || 'Error';
      if (isValid === true) this.setValid();
      if (isValid === false) {
        this.setInvalidWithMessage(message, showErrors);
      }
    }

    /**
      Handle "boolean"
    */
    if (_.isBoolean(res)) {
      // the function returned a boolean, we assume it is the flag for the valid state
      if (res === true) this.setValid();
      if (res === false) this.setInvalid(showErrors);
      return;
    }

    /**
      Handle "promise"
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
