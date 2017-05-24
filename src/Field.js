import { observable, observe, action, computed, isObservableArray, toJS, asMap, untracked } from 'mobx';
import _ from 'lodash';
import Base from './Base';

import {
  $try,
  $hasFiles,
  $isBool,
  $isEvent,
  makeId } from './utils';

import {
  defaultClearValue,
  parseFieldValue,
  parseGetLabel } from './parser';

export default class Field extends Base {

  fields = observable.map ? observable.map({}) : asMap({});
  hasInitialNestedFields = false;
  incremental = false;

  id;
  key;
  name;
  path;
  type;
  state;

  $observers;
  $interceptors;

  $onDrop;
  $onSubmit;
  $onClear;
  $onReset;

  noop = () => {};
  $parser = $ => $;
  $formatter = $ => $;

  @observable $options;
  @observable $value;
  @observable $label;
  @observable $placeholder;
  @observable $default;
  @observable $initial;
  @observable $bindings;
  @observable $extra;
  @observable $related;

  @observable $rules;
  @observable $validators;

  @observable $disabled = false;
  @observable $focused = false;
  @observable $touched = false;
  @observable $changed = false;

  @observable $submitting = false;
  @observable $validating = false;

  @observable autoFocus = false;
  @observable showError = false;

  @observable errorSync = null;
  @observable errorAsync = null;

  @observable validationErrorStack = [];
  @observable validationFunctionsData = [];
  @observable validationAsyncData = {};

  @observable files;

