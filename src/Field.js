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
  $interceptors;
  $onSubmit;

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

  @observable $submitting = false;
  @observable $validating = false;

  @observable showError = false;

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
    this.observeShowErrors();

    this.initMOBXEvent('observers');
    this.initMOBXEvent('interceptors');
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

  @computed get submitting() {
    return this.$submitting;
  }

  @computed get validating() {
    return this.$validating;
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
      $interceptors,
      $onSubmit,
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
        interceptors,
        onSubmit,
      } = $data;

      this.$type = $type || type || 'text';
      this.$onSubmit = $onSubmit || onSubmit || null;

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
      this.$interceptors = $interceptors || interceptors || null;
      return;
    }

    /* The field IS the value here */
    this.name = _.toString($key);
    this.$type = $type || 'text';
    this.$onSubmit = $onSubmit || null;

    this.$parser = $try($parse, this.$parser);
    this.$formatter = $try($format, this.$formatter);

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
    this.$interceptors = $interceptors || null;
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
    if (deep) this.deepAction('resetValidation');
  },

  @action
  clear(deep = true) {
    this.$value = defaultClearValue({ value: this.$value });
    this.showErrors(this.state.options.get('showErrorsOnClear'));
    if (deep && this.fields.size) this.deepAction('clear');
  },

  @action
  reset(deep = true) {
    const useDefaultValue = (this.$default !== this.$initial);
    if (useDefaultValue) this.value = this.$default;
    if (!useDefaultValue) this.value = this.$initial;
    this.showErrors(this.state.options.get('showErrorsOnReset'));
    if (deep && this.fields.size) this.deepAction('reset');
  },

  @action
  showErrors(showErrors = true) {
    this.showError = showErrors;
    this.errorSync = _.head(this.validationErrorStack);
    this.deepAction('showErrors');
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
    this.disposeValidation = observe(this, '$value', () => this.debouncedValidation({
      showErrors: this.state.options.get('showErrorsOnUpdate'),
    }));
  },

  observeShowErrors() {
    // showErrorsOnBlur
    observe(this, '$focus', ({ newValue }) =>
      (newValue === false) && this.showErrors(this.state.options.get('showErrorsOnBlur')));
  },

  initMOBXEvent(type) {
    if (!_.isArray(this[`$${type}`])) return;

    let fn;
    if (type === 'observers') fn = this.observe;
    if (type === 'interceptors') fn = this.intercept;
    this[`$${type}`].map(obj => fn(_.omit(obj, 'path')));
  },

  bind(props = {}) {
    return this.state.bindings.load(this, this.bindings, props);
  },

};
