import { action, observable, computed, isObservableArray, toJS, asMap } from 'mobx';
import _ from 'lodash';

import fieldsInitializer from './FieldsInit';
import fieldHelpers from './FieldHelpers';

export default class Field {

  fields = asMap({});

  path;
  key;
  name;

  $rules;
  $validate;
  $related;
  @observable $label;
  @observable $value;
  @observable $disabled = false;

  @observable errorSync = null;
  @observable errorAsync = null;

  @observable showError = true;

  @observable validationErrorStack = [];
  @observable validationFunctionsData = [];
  @observable validationAsyncData = {};

  defaultValue = undefined;
  initialValue = undefined;
  interacted = false;

  constructor(key, path, field = {}, obj = {}) {
    this.assignFieldHelpers();
    this.setupField(key, path, field, obj);
    // init nested fields
    if (_.has(field, 'fields')) {
      this.assignFieldsInitializer();
      this.initNestedFields(field.fields);
    }
  }

  assignFieldHelpers() {
    Object.assign(this, fieldHelpers(this));
  }

  assignFieldsInitializer() {
    Object.assign(this, fieldsInitializer(this));
  }

  @action
  initNestedFields(fields) {
    this.initFields({ fields });
  }

  @action
  setupField($key, $path, $field, {
    $value = null,
    $label = null,
    $default = null,
    $disabled = null,
    $related = null,
    $validate = null,
    $rules = null,
  } = {}) {
    this.key = $key;
    this.path = $path;

    /**
      Assume the field is an array, a boolean, a string or a number
      Example:

        {
          username: 'test',
          password: '12345',
        }
    */
    if (
    _.isBoolean($field) ||
    _.isArray($field) ||
    _.isString($field) ||
    _.isNumber($field)) {
      /* The field IS the value here */
      this.name = $key;
      this.initialValue = this.parseInitialValue($field, $value);
      this.defaultValue = this.parseDefaultValue($field.default, $default);
      this.$value = this.initialValue;
      this.$label = $label || $key;
      this.$rules = $rules || null;
      this.$disabled = $disabled || false;
      this.$related = $related || [];
      this.$validate = toJS($validate || null);
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
    if (_.isObject($field)) {
      const { name, label, disabled, rules, validate, related } = $field;
      this.initialValue = this.parseInitialValue($field.value, $value);
      this.defaultValue = this.parseDefaultValue($field.default, $default);
      this.name = name || $key;
      this.$value = this.initialValue;
      this.$label = $label || label || this.name;
      this.$rules = $rules || rules || null;
      this.$disabled = $disabled || disabled || false;
      this.$related = $related || related || [];
      this.$validate = toJS($validate || validate || null);
      return;
    }
  }

  parseInitialValue(unified, separated) {
    if (separated === 0) return separated;
    const $value = separated || unified;
    // handle boolean
    if (_.isBoolean($value)) return $value;
    // handle others types
    return !_.isUndefined($value) ? $value : '';
  }

  parseDefaultValue(initial, separated) {
    if (separated === 0) return separated;
    const $value = separated || initial;
    return !_.isUndefined($value) ? $value : this.initialValue;
  }

  /* ------------------------------------------------------------------ */
  /* ACTIONS */

  /**
    Add Field
  */
  @action
  add(fields = null) {
    if (!fields) {
      const $n = _.random(999, 9999);
      this.initField($n, [this.path, $n].join('.'));
      return;
    }

    this.initFields({ fields });
  }

  /**
    Del Field
  */
  @action
  del(key = null) {
    this.fields.delete(key);
  }

  @action
  setInvalid(message, async = false) {
    if (async === true) {
      this.errorAsync = message;
      return;
    }

    if (_.isArray(message)) {
      this.validationErrorStack = message;
      return;
    }

    this.validationErrorStack.unshift(message);
  }

  @action
  setValidationAsyncData(obj = {}) {
    this.validationAsyncData = obj;
  }

  @action
  resetValidation(deep = false) {
    this.showError = true;
    this.errorSync = null;
    this.errorAsync = null;
    this.validationAsyncData = {};
    this.validationFunctionsData = [];
    this.validationErrorStack = [];

    // recursive resetValidation
    if (deep) this.deepAction('resetValidation', this.fields);
  }

  @action
  clear(deep = false) {
    this.interacted = false;
    this.resetValidation();
    if (isObservableArray(this.$value)) this.$value = [];
    if (_.isBoolean(this.$value)) this.$value = false;
    if (_.isNumber(this.$value)) this.$value = 0;
    if (_.isString(this.$value)) this.$value = '';

    // recursive clear fields
    if (deep) this.deepAction('clear', this.fields);
  }

  @action
  reset(deep = false) {
    const useDefaultValue = (this.defaultValue !== this.initialValue);
    if (useDefaultValue) this.value = this.defaultValue;
    if (!useDefaultValue) this.value = this.initialValue;
    this.interacted = false;

    // recursive clear fields
    if (deep) this.deepAction('reset', this.fields);
  }

  @action
  showErrors(showErrors = true) {
    if (showErrors === false) {
      this.showError = false;
      return;
    }

    this.errorSync = _.head(this.validationErrorStack);
    this.validationErrorStack = [];
  }

  @action
  showAsyncErrors() {
    if (this.validationAsyncData.valid === false) {
      this.errorAsync = this.validationAsyncData.message;
      return;
    }
    this.errorAsync = null;
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  @computed
  get value() {
    if (isObservableArray(this.$value)) {
      return [].slice.call(this.$value);
    }
    return this.$value;
  }

  set value(newVal) {
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

  @computed
  get label() {
    return this.$label;
  }

  @computed
  get related() {
    return this.$related;
  }

  @computed
  get disabled() {
    return this.$disabled;
  }

  @computed
  get default() {
    return this.defaultValue;
  }

  @computed
  get rules() {
    return this.$rules;
  }

  @computed
  get validate() {
    return this.$validate;
  }

  @computed
  get initial() {
    return this.initialValue;
  }

  @computed
  get error() {
    if (this.showError === false) return null;
    return (this.errorAsync || this.errorSync);
  }

  @computed
  get hasError() {
    return (!_.isEmpty(this.validationAsyncData)
      && (this.validationAsyncData.valid === false))
      || (this.validationErrorStack.length !== 0)
      || _.isString(this.errorAsync)
      || _.isString(this.errorSync);
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

  /* ------------------------------------------------------------------ */
  /* EVENTS */

  sync = (e) => {
    // assume "e" is the value
    if (_.isUndefined(e.target)) {
      this.value = e;
      return;
    }

    // checkbox
    if (_.isBoolean(this.$value) && _.isBoolean(e.target.checked)) {
      this.value = e.target.checked;
      return;
    }

    // text
    this.value = e.target.value;
    return;
  };

  /**
    Event: On Clear
  */
  onClear = (e) => {
    e.preventDefault();
    this.clear(true);
  };

  /**
    Event: On Reset
  */
  onReset = (e) => {
    e.preventDefault();
    this.reset(true);
  };

  /**
    Event: On Add
  */
  onAdd = (e, data) => {
    e.preventDefault();
    this.add(data);
  };

  /**
    Event: On Del
  */
  onDel = (e, key) => {
    e.preventDefault();
    this.del(key);
  };
}
