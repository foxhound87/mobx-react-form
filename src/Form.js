import { action, computed, observe } from 'mobx';
import _ from 'lodash';

import Validator from './Validator';
import Field from './Field';

export default class Form {

  validator;

  events = [];

  fields = {};

  options = {
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
    this.assignInitData(obj);
    this.initValidator(obj);
    this.initFields(obj);
    this.observeFields();

    if (this.options.validateOnInit === true) {
      this.validate({
        showErrors: this.options.showErrorsOnInit,
      });
    }
  }

  assignInitData({ fields = {}, options = {} }) {
    _.merge(this.fields, fields);
    _.merge(this.options, options);
  }

  initValidator(obj = {}) {
    this.validator = new Validator(obj);
  }

  initFields(obj = {}) {
    this.mergeSchemaDefaults();
    const keys = Object.keys(this.fields);
    keys.forEach(key => _.merge(this.fields, {
      [key]: new Field(
        key, this.fields[key],
        _.has(obj.labels, key) ? obj.labels[key] : null
      ),
    }));
  }

  mergeSchemaDefaults() {
    const schema = this.validator.schema();
    const properties = schema.properties;
    if (Object.keys(this.fields).length === 0 && !!properties) {
      Object.keys(properties).forEach((property) => {
        const label = properties[property].title;
        const value = properties[property].default;
        this.fields[property] = { label, value }; // eslint-disable-line no-param-reassign
      });
    }
  }

  observeFields() {
    if (this.options.validateOnChange === false) return;
    // observe and validate each field
    _.each(this.fields, (field, key) =>
      observe(this.fields[key], '$value', () =>
        this.validate({ key, showErrors: true, recursive: true })));
  }

  validate(opt = {}, obj = {}) {
    const $key = _.has(opt, 'key') ? opt.key : opt;
    const showErrors = _.has(opt, 'showErrors') ? opt.showErrors : obj.showErrors || true;
    const recursive = _.has(opt, 'recursive') ? opt.recursive : obj.recursive || false;

    const notShowErrorsEvents = ['clear', 'reset'];
    if (this.options.showErrorsOnUpdate === false) notShowErrorsEvents.push('update');
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
    Field selector shortcut
  */
  $(key) {
    return this.fields[key];
  }

  values() {
    return _.mapValues(this.fields, 'value');
  }

  errors() {
    return _.mapValues(this.fields, 'error');
  }

  invalidate(message) {
    this.validator.invalidate(message);
  }

  eventsRunning(events) {
    return _.intersection(events, this.events).length > 0;
  }

  @computed
  get hasError() {
    return _.some(this.fields, 'hasError');
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
  get isValid() {
    return _.every(this.fields, 'isValid');
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
    this.validator.genericErrorMessage = null;
    _.each(this.fields, field => field.clear());
    this.events.pop($e);
  }

  @action
  reset() {
    const $e = 'reset';
    this.events.push($e);
    this.validator.genericErrorMessage = null;
    _.each(this.fields, field => field.reset());
    this.events.pop($e);
  }

  update(obj) {
    const $e = 'update';
    this.events.push($e);

    if (this.options.strictUpdate === false) {
      _.each(obj, (val, key) => _.has(this.fields, key)
        && this.fields[key].update(val));
    }

    if (this.options.strictUpdate === true) {
      _.each(obj, (val, key) => {
        if (_.has(this.fields, key)) return this.fields[key].update(val);
        throw new Error(`You are updating a not existent field: ${key}`);
      });
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
