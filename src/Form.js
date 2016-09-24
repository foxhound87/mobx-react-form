import { action, computed, observe } from 'mobx';
import _ from 'lodash';
import Validator from './Validator';
import fieldsInitializer from './FieldsInit';
import formHelpers from './FormHelpers';

export default class Form {

  fields;

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

  constructor(obj = {}) {
    this.assignFormHelpers();
    this.assignInitData(obj);
    this.initValidator(obj);
    this.assignFieldsInitializer();

    // console.log('FORM --> INIT FIELDS', this.fields);
    this.initFields(obj);
    this.observeFields();
    this.validateOnInit();

    // execute onInit if exist
    if (_.isFunction(this.onInit)) this.onInit(this);
  }

  assignInitData({ fields = {}, options = {} }) {
    this.fields = fields;
    this.options(options);
  }

  assignFormHelpers() {
    Object.assign(this, formHelpers(this));
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
    // observe and validate each field
    _.each(this.fields, (field, key) =>
      _.has(this.fields[key], '$value') &&
        observe(this.fields[key], '$value', () =>
          this.validate({ key, showErrors: true, recursive: true })));
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
    const showErrors = _.has(opt, 'showErrors') ? opt.showErrors : obj.showErrors || true;
    const recursive = _.has(opt, 'recursive') ? opt.recursive : obj.recursive || false;

    const notShowErrorsEvents = ['clear', 'reset'];
    if (this.$options.showErrorsOnUpdate === false) notShowErrorsEvents.push('update');
    const $showErrors = showErrors && !this.eventsRunning(notShowErrorsEvents);

    if (_.isObject(opt) && !_.isString($key)) {
      // validate all fields
      return new Promise((resolve) => {
        this.validator.validateAll({
          recursive,
          showErrors: $showErrors,
          fields: this.fields,
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
        .validateField(this.fields, $key, $showErrors, recursive);
      // wait all promises then resolve
      return Promise.all(this.validator.promises)
        .then(() => resolve(this.fields[$key].isValid));
    });
  }

  /**
    Fields Selector
  */
  $(key) {
    const $key = _.replace(key, '.', '.fields.');
    // console.log('this.fields', this.fields);
    // console.log('_.get(this.fields, $key)', _.get(this.fields, $key));
    return _.get(this.fields, $key);
  }

  /**
    Fields Iterator
  */
  $map(key, callback) {
    const $field = this.$(key);
    const $obj = _.isEmpty($field.fields) ? $field : $field.fields;
    return _.map($obj, callback);
  }

  values() {
    return this.valuesRecursive(this.fields);
  }

  errors() {
    return this.errorsRecursive(this.fields);
  }

  invalidate(message) {
    this.validator.invalidate(message);
  }

  eventsRunning(events) {
    return _.intersection(events, this.events).length > 0;
  }

  @computed
  get hasError() {
    return _.some(this.fields, 'hasError')
      || _.isString(this.validator.genericErrorMessage);
  }

  @computed
  get isValid() {
    return _.every(this.fields, 'isValid')
      && !_.isString(this.validator.genericErrorMessage);
  }

  @computed
  get isDirty() {
    return _.some(this.fields, 'isDirty');
  }

  @computed
  get isPristine() {
    return _.every(this.fields, 'isPristine');
  }

  @computed
  get isDefault() {
    return _.every(this.fields, 'isDefault');
  }

  @computed
  get isEmpty() {
    return _.every(this.fields, 'isEmpty');
  }

  @computed
  get error() {
    return this.validator.genericErrorMessage;
  }

  @computed
  get genericError() {
    return this.validator.genericErrorMessage;
  }

  @action
  clear() {
    const $e = 'clear';
    this.events.push($e);
    this.clearRecursive(this.fields);
    this.events.pop($e);
  }

  @action
  reset() {
    const $e = 'reset';
    this.events.push($e);
    this.resetRecursive(this.fields);
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

      // _.each(data, (val, key) => {
      //   if (_.has(this.fields, key)) _.set(this.fields[key], `$${$}`, val);
      //   else if (isStrict) throw new Error(`${error} ${key}`);
      // });
    }

    this.events.pop($e);
  }

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
