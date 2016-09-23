import { action, observable } from 'mobx';
import _ from 'lodash';

import VJF from './validators/VJF'; // Vanilla JavaScript Functions
import SVK from './validators/SVK'; // Json Schema Validation Keywords
import DVR from './validators/DVR'; // Declarative Validation Rules

export default class Validator {

  promises = [];

  options = {};

  plugins = {
    vjf: true,
    svk: false,
    dvr: false,
  };

  validators = {
    vjf: null,
    svk: null,
    dvr: null,
  }

  @observable genericErrorMessage = null;

  constructor(obj = {}) {
    this.assignInitData(obj);
    this.initializePlugins(obj);
  }

  assignInitData({ options = {}, plugins = {} }) {
    _.merge(this.options, options);
    _.merge(this.plugins, plugins);
  }

  initializePlugins({ schema = {}, fields = {} }) {
    /**
      Vanilla JavaScript Functions
    */
    if (this.plugins.vjf === true) {
      this.validators.vjf = new VJF(this.plugins.vjf, {
        promises: this.promises,
        options: this.options,
        fields,
      });
    }

    /**
     Schema Validation Keywords
    */
    if (this.plugins.svk) {
      this.validators.svk = new SVK(this.plugins.svk, {
        promises: this.promises,
        options: this.options,
        schema,
      });
    }

    /**
     Declarative Validation Rules
    */
    if (this.plugins.dvr) {
      this.validators.dvr = new DVR(this.plugins.dvr, {
        promises: this.promises,
        options: this.options,
      });
    }
  }

  schema() {
    if (_.isNull(this.validators.svk)) return {};
    return this.validators.svk.schema;
  }

  @action
  validateAll({ fields, values = null, showErrors = true, recursive = false }) {
    const { svk } = this.validators;
    // reset generic error message
    this.genericErrorMessage = null;
    // validate with ajv
    if (svk) svk.validate(values);
    // validate all fields
    _.each(fields, (field, key) =>
      this.validateField(fields, key, showErrors, recursive));
  }

  validateField(fields, key, showErrors = true, recursive = false) {
    const field = fields[key];
    // reset field validation
    field.resetValidation();
    // get all validators
    const { svk, dvr, vjf } = this.validators;
    // validate with json schema validation keywords (svk)
    if (svk) svk.validateField(field);
    // validate with json schema validation keywords (dvr)
    if (dvr) dvr.validateField(field);
    // validate with vanilla js functions (vjf)
    if (vjf) vjf.validateField(field, fields);
    // send error to the view
    field.showErrors(showErrors);
    // recursive validation
    if (recursive) this.recursiveFieldValidation(fields, field, showErrors);
  }

  recursiveFieldValidation(fields, field, showErrors) {
    /*
      validate 'related' fields if specified
      and recursive validation allowed
    */
    if (!_.isEmpty(field.related)) {
      _.each(field.related, $rel =>
        this.validateField(fields, $rel, showErrors, false));
    }
  }

  getDefaultErrorMessage() {
    // set defaultGenericError message from options
    const $default = this.options.defaultGenericError;
    if (_.isString($default)) return $default;
    return 'The form is invalid';
  }

  @action
  resetGenericError() {
    this.genericErrorMessage = null;
  }

  @action
  invalidate(message = null) {
    // set custom genericErrorMessage if provided
    if (_.isString(message)) {
      this.genericErrorMessage = message;
      return;
    }
    // if no string provided, show default error.
    this.genericErrorMessage = this.getDefaultErrorMessage();
    return;
  }
}
