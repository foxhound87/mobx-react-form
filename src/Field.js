import { action, observable, computed, isObservableArray, toJS } from 'mobx';
import _ from 'lodash';

export default class Field {

  key;
  name;
  label;
  @observable $value;
  @observable $valid = false;
  @observable interacted = false;
  @observable disabled = false;
  @observable errorMessage = null;
  defaultValue = null;
  initialValue = null;
  originalErrorMessage = null;
  validateProperty = null;
  validationFunctionsData = [];

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
      const { name, label, disabled, message, validate, related } = field;
      this.initialValue = this.parseInitialValue(field.value);
      this.defaultValue = this.parseDefaultValue(field.default);
      this.$value = this.initialValue;
      this.name = name || key;
      this.label = label || key;
      this.originalErrorMessage = message;
      this.validateProperty = toJS(validate) || null;
      this.disabled = disabled || false;
      this.related = related || [];
      return;
    }
  }

  parseInitialValue(value) {
    // handle boolean
    if (_.isBoolean(value)) return value;
    // handle others types
    return !_.isUndefined(value) ? value : null;
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
  setValid() {
    this.$valid = true;
    this.errorMessage = null;
  }

  @action
  setInvalid(showErrors = true) {
    this.$valid = false;
    this.errorMessage = showErrors ? this.originalErrorMessage : null;
  }

  @action
  setInvalidWithMessage(message, showErrors = true) {
    this.$valid = false;
    this.errorMessage = showErrors ? message : null;
  }

  @action
  clear() {
    this.interacted = false;
    if (_.isBoolean(this.$value)) this.$value = false;
    if (_.isString(this.$value)) this.$value = '';
    if (_.isNumber(this.$value)) this.$value = 0;
    this.setInvalid(false);
  }

  @action('reset')
  reset() {
    const useDefaultValue = (this.defaultValue !== this.initialValue);
    if (useDefaultValue) this.$value = this.defaultValue;
    if (!useDefaultValue) this.$value = this.initialValue;
    this.interacted = false;
  }

  @action
  update(obj) {
    this.setValue(obj);
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
    return this.errorMessage;
  }

  @computed
  get hasError() {
    return !this.isValid;
  }

  @computed
  get isValid() {
    return this.$valid;
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
}
