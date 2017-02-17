import { observable, observe, action, computed, isObservableArray, toJS, asMap } from 'mobx';
import _ from 'lodash';
import utils from './utils';

import Base from './Base';

import {
  $try,
  defaultClearValue,
  parseFieldValue,
  parseGetLabel } from './parser';

export default class Field extends Base {

  fields = observable.map ? observable.map({}) : asMap({});
  incremental = false;
  isField = true;
  dispose = null;

  id;
  key;
  name;
  path;
  type;
  state;

  $rules;
  $validate;
  $related;
  $options;

  $parser = $ => $;
  $formatter = $ => $;

  @observable $value = undefined;
  @observable $label = undefined;
  @observable $placeholder = undefined;
  @observable $default = undefined;
  @observable $initial = undefined;
  @observable $bindings = undefined;
  @observable $type = undefined;

  @observable $disabled = false;
  @observable $focus = false;
  @observable $touched = false;
  @observable $changed = false;

  @observable showError = true;

  @observable errorSync = null;
  @observable errorAsync = null;

  @observable validationErrorStack = [];
  @observable validationFunctionsData = [];
  @observable validationAsyncData = {};

  constructor({ key, path, data = {}, props = {}, update = false, state }) {
    super();

    this.state = state;

    this.setupField(key, path, data, props, update);
    this.checkDVRValidationPlugin();
    this.initNestedFields(data, update);

    this.incremental = (this.hasIncrementalNestedFields !== 0);

    this.observe();
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  @computed get checkValidationErrors() {
    return ((this.validationAsyncData.valid === false)
      && !_.isEmpty(this.validationAsyncData))
      || !_.isEmpty(this.validationErrorStack)
      || _.isString(this.errorAsync)
      || _.isString(this.errorSync);
  }

  @computed get hasIncrementalNestedFields() {
    return (utils.hasIntKeys(this.fields) && this.fields.size);
  }

  @computed get hasNestedFields() {
    return (this.fields.size !== 0);
  }

  @computed get value() {
    if (this.incremental || this.hasNestedFields) {
      const value = this.get('value');
      return !_.isEmpty(value) ? value : [];
    }

    if (_.isArray(this.$value) || isObservableArray(this.$value)) {
      return [].slice.call(this.$value);
    }

    return toJS(this.$value);
  }

  set value(newVal) {
    if (this.$value === newVal) return;
    // handle numbers
    if (this.state.options.get('autoParseNumbers') === true) {
      if (_.isNumber(this.$initial)) {
        if (!_.endsWith(newVal, '.') && !_.endsWith(_.split(newVal, '.', 2)[1], '0')) {
          const numericVal = _.toNumber(newVal);
          if (!_.isString(numericVal) && !_.isNaN(numericVal)) {
            this.$value = numericVal;
            return;
          }
        }
      }
    }
    // handle parse value
    this.$value = newVal;
  }

  @computed get initial() {
    return toJS(this.$initial);
  }

  set initial(val) {
    this.$initial = parseFieldValue({
      parser: this.$parser,
      separated: val,
    });
  }

  @computed get default() {
    return toJS(this.$default);
  }

  set default(val) {
    this.$default = parseFieldValue({
      parser: this.$parser,
      separated: val,
    });
  }

  @computed get label() {
    return parseGetLabel(this.$label);
  }

  @computed get placeholder() {
    return this.$placeholder;
  }

  @computed get options() {
    return this.$options;
  }

  @computed get bindings() {
    return this.$bindings;
  }

  @computed get type() {
    return this.$type;
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

  @computed get validators() {
    return this.$validate;
  }

  @computed get error() {
    if (this.showError === false) return null;
    return (this.errorAsync || this.errorSync);
  }

  @computed get hasError() {
    return this.checkValidationErrors
      || this.check('hasError', true);
  }

  @computed get isValid() {
    return !this.checkValidationErrors
      && this.check('isValid', true);
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
    if (_.isDate(this.value)) return false;
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

  sync = action((e, v = null) => {
    this.$changed = true;

    const $isBool = $ =>
      _.isBoolean(this.$value) &&
      _.isBoolean($.target.checked);

    const $get = $ => $isBool($)
        ? $.target.checked
        : $.target.value;

    // assume "v" or "e" are the values
    if (_.isNil(e) || _.isNil(e.target)) {
      if (!_.isNil(v) && !_.isNil(v.target)) {
        v = $get(v); // eslint-disable-line
      }

      this.value = $try(e, v);
      return;
    }

    if (!_.isNil(e.target)) {
      this.value = $get(e);
      return;
    }

    this.value = e;
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
}

export const prototypes = {

  @action
  setupField($key, $path, $data, $props, update) {
    this.key = $key;
    this.path = $path;
    this.id = utils.makeId(this.path);

    const isEmptyArray = (_.has($data, 'fields') && _.isArray($data.fields));

    const {
      $value = null,
      $label = null,
      $placeholder = null,
      $default = null,
      $initial = null,
      $disabled = null,
      $bindings = null,
      $type = null,
      $options = null,
      $related = null,
      $validate = null,
      $rules = null,
      $parse = null,
      $format = null,
    } = $props;

    // eslint-disable-next-line
    if (_.isNil($data)) $data = '';

    if (_.isPlainObject($data)) {
      const {
        value,
        name,
        label,
        placeholder,
        disabled,
        bindings,
        type,
        options,
        related,
        validate,
        rules,
        parse,
        format,
      } = $data;

      this.$type = $type || type || 'text';
      this.$parser = $try($parse, parse, this.$parser);
      this.$formatter = $try($format, format, this.$formatter);

      this.$initial = parseFieldValue({
        parser: this.$parser,
        type: this.type,
        unified: isEmptyArray ? [] : value,
        separated: $initial,
      });

      this.$default = parseFieldValue({
        parser: this.$parser,
        type: this.type,
        unified: update ? '' : $data.default,
        separated: $default,
        initial: this.$initial,
      });

      this.name = _.toString(name || $key);
      this.$value = this.$initial;
      this.$label = $label || label || this.name;
      this.$placeholder = $placeholder || placeholder || '';
      this.$disabled = $disabled || disabled || false;
      this.$bindings = $bindings || bindings || 'default';
      this.$options = $options || options || null;
      this.$related = $related || related || [];
      this.$validate = toJS($validate || validate || null);
      this.$rules = $rules || rules || null;
      return;
    }

    /* The field IS the value here */
    this.name = _.toString($key);
    this.$type = $type || 'text';

    this.$initial = parseFieldValue({
      parser: this.$parser,
      type: this.type,
      unified: isEmptyArray ? [] : $data,
      separated: $value,
    });

    this.$default = parseFieldValue({
      parser: this.$parser,
      type: this.type,
      unified: update ? '' : $data.default,
      separated: $default,
      initial: this.$initial,
    });

    this.$value = this.$initial;
    this.$label = $label || this.name;
    this.$placeholder = $placeholder || '';
    this.$disabled = $disabled || false;
    this.$bindings = $bindings || 'default';
    this.$options = $options || null;
    this.$related = $related || [];
    this.$validate = toJS($validate || null);
    this.$rules = $rules || null;
  },

  checkDVRValidationPlugin() {
    const validators = this.state.form.validator.validators;
    if (_.isNil(validators.dvr) && !_.isNil(this.rules)) {
      // eslint-disable-next-line
      console.warn(
        'The DVR validation rules are defined',
        'but no plugin provided (DVR). Field:',
        this.path,
      );
    }
  },

  @action
  initNestedFields(field, update) {
    const fields = _.isNil(field) ? '' : field.fields;
    this.initFields({ fields }, update);
  },

  observe() {
    if (this.state.options.get('validateOnChange') === false) return;
    this.dispose = observe(this, '$value', () => this.validate());
  },

  validate() {
    return this.state.form.validate({
      path: this.path,
      field: this,
      showErrors: true,
      related: true,
    });
  },

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
  },

  @action
  setValidationAsyncData(obj = {}) {
    this.validationAsyncData = obj;
  },

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
  },

  @action
  clear(deep = true) {
    this.showErrors(false);
    this.$value = defaultClearValue({ value: this.$value });

    // recursive clear fields
    if (deep && this.fields.size) {
      this.deepAction('clear', this.fields);
    }
  },

  @action
  reset(deep = true) {
    const useDefaultValue = (this.$default !== this.$initial);
    if (useDefaultValue) this.value = this.$default;
    if (!useDefaultValue) this.value = this.$initial;

    // recursive reset fields
    if (deep && this.fields.size) {
      this.deepAction('reset', this.fields);
    }
  },

  @action
  showErrors(showErrors = true) {
    this.showError = showErrors;
    this.errorSync = _.head(this.validationErrorStack);
  },

  @action
  showAsyncErrors() {
    if (this.validationAsyncData.valid === false) {
      this.errorAsync = this.validationAsyncData.message;
      return;
    }
    this.errorAsync = null;
  },

  bind(props = {}) {
    return this.state.bindings.load(this, this.bindings, props);
  },

};