  constructor({ key, path, data = {}, props = {}, update = false, state }) {
    super();

    this.state = state;

    this.setupField(key, path, data, props, update);
    this.checkDVRValidationPlugin();
    this.initNestedFields(data, update);

    this.incremental = (this.hasIncrementalNestedFields !== 0);

    this.debouncedValidation = _.debounce(
      this.validate,
      this.state.options.get('validationDebounceWait', this),
      this.state.options.get('validationDebounceOptions', this),
    );

    this.observeValidation();

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

  @computed get checked() {
    return (this.type === 'checkbox') ? this.value : undefined;
  }

  @computed get value() {
    return this.getComputedProp('value');
  }

  set value(newVal) {
    if (this.$value === newVal) return;
    // handle numbers
    if (this.state.options.get('autoParseNumbers', this) === true) {
      if (_.isNumber(this.$initial)) {
        if (new RegExp('^-?\\d+(,\\d+)*(\\.\\d+([eE]\\d+)?)?$', 'g').exec(newVal)) {
          this.$value = _.toNumber(newVal);
          return;
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
    return toJS(this.$submitting);
  }

  @computed get validating() {
    return toJS(this.$validating);
  }

  @computed get label() {
    return parseGetLabel(this.$label);
  }

  @computed get placeholder() {
    return toJS(this.$placeholder);
  }

  @computed get extra() {
    return toJS(this.$extra);
  }

  @computed get options() {
    return toJS(this.$options);
  }

  @computed get bindings() {
    return toJS(this.$bindings);
  }

  @computed get related() {
    return toJS(this.$related);
  }

  @computed get disabled() {
    return toJS(this.$disabled);
  }

  @computed get rules() {
    return toJS(this.$rules);
  }

  @computed get validators() {
    return toJS(this.$validators);
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

  @computed get focused() {
    return this.hasNestedFields
      ? this.check('focused', true)
      : this.$focused;
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
  /* EVENTS HANDLERS */

  sync = action((e, v = null) => {
    this.$changed = true;

    const $get = $ => $isBool($, this.value)
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

  onDrop = action((...all) => {
    const e = all[0];
    let files = null;

    if ($isEvent(e) && $hasFiles(e)) {
      files = _.map(e.target.files);
    }

    this.files = files || all;
    this.$onDrop.apply(this, [this]);
  });

  onBlur = action(() => {
    this.$focused = false;
  });

  onFocus = action(() => {
    this.$focused = true;
    this.$touched = true;
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
    this.id = makeId(this.path);

    const isEmptyArray = (_.has($data, 'fields') && _.isArray($data.fields));
    const checkArray = val => isEmptyArray ? [] : val;

    const {
      $options,
      $extra,
      $value,
      $label,
      $placeholder,
      $default,
      $initial,
      $disabled,
      $bindings,
      $type,
      $related,
      $validators,
      $rules,
      $parse,
      $format,
      $observers,
      $interceptors,
      $onDrop,
      $onSubmit,
      $onClear,
      $onReset,
    } = $props;

    // eslint-disable-next-line
    if (_.isNil($data)) $data = '';

    if (_.isPlainObject($data)) {
      const {
        options,
        extra,
        value,
        name,
        label,
        placeholder,
        disabled,
        bindings,
        type,
        related,
        validators,
        rules,
        parse,
        format,
        observers,
        interceptors,
        onDrop,
        onSubmit,
        onClear,
        onReset,
      } = $data;

      this.type = $type || type || 'text';
      this.$onDrop = $onDrop || onDrop || null;
      this.$onSubmit = $onSubmit || onSubmit || null;
      this.$onClear = $onClear || onClear || this.noop;
      this.$onReset = $onReset || onReset || this.noop;

      this.$parser = $try($parse, parse, this.$parser);
      this.$formatter = $try($format, format, this.$formatter);

      this.$initial = parseFieldValue(this.$parser, {
        isEmptyArray,
        type: this.type,
        unified: checkArray(value),
        separated: checkArray($initial),
        initial: checkArray($data.initial),
      });

      this.$default = parseFieldValue(this.$parser, {
        isEmptyArray,
        type: this.type,
        unified: update ? '' : checkArray($data.default),
        separated: checkArray($default),
        initial: checkArray(this.$initial),
      });

      this.name = _.toString(name || $key);
      this.$value = this.$initial;
      this.$label = $label || label || this.name;
      this.$placeholder = $placeholder || placeholder || '';
      this.$disabled = $disabled || disabled || false;
      this.$bindings = $bindings || bindings || 'default';
      this.$related = $related || related || [];
      this.$validators = toJS($validators || validators || null);
      this.$rules = $rules || rules || null;
      this.$observers = $observers || observers || null;
      this.$interceptors = $interceptors || interceptors || null;
      this.$extra = $extra || extra || null;
      this.$options = $options || options || {};
      return;
    }

    /* The field IS the value here */
    this.name = _.toString($key);
    this.type = $type || 'text';
    this.$onDrop = $onDrop || null;
    this.$onSubmit = $onSubmit || null;
    this.$onClear = $onClear || this.noop;
    this.$onReset = $onReset || this.noop;

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
    this.$related = $related || [];
    this.$validators = toJS($validators || null);
    this.$rules = $rules || null;
    this.$observers = $observers || null;
    this.$interceptors = $interceptors || null;
    this.$extra = $extra || null;
    this.$options = $options || {};
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
    const drivers = this.state.form.validator.drivers;
    if (_.isNil(drivers.dvr) && !_.isNil(this.rules)) {
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
    const fields = _.isNil(field) ? null : field.fields;
    if (_.isArray(fields)) this.hasInitialNestedFields = true;
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
    if (deep) this.each(field => field.resetValidation());
  },

  @action
  clear(deep = true, call = true) {
    this.$touched = false;
    this.$changed = false;

    this.$value = defaultClearValue({ value: this.$value });
    this.files = undefined;

    this.showErrors(this.state.options.get('showErrorsOnClear', this));
    if (deep) this.each(field => field.clear(true, false));

    if (call) {
      this.$onClear.apply(this, [{
        form: this.state.form,
        field: this,
      }]);
    }
  },

  @action
  reset(deep = true, call = true) {
    this.$touched = false;
    this.$changed = false;

    const useDefaultValue = (this.$default !== this.$initial);
    if (useDefaultValue) this.value = this.$default;
    if (!useDefaultValue) this.value = this.$initial;
    this.files = undefined;

    this.showErrors(this.state.options.get('showErrorsOnReset', this));
    if (deep) this.each(field => field.reset(true, false));

    if (call) {
      this.$onReset.apply(this, [{
        form: this.state.form,
        field: this,
      }]);
    }
  },

  @action
  focus() {
    // eslint-disable-next-line
    this.state.form.each(field => (field.autoFocus = false));
    this.autoFocus = true;
  },

  @action
  showErrors(show = true) {
    this.showError = show;
    this.errorSync = _.head(this.validationErrorStack);
    this.each(field => field.showErrors(show));
  },

  @action
  showAsyncErrors() {
    if (this.validationAsyncData.valid === false) {
      this.errorAsync = this.validationAsyncData.message;
      return;
    }
    this.errorAsync = null;
  },

  observeValidation(type) {
    const validateOnChange = this.state.options.get('validateOnChange', this);
    const showErrorsOnChange = this.state.options.get('showErrorsOnChange', this);
    const validateOnBlur = this.state.options.get('validateOnBlur', this);
    const showErrorsOnBlur = this.state.options.get('showErrorsOnBlur', this);

    if (type === 'onBlur' || (validateOnBlur)) {
      this.disposeValidationOnBlur = observe(this, '$focused', ({ newValue }) =>
        (newValue === false) && this.debouncedValidation({ showErrors: showErrorsOnBlur }));
    }

    if (type === 'onChange' || validateOnChange) {
      this.disposeValidationOnChange = observe(this, '$value', () =>
        this.debouncedValidation({ showErrors: showErrorsOnChange }));
    }
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
