import { action, computed, observe, observable, asMap } from 'mobx';
import _ from 'lodash';
import utils from './utils';

import Validator from './Validator';
import Options from './Options';
import Events from './Events';
import State from './State';
import Field from './Field';

import fieldInitializer from './FieldInit';
import fieldParser from './FieldParser';
import fieldHelpers from './FieldHelpers';

export default class Form {

  name;

  state;

  validator;

  $options;

  @observable fields = asMap({});

  constructor(initial = {}, name = null) {
    this.name = name;

    this.initOptions(initial);
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

  initOptions(initial = {}) {
    this.$options = new Options();
    this.$options.set(initial.options);
  }

  initValidator(initial = {}) {
    this.validator = new Validator(initial);
  }

  initPropsState(initial) {
    const $props = _.union(utils.iprops, utils.vprops);
    const initialProps = _.pick(initial, $props);

    this.state = new State();
    this.state.form(this);
    this.state.set('initial', 'props', initialProps);

    if (utils.isStruct(initial.fields)) {
      this.state.struct(initial.fields);
    }
  }

  options(options = null) {
    if (_.isObject(options)) this.$options.set(options);
    if (_.isString(options)) return this.$options.get(options);
    return this.$options.get();
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

  observeFields(fields = null) {
    // deep observe and validate each field
    this.observeFieldsDeep(fields || this.fields);
  }

  observeFieldsDeep(fields) {
    fields.forEach((field, key) => {
      observe(fields.get(key), '$value', () => {
        if (this.$options.get('validateOnChange') === false) return;
        this.validate({ key, field, showErrors: true, related: true });
      });
      // recursive observe and validate each field
      if (field.fields.size) this.observeFieldsDeep(field.fields);
    });
  }

  validateOnInit() {
    if (this.$options.get('validateOnInit') === false) return;
    // execute validation on form initialization
    this.validate({ showErrors: this.$options.get('showErrorsOnInit') });
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
    if (this.$options.get('showErrorsOnUpdate') === false) notShowErrorsEvents.push('update');
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
    return this.check('hasError', true)
      || _.isString(this.validator.genericErrorMessage);
  }

  @computed get isValid() {
    return this.check('isValid', true)
      && !_.isString(this.validator.genericErrorMessage);
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
  onAdd = (e, key = null) => {
    e.preventDefault();
    this.add(key);
  };

  /**
    Event: On Del
  */
  onDel = (e, key = null) => {
    e.preventDefault();
    this.del(key);
  };
}

// Cannot use Object.assign as @action methods on mixins are non-enumerable
([fieldInitializer, fieldHelpers, fieldParser]).forEach((mixin) => {
  Object.getOwnPropertyNames(mixin).forEach((name) => {
    Form.prototype[name] = mixin[name];
  });
});
