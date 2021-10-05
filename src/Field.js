import { observable, observe, action, computed, isObservableArray, toJS, asMap, untracked, makeObservable } from 'mobx';
import _ from 'lodash';
import Base from './Base';

import {
  $try,
  $hasFiles,
  $isBool,
  $isEvent,
  pathToStruct } from './utils';

import {
  parseInput,
  parseCheckOutput,
  defaultValue,
  defaultClearValue } from './parser';

const setupFieldProps = (instance, props, data) =>
  Object.assign(instance, {
    $label: props.$label || data && data.label || '',
    $placeholder: props.$placeholder || data && data.placeholder || '',
    $disabled: props.$disabled || data && data.disabled || false,
    $bindings: props.$bindings || data && data.bindings || 'default',
    $related: props.$related || data && data.related || [],
    $validators: toJS(props.$validators || data && data.validators || null),
    $validatedWith: props.$validatedWith || data && data.validatedWith || 'value',
    $rules: props.$rules || data && data.rules || null,
    $observers: props.$observers || data && data.observers || null,
    $interceptors: props.$interceptors || data && data.interceptors || null,
    $extra: props.$extra || data && data.extra || null,
    $options: props.$options || data && data.options || {},
    $hooks: props.$hooks || data && data.hooks || {},
    $handlers: props.$handlers || data && data.handlers || {},
  });

const setupDefaultProp = (instance, data, props, update, {
  isEmptyArray,
}) => parseInput(instance.$input, {
  nullable: true,
  isEmptyArray,
  type: instance.type,
  unified: update ? defaultValue({type: instance.type}) : data && data.default,
  separated: props.$default,
  fallback: instance.$initial,
});

export default class Field extends Base {

  fields = observable.map ? observable.map({}) : asMap({});
  hasInitialNestedFields = false;
  incremental = false;

  id;
  key;
  name;
  path;
  state;

  $observers;
  $interceptors;

  $hooks = {};
  $handlers = {};

  $input = $ => $;
  $output = $ => $;

   $options;
   $value;
   $type;
   $label;
   $placeholder;
   $default;
   $initial;
   $bindings;
   $extra;
   $related;
   $validatedWith;

   $validators;
   $rules;

   $disabled = false;
   $focused = false;
   $touched = false;
   $changed = false;
   $blurred = false;
   $deleted = false;

   $clearing = false;
   $resetting = false;

   autoFocus = false;
   showError = false;

   errorSync = null;
   errorAsync = null;

   validationErrorStack = [];
   validationFunctionsData = [];
   validationAsyncData = {};

   files;

