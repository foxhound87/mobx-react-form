import { action, observable, computed, extendObservable } from 'mobx';
import FormField from './form.field';
import AJV from 'ajv';
import _ from 'lodash';

export default class Form {

  @observable fields = {};
  @observable validating = false;
  @observable genericErrorMessage = null;

  ajvValidate = false;
  ajvInstance;
  ajvOptions;
  ajvSchema;

  constructor(obj = {}, ajvSchema = false, ajvOptions = {}) {
    const keys = Object.keys(obj);
    this.initAjv(ajvSchema, ajvOptions);
    this.initFields(keys, obj);
  }

  @action
  initFields(keys, obj) {
    keys.forEach((key) => extendObservable(this.fields, {
      [key]: new FormField(this, key, obj[key]),
    }));
  }

  @action
  initAjv(ajvSchema, ajvOptions = {}) {
    if (!ajvSchema) return;
    // set ajv schema and options
    this.ajvSchema = ajvSchema;
    this.ajvOptions = ajvOptions;
    // create ajv instance
    this.ajvInstance = new AJV(_.merge(this.ajvOptions, {
      allErrors: true,
      coerceTypes: true,
    }));
    // create ajvInstance validator (compiling rules)
    this.ajvValidate = this.ajvInstance.compile(this.ajvSchema);
  }

  @computed get valid() {
    if (this.validating) {
      return false; // consider the form invalid until the validation process finish
    }
    return this
      .fieldKeys()
      .reduce((seq, key) => {
        const field = this.fields[key];
        seq = seq && field.valid; // eslint-disable-line no-param-reassign
        return seq;
      }, true);
  }

  values() {
    return _.mapValues(this.fields, 'value');
  }

  fieldKeys() {
    return Object.keys(this.fields);
  }

  @action
  clear() {
    this
      .fieldKeys()
      .forEach((key) =>
        this.fields[key].clear());
  }

  @action
  validate() {
    this.validating = true;

    // Check with with "ajv" rules (exit on fail)
    if (!this.checkAjvValidation()) return false;

    // Check with "validate" Function
    return this.checkFunctionValidation();
  }

  @action
  checkAjvValidation() {
    if (this.ajvValidate) {
      const validate = this.ajvValidate;
      const formIsValid = validate(this.values());
      if (!formIsValid) {
        this.genericErrorMessage = 'An error occurred. Validation has failed.';
        this.validating = false;
        return false;
      }
    }
    this.validating = false;
    return true;
  }

  @action
  checkFunctionValidation() {
    return this
      .fieldKeys()
      .reduce((seq, key) => {
        const field = this.fields[key];
        return seq.then(() => field.validate(true));
      }, Promise.resolve())
      .then(action(() => { this.validating = false; }));
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
