import { action, computed, observe, observable, asMap, toJS } from 'mobx';
import _ from 'lodash';
import Validator from './Validator';
import fieldsInitializer from './FieldsInit';
import fieldHelpers from './FieldHelpers';
import formHelpers from './FormHelpers';

export default class Form {

  name = null;

  @observable fields = asMap({});

  validator;

  events = [];

  $options = {
    showErrorsOnInit: false,
    validateOnInit: true,
    validateOnChange: true,
    strictUpdate: false,
    showErrorsOnUpdate: true,
    defaultGenericError: null,
    loadingMessage: null,
    allowRequired: false,
  };

  constructor(obj = {}, name = null) {
    this.name = name;

    this.assignFormHelpers();
    this.assignFieldHelpers();
    this.assignInitData(obj);
    this.initValidator(obj);
    this.assignFieldsInitializer();
    this.initFields(obj);
    this.observeFields();
    this.validateOnInit();

    // execute onInit if exist
    if (_.isFunction(this.onInit)) this.onInit(this);
  }

  assignInitData({ options = {} }) {
    this.options(options);
  }

  assignFormHelpers() {
    Object.assign(this, formHelpers(this));
  }

  assignFieldHelpers() {
    Object.assign(this, fieldHelpers(this));
  }

  assignFieldsInitializer() {
    Object.assign(this, fieldsInitializer(this));
  }

  options(options = {}) {
    if (!_.isEmpty(options)) {
      _.merge(this.$options, options);
    }
    return this.$options;
  }

  initValidator(obj = {}) {
    this.validator = new Validator(obj);
  }

  observeFields() {
    if (this.$options.validateOnChange === false) return;
    // deep observe and validate each field
    this.observeFieldsDeep(this.fields);
  }

  observeFieldsDeep(fields) {
    fields.forEach((field, key) => {
      observe(fields.get(key), '$value', () =>
        this.validate({ key, field, showErrors: true, related: true }));
      // recursive observe and validate each field
      if (field.fields.size) this.observeFieldsDeep(field.fields);
    });
  }

  validateOnInit() {
    if (this.$options.validateOnInit === false) return;

    this.validate({
      showErrors: this.$options.showErrorsOnInit,
    });
  }

  validate(opt = {}, obj = {}) {
    this.validator.resetGenericError();

    const $key = _.has(opt, 'key') ? opt.key : opt;
    const $field = _.has(opt, 'field') ? opt.field : null;
    const showErrors = _.has(opt, 'showErrors') ? opt.showErrors : obj.showErrors || true;
    const related = _.has(opt, 'related') ? opt.related : obj.related || false;

    const notShowErrorsEvents = ['clear', 'reset'];
    if (this.$options.showErrorsOnUpdate === false) notShowErrorsEvents.push('update');
    const $showErrors = showErrors && !this.eventsRunning(notShowErrorsEvents);

    if (_.isObject(opt) && !_.isString($key)) {
      // validate all fields
      return new Promise((resolve) => {
        this.validator.validateAll({
          related,
          form: this,
          showErrors: $showErrors,
          values: this.values(),
        });
        // wait all promises then resolve
        return Promise.all(this.validator.promises)
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
        .then(() => resolve($field.isValid));
    });
  }

  /**
    Fields Props Setter
  */
  set(key, data) {
    this.update(key, data);
  }

  eventsRunning(events) {
    return _.intersection(events, this.events).length > 0;
  }

  invalidate(message) {
    this.validator.invalidate(message);
  }

  values() {
    return this.mapDeep('value', this.fields);
  }

  errors() {
    return this.mapDeep('error', this.fields);
  }

  /* ------------------------------------------------------------------ */
  /* ACTIONS */

  @action
  clear() {
    const $e = 'clear';
    this.events.push($e);
    this.actionRecursive($e, this.fields);
    this.events.pop($e);
  }

  @action
  reset() {
    const $e = 'reset';
    this.events.push($e);
    this.actionRecursive($e, this.fields);
    this.events.pop($e);
  }

  @action
  update($, data = null) {
    const $e = 'update';
    this.events.push($e);

    // UPDATE FIELDS VALUE (default)
    if (_.isObject($) && !data) {
      // $ is the data
      this.updateRecursive('value', $);
    }

    // UPDATE CUSTOM PROP
    if (_.isString($) && _.isObject(data)) {
      // $ is the prop key
      this.updateRecursive($, data);
    }

    this.events.pop($e);
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  @computed
  get hasError() {
    return _.some(this.deepCheck('some', 'hasError', this.fields))
      || _.isString(this.validator.genericErrorMessage);
  }

  @computed
  get isValid() {
    return _.every(this.deepCheck('every', 'isValid', this.fields))
      && !_.isString(this.validator.genericErrorMessage);
  }

  @computed
  get isDirty() {
    return _.some(this.deepCheck('some', 'isDirty', this.fields));
  }

  @computed
  get isPristine() {
    return _.every(this.deepCheck('every', 'isPristine', this.fields));
  }

  @computed
  get isDefault() {
    return _.every(this.deepCheck('every', 'isDefault', this.fields));
  }

  @computed
  get isEmpty() {
    return _.every(this.deepCheck('every', 'isEmpty', this.fields));
  }

  @computed
  get error() {
    return this.validator.genericErrorMessage;
  }

  /* ------------------------------------------------------------------ */
  /* EVENTS */

  /**
    On Submit
   */
  handleOnSubmit = (e, o = {}) => {
    e.preventDefault();

    const execOnSuccess = _.has(o, 'onSuccess') ? o.onSuccess : this.onSuccess;
    const execOnError = _.has(o, 'onError') ? o.onError : this.onError;

    this.validate()
      .then(isValid => isValid
        ? execOnSuccess(this)
        : execOnError(this));
  };

  /**
    On Clear
   */
  handleOnClear = (e) => {
    e.preventDefault();
    this.clear();
  };

  /**
    On Reset
   */
  handleOnReset = (e) => {
    e.preventDefault();
    this.reset();
  };
}
