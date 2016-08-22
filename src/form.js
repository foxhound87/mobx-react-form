import { action, observable, computed, observe } from 'mobx';
import AJV from 'ajv';
import _ from 'lodash';
import FormField from './form.field';

export default class Form {

  schema = null;
  options = null;
  extend = null;
  ajv = null;

  @observable fields = {};
  @observable validating = false;
  @observable genericErrorMessage = null;

  constructor(obj = {}) {
    this.assignInitData(obj);
    this.mergeSchemaDefaults();
    this.initAjv();
    this.initFields();
    this.validateFields(false, false);
    this.observeFields();
  }

  @action
  assignInitData({ fields = {}, schema = false, options = {}, extend = null }) {
    this.fields = fields;
    this.schema = schema;
    this.options = options;
    this.extend = extend;
  }

  @action
  mergeSchemaDefaults() {
    if (Object.keys(this.fields).length === 0 && !!this.schema) {
      Object.keys(this.schema.properties).forEach((property) => {
        const label = this.schema.properties[property].title;
        const value = this.schema.properties[property].default;
        this.fields[property] = { label, value }; // eslint-disable-line no-param-reassign
      });
    }
  }

  @action
  initFields(opt = {}) {
    const keys = this.fieldKeys();
    keys.forEach((key) => _.merge(this.fields, {
      [key]: new FormField(key, this.fields[key], opt),
    }));
  }

  @action
  initAjv() {
    if (!this.schema) return;
    // create ajv instance
    const ajvInstance = new AJV(_.merge(this.options, {
      allErrors: true,
      coerceTypes: true,
      v5: true,
    }));
    // extend with custom keywords
    if (this.extend) {
      _.forEach(this.extend, (val, key) =>
        ajvInstance.addKeyword(key, val));
    }
    // create ajvInstance validator (compiling rules)
    this.ajv = ajvInstance.compile(this.schema);
  }

  @action
  observeFields() {
    _.forEach(this.fields, (val, key) =>
      observe(this.fields[key], '$value', () =>
        this.validateField(key, true)));
  }

  validateFields(showErrors = true) {
    _.forEach(this.fields, (field) =>
      field.validate(showErrors, this));
  }

  validateField(key = null, recursive = false, showErrors = true) {
    if (!key) throw new Error('validateField: No field key provided');

    // validate field by key
    this.fields[key].validate(showErrors, this);

    /*
      validate 'related' fields if specified
      and recursive validation allowed
    */
    if (!recursive) return;
    const related = this.fields[key].related;
    if (!_.isEmpty(related)) {
      _.forEach(related, ($rel) =>
        this.validateField($rel));
    }
  }

  fieldKeys() {
    return Object.keys(this.fields);
  }

  @computed
  get isValid() {
    return _.every(this.fields, 'isValid');
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
  get isEmpty() {
    return _.every(this.fields, 'isEmpty');
  }

  values() {
    return _.mapValues(this.fields, 'value');
  }

  @action
  clear() {
    this
      .fieldKeys()
      .forEach((key) =>
        this.fields[key].clear());

    this.genericErrorMessage = null;
  }

  @action
  reset() {
    _.forEach(this.fields, (val, key) =>
      this.fields[key].reset());

    this.genericErrorMessage = null;
  }

  @action
  update(obj) {
    _.forEach(obj, (val, key) => {
      if (this.fields.hasOwnProperty(key)) {
        this.fields[key].update(val);
      }
    }
  }

  @action
  validate() {
    this.validateFields();

    // Check with with "ajv" rules (exit on fail)
    if (!this.checkGenericAjvValidation()) return false;

    // return the fields validation status
    return this.isValid;
  }

  @action
  checkGenericAjvValidation() {
    this.genericErrorMessage = null;

    if (this.ajv) {
      const formIsValid = this.ajv(this.values());
      if (!formIsValid) {
        this.genericErrorMessage = 'An error occurred. Validation has failed.';
        return false;
      }
    }

    return true;
  }

  @computed
  get genericError() {
    return this.genericErrorMessage;
  }

  @action
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

  @action
  invalidate(errors) {
    if (_.isString(errors)) {
      this.genericErrorMessage = errors;
      return;
    }
    this.genericErrorMessage = 'An error occurred sending request.';
    return;
  }
}
