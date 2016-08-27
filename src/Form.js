import { action, computed, observe } from 'mobx';
import _ from 'lodash';

import Validator from './Validator';
import Field from './Field';

export default class Form {

  validator;

  fields = {};
  events = [];

  constructor(obj = {}) {
    this.assignInitData(obj);
    this.initValidator(obj);
    this.mergeSchemaDefaults();
    this.initFields();
    this.observeFields();
    this.validate({
      showErrors: false,
    });
  }

  assignInitData({ fields = {} }) {
    this.fields = fields;
  }

  initValidator(obj = {}) {
    this.validator = new Validator(obj);
  }

  mergeSchemaDefaults() {
    if (Object.keys(this.fields).length === 0 && !!this.validator.schema) {
      const properties = this.validator.schema.properties;
      Object.keys(properties).forEach((property) => {
        const label = properties[property].title;
        const value = properties[property].default;
        this.fields[property] = { label, value }; // eslint-disable-line no-param-reassign
      });
    }
  }

  initFields() {
    const keys = Object.keys(this.fields);
    keys.forEach((key) => _.merge(this.fields, {
      [key]: new Field(key, this.fields[key]),
    }));
  }

  observeFields() {
    _.each(this.fields, (field, key) =>
      observe(this.fields[key], '$value', () =>
        this.validate({ key, showErrors: true, recursive: true })));
  }

  validate({ key = null, showErrors = true, recursive = false } = {}) {
    const $showErrors = showErrors && !this.eventsRunning(['clear', 'reset']);

    // validate all fields
    if (!key) {
      this.validator.validateAll({
        recursive,
        showErrors: $showErrors,
        fields: this.fields,
        values: this.values(),
      });
    }

    // validate single field by key
    if (key) {
      this.validator
        .validateField(this.fields, key, $showErrors, recursive);
    }

    // return validation status
    return this.isValid;
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

  @computed
  get genericErrorMessage() {
    return this.validator.genericErrorMessage;
  }

  @action
  clear() {
    const $e = 'clear';
    this.events.push($e);
    this.validator.genericErrorMessage = null;
    _.each(this.fields, (field) => field.clear());
    this.events.pop($e);
  }

  @action
  reset() {
    const $e = 'reset';
    this.events.push($e);
    this.validator.genericErrorMessage = null;
    _.each(this.fields, (field) => field.reset());
    this.events.pop($e);
  }

  update(obj) {
    _.each(obj, (val, key) =>
      this.fields[key].update(val));
  }

  syncValue = (e) => {
    const currentVal = this.fields[e.target.name].value;

    // checkbox
    if (_.isBoolean(currentVal) && _.isBoolean(e.target.checked)) {
      this.fields[e.target.name].setValue(e.target.checked);
      return;
    }

    // text
    this.fields[e.target.name].setValue(e.target.value);
    return;
  }
}
