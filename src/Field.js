import { observable, observe, action, computed, isObservableArray, toJS, asMap, untracked } from 'mobx';
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
  disposeValidation = null;

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
  $observers;

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

  @observable $validating = false;

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

    this.debouncedValidation = _.debounce(
      this.validate,
      this.state.options.get('validationDebounceWait'),
      this.state.options.get('validationDebounceOptions'),
    );

    this.observeValidation();
    this.initObservers();
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

  @computed get value() {
    return this.getComputedProp('value');
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
    return this.getComputedProp('initial');
  }

  set initial(val) {
    this.$initial = parseFieldValue(this.$parser, { separated: val });
  }

  @computed get default() {
    return this.getComputedProp('default');
  }

  set default(val) {
    this.$default = parseFieldValue(this.$parser, { separated: val });
  }

  @computed get label() {
    return parseGetLabel(this.$label);
  }

  @computed get validating() {
    return this.$validating;
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

/**
  Prototypes
*/
export const prototypes = {

  @action
  setupField($key, $path, $data, $props, update) {
    this.key = $key;
    this.path = $path;
    this.id = utils.makeId(this.path);

    const isEmptyArray = (_.has($data, 'fields') && _.isArray($data.fields));
    const checkArray = val => isEmptyArray ? [] : val;

    const {
      $value,
      $label,
      $placeholder,
      $default,
      $initial,
      $disabled,
      $bindings,
      $type,
      $options,
      $related,
      $validate,
      $rules,
      $parse,
      $format,
      $observers,
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
        observers,
      } = $data;

      this.$type = $type || type || 'text';
      this.$parser = $try($parse, parse, this.$parser);
      this.$formatter = $try($format, format, this.$formatter);

      this.$initial = parseFieldValue(this.$parser, {
        isEmptyArray,
        type: this.type,
        unified: checkArray(value),
        separated: $initial,
      });

      this.$default = parseFieldValue(this.$parser, {
        isEmptyArray,
        type: this.type,
        unified: update ? '' : checkArray($data.default),
        separated: checkArray($default),
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
      this.$observers = $observers || observers || null;
      return;
    }

    /* The field IS the value here */
    this.name = _.toString($key);
    this.$type = $type || 'text';

    this.$initial = parseFieldValue(this.$parser, {
      isEmptyArray,
      type: this.type,
      unified: checkArray($data),
      separated: checkArray($value),
    });

    this.$default = parseFieldValue(this.$parser, {
      isEmptyArray,
      type: this.type,
      unified: update ? '' : checkArray($data.default),
      separated: checkArray($default),
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
    this.$observers = $observers || null;
  },

  getComputedProp(key) {
    if (this.incremental || this.hasNestedFields) {
      const $val = (key === 'value')
        ? this.get(key, false)
        : untracked(() => this.get(key, false));

      return !_.isEmpty($val) ? $val : [];
    }

    const val = this[`$${key}`];

    if (_.isArray(val) || isObservableArray(val)) {
      return [].slice.call(val);
    }

    return toJS(val);
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

  validate(opt = {}) {
    return this.state.form.validator.validate({
      showErrors: $try(opt.related, true),
      related: $try(opt.showErrors, true),
      form: this.state.form,
      path: this.path,
      field: this,
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
  setValidationAsyncData(valid = false, message = '') {
    this.validationAsyncData = { valid, message };
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
    if (deep) this.deepAction('resetValidation');
  },

  @action
  clear(deep = true) {
    this.showErrors(false);
    this.$value = defaultClearValue({ value: this.$value });
    // recursive clear fields
    if (deep && this.fields.size) this.deepAction('clear');
  },

  @action
  reset(deep = true) {
    const useDefaultValue = (this.$default !== this.$initial);
    if (useDefaultValue) this.value = this.$default;
    if (!useDefaultValue) this.value = this.$initial;
    // recursive reset fields
    if (deep && this.fields.size) this.deepAction('reset');
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

  observeValidation() {
    if (this.state.options.get('validateOnChange') === false) return;
    this.disposeValidation = observe(this, '$value', () => this.debouncedValidation());
  },

  initObservers() {
    if (!_.isArray(this.$observers)) return;
    this.$observers.map(obj => this.observe(_.omit(obj, 'path')));
  },

  bind(props = {}) {
    return this.state.bindings.load(this, this.bindings, props);
  },

};
