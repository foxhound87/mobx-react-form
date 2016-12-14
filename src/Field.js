import { action, observable, computed, isObservableArray, toJS, asMap } from 'mobx';
import _ from 'lodash';
import utils from './utils';

import {
  parseInitialValue,
  parseDefaultValue,
  parseGetLabel } from './parser';

export default class Field {

  fields = asMap({});
  incremental = false;
  isField = true;
  state;
  path;
  name;
  key;
  id;

  $rules;
  $validate;
  $related;

  @observable $value;
  @observable $label;
  @observable $placeholder;
  @observable $default;
  @observable $initial = undefined;
  @observable $disabled = false;
  @observable $focus = false;
  @observable $touched = false;
  @observable $changed = false;

  @observable errorSync = null;
  @observable errorAsync = null;

  @observable showError = true;

  @observable validationErrorStack = [];
  @observable validationFunctionsData = [];
  @observable validationAsyncData = {};

  constructor({ key, path, data = {}, props = {}, update = false, state }) {
    this.state = state;

    this.setupField(key, path, data, props, update);
    this.initNestedFields(data, update);

    if (this.hasIncrementalNestedFields !== false) {
      this.incremental = this.hasIncrementalNestedFields;
    }
  }

  @action
  initNestedFields(field, update) {
    const fields = _.isNil(field) ? '' : field.fields;
    this.initFields({ fields }, update);
  }

  @action
  setupField($key, $path, $data, {
    $value = null,
    $label = null,
    $placeholder = null,
    $default = null,
    $disabled = null,
    $related = null,
    $validate = null,
    $rules = null,
  } = {}, update) {
    this.key = $key;
    this.path = $path;
    this.id = utils.makeId(this.path);

    if (_.isNil($data)) $data = ''; // eslint-disable-line

    if (
    _.isBoolean($data) ||
    _.isArray($data) ||
    _.isString($data) ||
    _.isNumber($data)) {
      /* The field IS the value here */
      this.name = $key;

      this.$initial = parseInitialValue({
        unified: $data,
        separated: $value,
      });

      this.$default = parseDefaultValue({
        unified: update ? '' : $data.default,
        separated: $default,
        initial: this.$initial,
      });

      this.$value = this.$initial;
      this.$label = $label || $key;
      this.$placeholder = $placeholder || '';
      this.$rules = $rules || null;
      this.$disabled = $disabled || false;
      this.$related = $related || [];
      this.$validate = toJS($validate || null);
      return;
    }

    if (_.isObject($data)) {
      const { name, label, placeholder, disabled, rules, validate, related } = $data;

      this.$initial = parseInitialValue({
        unified: $data.value,
        separated: $value,
      });

      this.$default = parseDefaultValue({
        unified: update ? '' : $data.default,
        separated: $default,
        initial: this.$initial,
      });

      this.name = name || $key;
      this.$value = this.$initial;
      this.$label = $label || label || this.name;
      this.$placeholder = $placeholder || placeholder || '';
      this.$rules = $rules || rules || null;
      this.$disabled = $disabled || disabled || false;
      this.$related = $related || related || [];
      this.$validate = toJS($validate || validate || null);
    }
  }

  /* ------------------------------------------------------------------ */
  /* ACTIONS */

  @action
  invalidate(message, async = false) {
    if (async === true) {
      this.errorAsync = message;
      return;
    }

    if (_.isArray(message)) {
      this.validationErrorStack = message;
      this.showErrors(true);
      return;
    }

    this.validationErrorStack.unshift(message);
    this.showErrors(true);
  }

  setInvalid = this.invalidate;

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
  clear(deep = true) {
    this.resetValidation();
    if (isObservableArray(this.$value)) this.$value = [];
    if (_.isBoolean(this.$value)) this.$value = false;
    if (_.isNumber(this.$value)) this.$value = 0;
    if (_.isString(this.$value)) this.$value = '';

    // recursive clear fields
    if (deep && this.fields.size) {
      this.deepAction('clear', this.fields);
    }
  }

