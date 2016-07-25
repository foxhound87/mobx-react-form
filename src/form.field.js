import { action, observable, computed, isObservableArray, toJS } from 'mobx';
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
  silent = null;
  originalValue = null;
  originalErrorMessage = null;
  validateProperty = null;
  validationFunctionsValues = [];

  constructor(key, field = {}, opt = {}) {
    this.initField(key, field, opt);
  }


  @action
  initField(key, field, opt) {
    this.key = key;

    // overwrite none/some/any class properties
    _.forEach(opt, ($v, $k) => { this[$k] = $v; });

    /**
      Assume the field is an array, a boolean, a string or a number
      Example:

        {
          username: 'test',
          password: '12345',
        }
    */
    if (
    _.isBoolean(field) ||
    _.isArray(field) ||
    _.isString(field) ||
    _.isNumber(field)) {
      /* The field IS the value here */
      this.name = key;
      this.label = key;
      this.$value = field;
      this.originalValue = field;
      return;
    }

    /**
      Assume the field is an object.
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
    if (_.isObject(field)) {
      const { value, name, label, disabled, message, validate, related } = field;
      this.$value = value || '';
      this.originalValue = value || '';
      this.name = name || key;
      this.label = label || key;
      this.originalErrorMessage = message;
      this.validateProperty = toJS(validate) || null;
      this.disabled = disabled || false;
      this.related = related || [];
      return;
    }

    throw new Error(`
      The field ${this.key} should be an object
      , an array, a boolean, a string or a number.
    `);
  }


  @computed
  get isValid() {
    return this.$valid;
  }

  @computed
  get isDirty() {
    const valueChanged = (this.originalValue !== this.$value);
    return valueChanged || this.interacted;
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
    this.setValue(obj);
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
  validate(force = false, showErrors = true, form = null) {
    if (form) this.form = form;

    // exit on silent mode (on reset and clear)
    if (this.silent === true) {
      this.silent = false;
      return;
    }

    // not execute if no valid function or ajv rules
    if (!this.validateProperty && !this.form.ajv) {
      this.setValid();
      return;
    }

    // Use "ajv" Rules
    if (this.form.ajv) this.handleAjvValidationRules(showErrors);

    // Use "validate" Function
    if (this.validateProperty) this.handleValidateProperty(showErrors);
  }

  @action
  handleAjvValidationRules(showErrors) {
    const validate = this.form.ajv;
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
    }

    this.setValid();
    return;
  }

  handleValidateProperty(showErrors) {
    // reset this.handleValidateFunction;
    this.validationFunctionsValues = [];
    // get validators from validate property
    const $validator = toJS(this.validateProperty);

    // check if is a validator function
    if (_.isFunction($validator)) {
      const res = this.handleValidateFunction($validator, showErrors);
      this.validationFunctionsValues.push({ valid: res[0], message: res[1] });
    }

    // check if is an array of validator functions
    if (_.isArray($validator)) {
      // loop validation functions
      _.forEach($validator, ($fn) => {
        if (_.isFunction($fn)) {
          const res = this.handleValidateFunction($fn);
          this.validationFunctionsValues.push({ valid: res[0], message: res[1] });
        }
      });
    }

    const isValid = this.checkValidateFunctions();

    if (isValid && this.$valid) {
      // if all the rules are valid, mark the field as valid
      this.setValid();
      return;
    }

    if (!isValid) {
      // otherwise loop until find an error message to show
      _.forEach(this.validationFunctionsValues, (rule) => {
        if (rule.valid === false) {
          this.setInvalidWithMessage(rule.message, showErrors);
          return;
        }
      });
    }
  }

  handleValidateFunction($validator) {
    const res = $validator(this, this.form.fields);

    /**
      Handle "array"
    */
    if (_.isArray(res)) {
      const isValid = res[0] || false;
      const message = res[1] || 'Error';
      return [isValid, message];
    }

    /**
      Handle "boolean"
    */
    if (_.isBoolean(res)) {
      return [res, 'Error'];
    }

    return [false, 'Error'];
  }

  checkValidateFunctions() {
    return _.every(this.validationFunctionsValues, 'valid');
  }
}
