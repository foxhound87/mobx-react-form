import { computed, action, observable } from 'mobx';
import _ from 'lodash';

import VJF from './validators/VJF'; // Vanilla JavaScript Functions
import SVK from './validators/SVK'; // Json Schema Validation Keywords
import DVR from './validators/DVR'; // Declarative Validation Rules

export default class Validator {

  promises = [];

  options = {};

  schema = {};

  plugins = {
    vjf: true,
    svk: false,
    dvr: false,
  };

  validators = {
    vjf: null,
    svk: null,
    dvr: null,
  };

  @observable $genericErrorMessage = null;

  constructor(obj = {}) {
    this.assignInitData(obj);
    this.initializePlugins();
  }

  assignInitData({ options = {}, plugins = {}, schema = {} }) {
    _.merge(this.plugins, plugins);
    this.options = options;
    this.schema = schema;
  }

  initializePlugins() {
    /**
     Declarative Validation Rules
    */
    if (this.plugins.dvr) {
      this.validators.dvr = new DVR(this.plugins.dvr, {
        promises: this.promises,
        options: this.options,
      });
    }

    /**
      Vanilla JavaScript Functions
    */
    if (this.plugins.vjf) {
      this.validators.vjf = new VJF(this.plugins.vjf, {
        promises: this.promises,
        options: this.options,
      });
    }

    /**
     Schema Validation Keywords
    */
    if (this.plugins.svk) {
      this.validators.svk = new SVK(this.plugins.svk, {
        promises: this.promises,
        options: this.options,
        schema: this.schema,
      });
    }
  }

  @action
  validateAll({ form, showErrors = true, related = false }) {
    // reset generic error message
    this.resetGenericError();
    // validate all fields and nested fields
    this.validateAllDeep(form, form.fields, showErrors, related);
  }

  validateAllDeep(form, fields, showErrors, related) {
    if (!fields.size) return;

    fields.forEach((field) => {
      this.validateField({ form, field, path: field.path, showErrors, related });
      // recursive validation for nested fields
      if (field.fields.size) {
        this.validateAllDeep(form, field.fields, showErrors, related);
      }
    });
  }

  @action
  validateField({ form = null, field = null, path, showErrors = true, related = false }) {
    const $field = field || form.select(path);
    // reset field validation
    $field.resetValidation();
    // get all validators
    const { svk, dvr, vjf } = this.validators;
    // validate with vanilla js functions (vjf)
    if (vjf) vjf.validateField($field, form);
    // validate with json schema validation keywords (dvr)
    if (dvr) dvr.validateField($field, form);
    // validate with json schema validation keywords (svk)
    if (svk) svk.validateField($field);
    // send error to the view
    $field.showErrors(showErrors);
    // related validation
    if (related) this.relatedFieldValidation(form, $field, showErrors);
  }

  relatedFieldValidation(form, field, showErrors) {
    /*
      validate 'related' fields if specified
      and related validation allowed (recursive)
    */
    if (!_.isEmpty(field.related)) {
      _.each(field.related, path =>
        this.validateField({ form, path, showErrors, related: false }));
    }
  }

  @computed get genericErrorMessage() {
    return this.options.get('alwaysShowDefaultError')
      ? (this.$genericErrorMessage || this.options.get('defaultGenericError'))
      : this.$genericErrorMessage;
  }

  getDefaultErrorMessage() {
    // set defaultGenericError message from options
    const $default = this.options.get('defaultGenericError');
    if (_.isString($default)) return $default;
    return 'The form is invalid';
  }

  @action
  resetGenericError() {
    this.$genericErrorMessage = null;
  }

  @action
  invalidate(message = null) {
    // set custom genericErrorMessage if provided
    if (_.isString(message)) {
      this.$genericErrorMessage = message;
      return;
    }
    // if no string provided, show default error.
    this.$genericErrorMessage = this.getDefaultErrorMessage();
  }
}