  @action
  reset(deep = true) {
    const useDefaultValue = (this.$default !== this.$initial);
    if (useDefaultValue) this.value = this.$default;
    if (!useDefaultValue) this.value = this.$initial;

    // recursive clear fields
    if (deep && this.fields.size) {
      this.deepAction('reset', this.fields);
    }
  }

  @action
  showErrors(showErrors = true) {
    this.showError = showErrors;
    this.errorSync = _.head(this.validationErrorStack);
    // this.validationErrorStack = [];
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

  @computed get hasIncrementalNestedFields() {
    return (utils.hasIntKeys(this.fields) && this.fields.size);
  }

  @computed get hasNestedFields() {
    return (this.fields.size !== 0);
  }

  @computed get value() {
    if (this.incremental || this.hasNestedFields) {
      return this.get('value');
    }

    if (isObservableArray(this.$value)) {
      return [].slice.call(this.$value);
    }

    return toJS(this.$value);
  }

  set value(newVal) {
    if (this.$value === newVal) return;
    // handle numbers
    if (_.isNumber(this.$initial)) {
      const numericVal = _.toNumber(newVal);
      if (!_.isString(numericVal) && !_.isNaN(numericVal)) {
        this.$value = numericVal;
        return;
      }
    }
    // handle other types
    this.$value = newVal;
  }

  @computed get initial() {
    return toJS(this.$initial);
  }

  set initial(val) {
    this.$initial = parseInitialValue({ separated: val });
  }

  @computed get default() {
    return toJS(this.$default);
  }

  set default(val) {
    this.$default = parseDefaultValue({ separated: val });
  }

  @computed get label() {
    return parseGetLabel(this.$label);
  }

  @computed get placeholder() {
    return this.$placeholder;
  }

  @computed get related() {
    return this.$related;
  }

  @computed get disabled() {
    return this.$disabled;
  }

  @computed get rules() {
    return this.$rules;
  }

  @computed get validate() {
    return this.$validate;
  }

  @computed get error() {
    if (this.showError === false) return null;
    return (this.errorAsync || this.errorSync);
  }

  @computed get hasError() {
    return ((this.validationAsyncData.valid === false)
      && !_.isEmpty(this.validationAsyncData))
      || !_.isEmpty(this.validationErrorStack)
      || _.isString(this.errorAsync)
      || _.isString(this.errorSync);
  }

  @computed get isValid() {
    return !this.hasError;
  }

  @computed get isDirty() {
    return this.hasNestedFields
      ? this.check('isDirty', true)
      : !_.isEqual(this.$default, this.value);
  }

  @computed get isPristine() {
    return this.hasNestedFields
      ? this.check('isPristine', true)
      : _.isEqual(this.$default, this.value);
  }

  @computed get isDefault() {
    return this.hasNestedFields
      ? this.check('isDefault', true)
      : _.isEqual(this.$default, this.value);
  }

  @computed get isEmpty() {
    if (this.hasNestedFields) return this.check('isEmpty', true);
    if (_.isBoolean(this.value)) return !!this.$value;
    if (_.isNumber(this.value)) return false;
    return _.isEmpty(this.value);
  }

  @computed get focus() {
    return this.hasNestedFields
      ? this.check('focus', true)
      : this.$focus;
  }

  @computed get touched() {
    return this.hasNestedFields
      ? this.check('touched', true)
      : this.$touched;
  }

  @computed get changed() {
    return this.hasNestedFields
      ? this.check('changed', true)
      : this.$changed;
  }

  /* ------------------------------------------------------------------ */
  /* EVENTS */

  sync = action((e) => {
    this.$changed = true;

    // assume "e" is the value
    if (_.isNil(e.target)) {
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
  });

  onChange = this.sync;
  onToggle = this.sync;

  onFocus = action(() => {
    this.$focus = true;
    this.$touched = true;
  });

  onBlur = action(() => {
    this.$focus = false;
  });


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
  onAdd = (e, val = null) => {
    e.preventDefault();
    this.add(val);
  };

  /**
    Event: On Del
  */
  onDel = (e, path = null) => {
    e.preventDefault();
    this.del(path || this.path);
  };
}
