import { action, computed, observe, observable, asMap } from 'mobx';
import _ from 'lodash';
import utils from './utils';

import Validator from './Validator';
import Events from './Events';
import State from './State';
import Field from './Field';

export default class Form {

  name;

  state;

  validator;

  @observable fields = asMap({});

  constructor(initial = {}, name = null) {
    this.name = name;
    this.state = new State();

    this.state.initOptions(initial);
    this.initValidator(initial);
    this.initPropsState(initial);
    this.initFields(initial);

    this.observeFields();
    this.validateOnInit();

    // execute onInit if exist
    if (_.isFunction(this.onInit)) this.onInit(this);
  }

  makeField(data) {
    return new Field(data);
  }

  initValidator(initial = {}) {
    this.validator = new Validator(initial);
  }

  initPropsState(initial) {
    const $props = _.union(utils.iprops, utils.vprops);
    const initialProps = _.pick(initial, $props);

    this.state.set('form', this);
    this.state.set('initial', 'props', initialProps);

    if (utils.isStruct(initial.fields)) {
      this.state.struct(initial.fields);
    }
  }

  options(options = null) {
    if (_.isObject(options)) this.state.options.set(options);
    if (_.isString(options)) return this.state.options.get(options);
    return this.state.options.get();
  }

  on(event, callback) {
    observe(Events.getRunning(), ({ name, oldValue, object }) => {
      if (!event.includes('@')) return;

      const $event = _.split(event, '@');
      const $path = Events.path(name);

      if ($event[0] === name
        && $event[1] === $path
        && oldValue && !object[name]) {
        callback({ form: this, path: $path });
      }
    });
  }

  validateOnInit() {
    if (this.state.options.get('validateOnInit') === false) return;
    // execute validation on form initialization
    this.validate({ showErrors: this.state.options.get('showErrorsOnInit') });
  }

  validate(opt = {}, obj = {}) {
    this.validator.resetGenericError();

    const $key = _.has(opt, 'key') ? opt.key : opt;

    let $field = null;
    if (_.has(opt, 'field')) $field = opt.field;
    else if (_.isString($key)) $field = this.select($key);

    let showErrors = true;
    if (_.has(opt, 'showErrors')) showErrors = opt.showErrors;
    else if (_.has(obj, 'showErrors')) showErrors = obj.showErrors;

    let related = false;
    if (_.has(opt, 'related')) related = opt.related;
    else if (_.has(obj, 'related')) related = obj.related;

    Events.setRunning('validate', true, $field ? $field.path : null);

    // look running events and choose when show errors messages
    const notShowErrorsEvents = ['clear', 'reset'];
    if (this.state.options.get('showErrorsOnUpdate') === false) notShowErrorsEvents.push('update');
    const $showErrors = showErrors && !Events.running(notShowErrorsEvents);

    if (_.isObject(opt) && !_.isString($key)) {
      // validate all fields
      return new Promise((resolve) => {
        this.validator.validateAll({
          related,
          form: this,
          showErrors: $showErrors,
        });
        // wait all promises then resolve
        return Promise.all(this.validator.promises)
          .then(() => Events.setRunning('validate', false))
          .then(() => resolve(this.isValid));
      });
    }

    // validate single field
    return new Promise((resolve) => {
      // validate single field by key
      this.validator
        .validateField({
          related,
          form: this,
          key: $key,
          field: $field,
          showErrors: $showErrors,
        });
      // wait all promises then resolve
      return Promise.all(this.validator.promises)
        .then(() => Events.setRunning('validate', false))
        .then(() => resolve($field.isValid));
    });
  }

  invalidate(message) {
    this.validator.invalidate(message);
  }

  /* ------------------------------------------------------------------ */
  /* ACTIONS */

  /**
    Clear Form Fields
  */
  @action clear() {
    this.deepAction('clear', this.fields);
  }

  /**
    Reset Form Fields
  */
  @action reset() {
    this.deepAction('reset', this.fields);
  }

  /**
    Submit Form
  */
  @action submit(o = {}) {
    const execOnSuccess = _.has(o, 'onSuccess') ? o.onSuccess : this.onSuccess;
    const execOnError = _.has(o, 'onError') ? o.onError : this.onError;

    this.validate()
      .then(isValid => isValid
        ? execOnSuccess(this)
        : execOnError(this));
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  @computed get hasError() {
    return _.isString(this.validator.genericErrorMessage)
     || this.check('hasError', true);
  }

  @computed get isValid() {
    return !_.isString(this.validator.genericErrorMessage)
      && this.check('isValid', true);
  }

  @computed get isDirty() {
    return this.check('isDirty', true);
  }

  @computed get isPristine() {
    return this.check('isPristine', true);
  }

  @computed get isDefault() {
    return this.check('isDefault', true);
  }

  @computed get isEmpty() {
    return this.check('isEmpty', true);
  }

  @computed get focus() {
    return this.check('focus', true);
  }

  @computed get touched() {
    return this.check('touched', true);
  }

  @computed get changed() {
    return this.check('changed', true);
  }

  @computed get error() {
    return this.validator.genericErrorMessage;
  }

  /* ------------------------------------------------------------------ */
  /* EVENTS */

  /**
    On Submit
   */
  onSubmit = (e, o = {}) => {
    e.preventDefault();
    this.submit(o);
  };

  /**
    Event: On Clear
  */
  onClear = (e) => {
    e.preventDefault();
    this.clear();
  };

  /**
    Event: On Reset
  */
  onReset = (e) => {
    e.preventDefault();
    this.reset();
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
  onDel = (e, key = null) => {
    e.preventDefault();
    this.del(key);
  };
}
