import { action, observable, computed, extendObservable } from 'mobx';
import FormField from './form.field';
import AJV from 'ajv';
import _ from 'lodash';

export default class Form {

  @observable fields = {};
  @observable validating = false;
  @observable genericErrorMessage = null;

  ajvValidate = null;
  ajvInstance = null;
  ajvOptions = null;
  ajvSchema = null;
  ajvExtend = null;

  constructor({ fields = {}, schema = false, options = {}, extend = null }) {
    const keys = Object.keys(fields);
    this.initAjv(schema, options, extend);
    this.initFields(keys, fields);
  }

  @action
  initFields(keys, obj) {
    keys.forEach((key) => extendObservable(this.fields, {
      [key]: new FormField(this, key, obj[key]),
    }));
  }

  @action
  initAjv(ajvSchema, ajvOptions = {}, ajvExtend) {
    if (!ajvSchema) return;
    // set ajv schema and options
    this.ajvSchema = ajvSchema;
    this.ajvOptions = ajvOptions;
    this.ajvExtend = ajvExtend;
    // create ajv instance
    this.ajvInstance = new AJV(_.merge(this.ajvOptions, {
      allErrors: true,
      coerceTypes: true,
    }));
    // extend with custom keywords
    if (this.ajvExtend) {
      _.forEach(this.ajvExtend, (val, key) =>
        this.ajvInstance.addKeyword(key, val));
    }
    // create ajvInstance validator (compiling rules)
    this.ajvValidate = this.ajvInstance.compile(this.ajvSchema);
  }

  fieldKeys() {
    return Object.keys(this.fields);
  }

  @computed
  get isValid() {
    if (this.validating) {
      return false; // consider the form invalid until the validation process finish
    }
    return this
      .fieldKeys()
      .reduce((seq, key) => {
        const field = this.fields[key];
        seq = seq && field.isValid; // eslint-disable-line no-param-reassign
        return seq;
      }, true);
  }

  @computed
  get isDirty() {
    return this
      .fieldKeys()
      .some(key => this.fields[key].isDirty);
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
    this
      .fieldKeys()
      .forEach((key) =>
        this.fields[key].reset());

    this.genericErrorMessage = null;
  }

  @action
  update(obj) {
    this
      .fieldKeys()
      .forEach((key) =>
        this.fields[key].update(obj[key]));
  }

  /* validation */

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
