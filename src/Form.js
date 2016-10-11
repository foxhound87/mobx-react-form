import { action, computed, observe } from 'mobx';
import _ from 'lodash';

import Validator from './Validator';
import Field from './Field';

export default class Form {

  validator;

  events = [];

  fields = null;

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
    this.assignInitData(obj);
    this.initValidator(obj);
    this.initFields(obj);
    this.observeFields();

    if (this.$options.validateOnInit === true) {
      this.validate({
        showErrors: this.$options.showErrorsOnInit,
      });
    }

    // execute onInit if exists
    if (_.isFunction(this.onInit)) this.onInit(this);
  }

  assignInitData({ fields = {}, options = {} }) {
    this.fields = fields;
    this.options(options);
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

  initFields(obj = {}) {
    if (_.isArray(this.fields)) {
      this.fields = _.reduce(this.fields, ($obj, $) => {
        // as array of objects (with name as key and custom props)
        if (_.isObject($) && _.has($, 'name')) {
          return Object.assign($obj, { [$.name]: $ });
        }
        // as array of strings (with empty values)
        return Object.assign($obj, { [$]: '' });
      }, {});
    }

    if (_.isEmpty(this.fields) && _.has(obj, 'values')) {
      _.merge(this.fields, obj.values);
    }

    this.mergeSchemaDefaults();

    const keys = Object.keys(this.fields);
    keys.forEach(key => _.merge(this.fields, {
      [key]: new Field(key, this.fields[key], {
        $label: _.has(obj.labels, key) ? obj.labels[key] : null,
        $value: _.has(obj.values, key) ? obj.values[key] : null,
        $default: _.has(obj.defaults, key) ? obj.defaults[key] : null,
        $disabled: _.has(obj.disabled, key) ? obj.disabled[key] : null,
        $related: _.has(obj.related, key) ? obj.related[key] : null,
        $validate: _.has(obj.validate, key) ? obj.validate[key] : null,
        $rules: _.has(obj.rules, key) ? obj.rules[key] : null,
      }),
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
    // observe and validate each field
    _.each(this.fields, (field, key) =>
      observe(this.fields[key], '$value', () => {
        if (this.$options.validateOnChange === false) return;
        this.validate({ key, showErrors: true, recursive: true });
      }));
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

  submit(o = {}) {
    const execOnSuccess = _.has(o, 'onSuccess') ? o.onSuccess : this.onSuccess;
    const execOnError = _.has(o, 'onError') ? o.onError : this.onError;

    this.validate()
      .then(isValid => isValid
        ? execOnSuccess(this)
        : execOnError(this));
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
    _.each(this.fields, field => field.clear());
    this.events.pop($e);
  }

  @action
  reset() {
    const $e = 'reset';
    this.events.push($e);
    _.each(this.fields, field => field.reset());
    this.events.pop($e);
  }

  @action
  update($, data = null) {
    const $e = 'update';
    const error = 'You are updating a not existent field:';
    const isStrict = (this.$options.strictUpdate === true);
    this.events.push($e);

    // UPDATE FIELDS VALUE (default)
    if (_.isObject($) && !data) {
      // $ is the data
      _.each($, (val, key) => {
        if (_.has(this.fields, key)) this.fields[key].update(val);
        else if (isStrict) throw new Error(`${error} ${key}`);
      });
    }

    // UPDATE CUSTOM PROP
    if (_.isString($) && _.isObject(data)) {
      // $ is the prop key
      _.each(data, (val, key) => {
        if (_.has(this.fields, key)) _.set(this.fields[key], `$${$}`, val);
        else if (isStrict) throw new Error(`${error} ${key}`);
      });
    }

    this.events.pop($e);
  }

  /**
    On Submit
   */
  handleOnSubmit = (e, o = {}) => {
    e.preventDefault();
    this.submit(o);
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
