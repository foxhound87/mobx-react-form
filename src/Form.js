import { action, computed, observe } from 'mobx';
import _ from 'lodash';

import Validator from './Validator';
import Field from './Field';

export default class Form {

  validator;

  events = [];

  fields = {};

  options = {
    validateOnInit: true,
    showErrorsOnInit: false,
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

  initFields() {
    this.mergeSchemaDefaults();
    const keys = Object.keys(this.fields);
    keys.forEach(key => _.merge(this.fields, {
      [key]: new Field(key, this.fields[key]),
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
    _.each(this.fields, (field, key) =>
      observe(this.fields[key], '$value', () =>
        this.validate({ key, showErrors: true, recursive: true })));
  }

  validate(key = null, { showErrors = true, recursive = false } = {}) {
    this.validator.promises = []; // reset validator promises stack
    const $showErrors = showErrors && !this.eventsRunning(['clear', 'reset']);

    if (!_.isString(key)) {
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
        .validateField(this.fields, key, $showErrors, recursive);
      // wait all promises then resolve
      return Promise.all(this.validator.promises)
        .then(() => resolve(this.fields[key].isValid));
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
    _.each(obj, (val, key) =>
      this.fields[key].update(val));
  }
}