  constructor({
    key, path, data = {}, props = {}, update = false, state,
  }) {
    super();

    makeObservable(this, {
      $options: observable,
      $value: observable,
      $type: observable,
      $label: observable,
      $placeholder: observable,
      $default: observable,
      $initial: observable,
      $bindings: observable,
      $extra: observable,
      $related: observable,
      $validatedWith: observable,
      $validators: observable,
      $rules: observable,
      $disabled: observable,
      $focused: observable,
      $touched: observable,
      $changed: observable,
      $blurred: observable,
      $deleted: observable,
      $clearing: observable,
      $resetting: observable,
      autoFocus: observable,
      showError: observable,
      errorSync: observable,
      errorAsync: observable,
      validationErrorStack: observable,
      validationFunctionsData: observable,
      validationAsyncData: observable,
      files: observable,
      checkValidationErrors: computed,
      checked: computed,
      value: computed,
      initial: computed,
      default: computed,
      actionRunning: computed,
      type: computed,
      label: computed,
      placeholder: computed,
      extra: computed,
      options: computed,
      bindings: computed,
      related: computed,
      disabled: computed,
      rules: computed,
      validators: computed,
      validatedValue: computed,
      error: computed,
      hasError: computed,
      isValid: computed,
      isDefault: computed,
      isDirty: computed,
      isPristine: computed,
      isEmpty: computed,
      resetting: computed,
      clearing: computed,
      focused: computed,
      blurred: computed,
      touched: computed,
      changed: computed,
      deleted: computed,
      setupField: action,
      initNestedFields: action,
      invalidate: action,
      setValidationAsyncData: action,
      resetValidation: action,
      clear: action,
      reset: action,
      focus: action,
      showErrors: action,
      showAsyncErrors: action
    });

    this.state = state;

    this.setupField(key, path, data, props, update);
    this.checkValidationPlugins();
    this.initNestedFields(data, update);

    this.incremental = (this.hasIncrementalKeys !== 0);

    this.debouncedValidation = _.debounce(
      this.validate,
      this.state.options.get('validationDebounceWait', this),
      this.state.options.get('validationDebounceOptions', this),
    );

    this.observeValidationOnBlur();
    this.observeValidationOnChange();

    this.initMOBXEvent('observers');
    this.initMOBXEvent('interceptors');

    this.execHook('onInit');
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  get checkValidationErrors() {
    return ((this.validationAsyncData.valid === false)
      && !_.isEmpty(this.validationAsyncData))
      || !_.isEmpty(this.validationErrorStack)
      || _.isString(this.errorAsync)
      || _.isString(this.errorSync);
  }

  get checked() {
    return (this.type === 'checkbox') ? this.value : undefined;
  }

  get value() {
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

  get initial() {
    return this.$initial
      ? toJS(this.$initial)
      : this.getComputedProp('initial');
  }

  get default() {
    return this.$default
      ? toJS(this.$default)
      : this.getComputedProp('default');
  }

  set initial(val) {
    this.$initial = parseInput(this.$input, { separated: val });
  }

  set default(val) {
    this.$default = parseInput(this.$input, { separated: val });
  }

  get actionRunning() {
    return (this.submitting || this.clearing || this.resetting);
  }

  get type() {
    return toJS(this.$type);
  }

  get label() {
    return toJS(this.$label);
  }

  get placeholder() {
    return toJS(this.$placeholder);
  }

  get extra() {
    return toJS(this.$extra);
  }

  get options() {
    return toJS(this.$options);
  }

  get bindings() {
    return toJS(this.$bindings);
  }

  get related() {
    return toJS(this.$related);
  }

  get disabled() {
    return toJS(this.$disabled);
  }

  get rules() {
    return toJS(this.$rules);
  }

  get validators() {
    return toJS(this.$validators);
  }

  get validatedValue() {
    return parseCheckOutput(this, this.$validatedWith)
  }

  get error() {
    if (this.showError === false) return null;
    return (this.errorAsync || this.errorSync || null);
  }

  get hasError() {
    return this.checkValidationErrors
      || this.check('hasError', true);
  }

  get isValid() {
    return !this.checkValidationErrors
      && this.check('isValid', true);
  }

  get isDefault() {
    return !_.isNil(this.default) &&
      _.isEqual(this.default, this.value);
  }

  get isDirty() {
    return !_.isUndefined(this.initial) &&
      !_.isEqual(this.initial, this.value);
  }

  get isPristine() {
    return !_.isNil(this.initial) &&
      _.isEqual(this.initial, this.value) ;
  }

  get isEmpty() {
    if (this.hasNestedFields) return this.check('isEmpty', true);
    if (_.isBoolean(this.value)) return !!this.$value;
    if (_.isNumber(this.value)) return false;
    if (_.isDate(this.value)) return false;
    return _.isEmpty(this.value);
  }

  get resetting() {
    return this.hasNestedFields
      ? this.check('resetting', true)
      : this.$resetting;
  }

  get clearing() {
    return this.hasNestedFields
      ? this.check('clearing', true)
      : this.$clearing;
  }

  get focused() {
    return this.hasNestedFields
      ? this.check('focused', true)
      : this.$focused;
  }

  get blurred() {
    return this.hasNestedFields
      ? this.check('blurred', true)
      : this.$blurred;
  }

  get touched() {
    return this.hasNestedFields
      ? this.check('touched', true)
      : this.$touched;
  }

  get changed() {
    return this.hasNestedFields
      ? this.check('changed', true)
      : this.$changed;
  }

  get deleted() {
    return this.hasNestedFields
      ? this.check('deleted', true)
      : this.$deleted;
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

  onChange = (...args) => (this.type === 'file')
    ? this.onDrop(...args)
    : this.execHandler('onChange', args, this.sync);

  onToggle = (...args) =>
    this.execHandler('onToggle', args, this.sync);

  onBlur = (...args) =>
    this.execHandler('onBlur', args,
      action(() => {
        if (!this.$blurred) {
          this.$blurred = true;
        }

        this.$focused = false;
      }));

  onFocus = (...args) =>
    this.execHandler('onFocus', args,
      action(() => {
        this.$focused = true;
        this.$touched = true;
      }));

  onDrop = (...args) =>
    this.execHandler('onDrop', args,
      action(() => {
        const e = args[0];
        let files = null;

        if ($isEvent(e) && $hasFiles(e)) {
          files = _.map(e.target.files);
        }

        this.files = files || args;
      }));

  setupField($key, $path, $data, $props, update) {
    this.key = $key;
    this.path = $path;
    this.id = this.state.options.get('uniqueId').apply(this, [this]);
    const struct = this.state.struct();
    const structPath = pathToStruct(this.path)
    const isEmptyArray = Array.isArray(struct) ? 
      struct.filter(s => s.startsWith(structPath)).find(s => s.substr(structPath.length, 2) === '[]')
      : Array.isArray(_.get(struct, this.path))

    const { $type, $input, $output } = $props;

    // eslint-disable-next-line
    // if (_.isNil($data)) $data = '';

    if (_.isPlainObject($data)) {
      const { type, input, output } = $data;

      this.name = _.toString($data.name || $key);
      this.$type = $type || type || 'text';
      this.$input = $try($input, input, this.$input);
      this.$output = $try($output, output, this.$output);

      this.$value = parseInput(this.$input, {
        isEmptyArray,
        type: this.type,
        unified: $data.value,
        separated: $props.$value,
        fallback: $props.$initial,
      });

      this.$initial = parseInput(this.$input, {
        nullable: true,
        isEmptyArray,
        type: this.type,
        unified: $data.initial,
        separated: $props.$initial,
        fallback: this.$value,
      });

      this.$default = setupDefaultProp(this, $data, $props, update, {
        isEmptyArray,
      });

      setupFieldProps(this, $props, $data);
      return;
    }

    /* The field IS the value here */
    this.name = _.toString($key);
    this.$type = $type || 'text';
    this.$input = $try($input, this.$input);
    this.$output = $try($output, this.$output);

    this.$value = parseInput(this.$input, {
      isEmptyArray,
      type: this.type,
      unified: $data,
      separated: $props.$value,
    });

    this.$initial = parseInput(this.$input, {
      nullable: true,
      isEmptyArray,
      type: this.type,
      unified: $data,
      separated: $props.$initial,
      fallback: this.$value,
    });

    this.$default = setupDefaultProp(this, $data, $props, update, {
      isEmptyArray,
    });

    setupFieldProps(this, $props, $data);
  }

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
  }

  checkValidationPlugins() {
    const { drivers } = this.state.form.validator;
    const form = this.state.form.name ? `${this.state.form.name}/` : '';

    if (_.isNil(drivers.dvr) && !_.isNil(this.rules)) {
      throw new Error(`The DVR validation rules are defined but no DVR plugin provided. Field: "${form + this.path}".`);
    }

    if (_.isNil(drivers.vjf) && !_.isNil(this.validators)) {
      throw new Error(`The VJF validators functions are defined but no VJF plugin provided. Field: "${form + this.path}".`);
    }
  }

  initNestedFields(field, update) {
    const fields = _.isNil(field) ? null : field.fields;

    if (_.isArray(fields) && !_.isEmpty(fields)) {
      this.hasInitialNestedFields = true;
    }

    this.initFields({ fields }, update);

    if (!update && _.isArray(fields) && _.isEmpty(fields)) {
      if (_.isArray(this.value) && !_.isEmpty(this.value)) {
        this.hasInitialNestedFields = true;
        this.initFields({fields, values: this.value}, update)
      }
    }
  }

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

  setValidationAsyncData(valid = false, message = '') {
    this.validationAsyncData = { valid, message };
  }

  resetValidation(deep = false) {
    this.showError = true;
    this.errorSync = null;
    this.errorAsync = null;
    this.validationAsyncData = {};
    this.validationFunctionsData = [];
    this.validationErrorStack = [];
    if (deep) this.each(field => field.resetValidation());
  }

  clear(deep = true) {
    this.$clearing = true;
    this.$touched = false;
    this.$changed = false;
    this.$blurred = false;

    this.$value = defaultClearValue({ value: this.$value });
    this.files = undefined;

    if (deep) this.each(field => field.clear(true));

    this.validate({
      showErrors: this.state.options.get('showErrorsOnClear', this),
    });
  }

  reset(deep = true) {
    this.$resetting = true;
    this.$touched = false;
    this.$changed = false;
    this.$blurred = false;

    const useDefaultValue = (this.$default !== this.$initial);
    if (useDefaultValue) this.value = this.$default;
    if (!useDefaultValue) this.value = this.$initial;
    this.files = undefined;

    if (deep) this.each(field => field.reset(true));

    this.validate({
      showErrors: this.state.options.get('showErrorsOnReset', this),
    });
  }

  focus() {
    // eslint-disable-next-line
    this.state.form.each(field => (field.autoFocus = false));
    this.autoFocus = true;
  }

  showErrors(show = true) {
    this.showError = show;
    this.errorSync = _.head(this.validationErrorStack);
    this.each(field => field.showErrors(show));
  }

  showAsyncErrors() {
    if (this.validationAsyncData.valid === false) {
      this.errorAsync = this.validationAsyncData.message;
      return;
    }
    this.errorAsync = null;
  }

  observeValidationOnBlur() {
    const opt = this.state.options;
    if (opt.get('validateOnBlur', this)) {
      this.disposeValidationOnBlur = observe(this, '$focused', change =>
        (change.newValue === false) &&
          this.debouncedValidation({
            showErrors: opt.get('showErrorsOnBlur', this),
          }));
    }
  }

  observeValidationOnChange() {
    const opt = this.state.options;
    if (opt.get('validateOnChange', this)) {
      this.disposeValidationOnChange = observe(this, '$value', () =>
        !this.actionRunning &&
          this.debouncedValidation({
            showErrors: opt.get('showErrorsOnChange', this),
          }));
    } else if (
      opt.get('validateOnChangeAfterInitialBlur', this) ||
      opt.get('validateOnChangeAfterSubmit', this)
    ) {
      this.disposeValidationOnChange = observe(this, '$value', () => (
        !this.actionRunning &&
        (
          (opt.get('validateOnChangeAfterInitialBlur', this) && this.blurred) ||
          (opt.get('validateOnChangeAfterSubmit', this) && this.state.form.submitted)
        ) &&
        this.debouncedValidation({
          showErrors: opt.get('showErrorsOnChange', this),
        })
      ));
    }
  }

  initMOBXEvent(type) {
    if (!_.isArray(this[`$${type}`])) return;

    let fn;
    if (type === 'observers') fn = this.observe;
    if (type === 'interceptors') fn = this.intercept;
    this[`$${type}`].map(obj => fn(_.omit(obj, 'path')));
  }

  bind(props = {}) {
    return this.state.bindings.load(this, this.bindings, props);
  }

};
