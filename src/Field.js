import { action, observable, computed, isObservableArray, toJS } from 'mobx';
import _ from 'lodash';

export default class Field {

  key;
  name;
  label;
  rules;
  validate;

  @observable $value;
  @observable interacted = false;
  @observable disabled = false;

  @observable validationErrorStack = [];
  @observable asyncErrorMessage = null;
  @observable errorMessage = null;
  @observable showError = true;

  @observable validationFunctionsData = [];
  @observable validationAsyncData = {};

  defaultValue = null;
  initialValue = null;

  constructor(key, field = {}) {
    this.initField(key, field);
  }

  @action
  initField(key, field) {
    this.key = key;

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
      this.initialValue = this.parseInitialValue(field);
      this.defaultValue = this.initialValue;
      this.$value = this.initialValue;
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
      const { name, label, disabled, rules, validate, related } = field;
      this.initialValue = this.parseInitialValue(field.value);
      this.defaultValue = this.parseDefaultValue(field.default);
      this.$value = this.initialValue;
      this.name = name || key;
      this.label = label || key;
      this.rules = rules || null;
      this.validate = toJS(validate) || null;
      this.disabled = disabled || false;
      this.related = related || [];
      return;
    }
  }

  parseInitialValue(value) {
    // handle boolean
    if (_.isBoolean(value)) return value;
    // handle others types
    return !_.isUndefined(value) ? value : '';
  }

  parseDefaultValue($default) {
    return !_.isUndefined($default) ? $default : this.initialValue;
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
  setValue(newVal) {
    if (!this.interacted) this.interacted = true;
    if (this.$value === newVal) return;
    // handle numbers
    if (_.isNumber(this.initialValue)) {
      const numericVal = _.toNumber(newVal);
      if (!_.isString(numericVal) && !_.isNaN(numericVal)) {
        this.$value = numericVal;
        return;
      }
    }
    // handle other types
    this.$value = newVal;
  }

  @action
  setInvalid(message, async = false) {
    if (async === true) {
      this.asyncErrorMessage = message;
      return;
    }

    if (_.isArray(message)) {
      this.validationErrorStack = message;
      return;
    }

    this.validationErrorStack.unshift(message);
  }

  @action
  resetValidation() {
    this.showError = true;
    this.errorMessage = null;
    this.asyncErrorMessage = null;
    this.validationAsyncData = {};
    this.validationFunctionsData = [];
    this.validationErrorStack = [];
  }

  @action
  setValidationAsyncData(obj = {}) {
    this.validationAsyncData = obj;
  }

  @action
  clear() {
    this.interacted = false;
    this.resetValidation();
    if (isObservableArray(this.$value)) this.$value = [];
    if (_.isBoolean(this.$value)) this.$value = false;
    if (_.isNumber(this.$value)) this.$value = 0;
    if (_.isString(this.$value)) this.$value = '';
  }

  @action
  reset() {
    const useDefaultValue = (this.defaultValue !== this.initialValue);
    if (useDefaultValue) this.setValue(this.defaultValue);
    if (!useDefaultValue) this.setValue(this.initialValue);
    this.interacted = false;
  }

  @action
  update(obj) {
    this.setValue(obj);
  }

  @action
  showErrors(showErrors = true) {
    if (showErrors === false) {
      this.showError = false;
      return;
    }

    this.errorMessage = _.head(this.validationErrorStack);
    this.validationErrorStack = [];
  }

  @action
  showAsyncErrors() {
    if (this.validationAsyncData.valid === false) {
      this.asyncErrorMessage = this.validationAsyncData.message;
      return;
    }
    this.asyncErrorMessage = null;
  }

  @computed
  get default() {
    return this.defaultValue;
  }

  @computed
  get initial() {
    return this.initialValue;
  }

  @computed
  get error() {
    if (this.showError === false) return null;
    return (this.asyncErrorMessage || this.errorMessage);
  }

  @computed
  get hasError() {
    return (!_.isEmpty(this.validationAsyncData)
      && (this.validationAsyncData.valid === false))
      || (this.validationErrorStack.length !== 0)
      || _.isString(this.asyncErrorMessage)
      || _.isString(this.errorMessage);
  }

  @computed
  get isValid() {
    return !this.hasError;
  }

  @computed
  get isDirty() {
    return (this.defaultValue !== this.$value);
  }

  @computed
  get isPristine() {
    return (this.defaultValue === this.$value);
  }

  @computed
  get isDefault() {
    return (this.defaultValue === this.$value);
  }

  @computed
  get isEmpty() {
    if (_.isNumber(this.$value)) return false;
    if (_.isBoolean(this.$value)) return !this.$value;
    return _.isEmpty(this.$value);
  }

  sync = (e) => {
    // assume "e" is the value
    if (_.isUndefined(e.target)) {
      this.setValue(e);
      return;
    }

    // checkbox
    if (_.isBoolean(this.$value) && _.isBoolean(e.target.checked)) {
      this.setValue(e.target.checked);
      return;
    }

    // text
    this.setValue(e.target.value);
    return;
  }
}
