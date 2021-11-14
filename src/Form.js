import { action, computed, observable, asMap, makeObservable } from 'mobx';
import _ from 'lodash';

import Base from './Base';
import Validator from './Validator';
import State from './State';
import Field from './Field';

export default class Form extends Base {

  name;
  state;
  validator;

  $hooks = {};
  $handlers = {};

  fields = observable.map ? observable.map({}) : asMap({});

  constructor(setup = {}, {

    name = null,
    options = {},
    plugins = {},
    bindings = {},
    hooks = {},
    handlers = {},

  } = {}) {
    super();
    makeObservable(this, {
      fields: observable,
      validatedValues: computed,
      clearing: computed,
      resetting: computed,
      error: computed,
      hasError: computed,
      isValid: computed,
      isPristine: computed,
      isDirty: computed,
      isDefault: computed,
      isEmpty: computed,
      focused: computed,
      touched: computed,
      changed: computed,
      disabled: computed,
      init: action,
      invalidate: action,
      clear: action,
      reset: action
    })

    this.name = name;
    this.$hooks = hooks;
    this.$handlers = handlers;

    // load data from initializers methods
    const initial = _.each({
      setup, options, plugins, bindings,
    },
    (val, key) => _.isFunction(this[key])
      ? _.merge(val, this[key].apply(this, [this]))
      : val);

    this.state = new State({
      form: this,
      initial: initial.setup,
      options: initial.options,
      bindings: initial.bindings,
    });

    this.validator = new Validator({
      form: this,
      plugins: initial.plugins,
    });

    this.initFields(initial.setup);

    this.debouncedValidation = _.debounce(
      this.validate,
      this.state.options.get('validationDebounceWait'),
      this.state.options.get('validationDebounceOptions'),
    );

    // execute validation on form initialization
    if (this.state.options.get('validateOnInit') === true) {
      this.validator.validate({
        showErrors: this.state.options.get('showErrorsOnInit')
      });
    }

    this.execHook('onInit');
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  get validatedValues() {
    const data = {};
    this.each($field => // eslint-disable-line
      (data[$field.path] = $field.validatedValue));

    return data;
  }

  get clearing() {
    return this.check('clearing', true);
  }

  get resetting() {
    return this.check('resetting', true);
  }

  get error() {
    return this.validator.error;
  }

  get hasError() {
    return !!this.validator.error
     || this.check('hasError', true);
  }

  get isValid() {
    return !this.validator.error
      && this.check('isValid', true);
  }

  get isPristine() {
    return this.check('isPristine', true);
  }

  get isDirty() {
    return this.check('isDirty', true);
  }

  get isDefault() {
    return this.check('isDefault', true);
  }

  get isEmpty() {
    return this.check('isEmpty', true);
  }

  get focused() {
    return this.check('focused', true);
  }

  get touched() {
    return this.check('touched', true);
  }

  get changed() {
    return this.check('changed', true);
  }

  get disabled() {
    return this.check('disabled', true);
  }

  makeField(data) {
    return new Field(data);
  }

  /**
   Init Form Fields and Nested Fields
   */
  init($fields = null) {
    _.set(this, 'fields', observable.map
      ? observable.map({})
      : asMap({}));

    this.state.initial.props.values = $fields; // eslint-disable-line
    this.state.current.props.values = $fields; // eslint-disable-line

    this.initFields({
      fields: $fields || this.state.struct(),
    });
  }

  invalidate(message = null) {
    this.validator.error = message
      || this.state.options.get('defaultGenericError')
      || true;
  }

  showErrors(show = true) {
    this.each(field => field.showErrors(show));
  }

  /**
    Clear Form Fields
  */
  clear() {
    this.$touched = false;
    this.$changed = false;
    this.each(field => field.clear(true));
  }

  /**
    Reset Form Fields
  */
  reset() {
    this.$touched = false;
    this.$changed = false;
    this.each(field => field.reset(true));
  }

};
