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
  };

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
    if (this.plugins.vjf) {
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
  validateAll({ form, showErrors = true, related = false }) {
    // reset generic error message
    this.resetGenericError();
    // validate all fields and nested fields
    this.validateAllDeep(form, form.fields, showErrors, related);
  }

  validateAllDeep(form, fields, showErrors, related, path = '') {
    if (!fields.size) return;

    fields.forEach((field, key) => {
      const $path = _.trimStart(`${path}.${key}`, '.');
      this.validateField({ form, field, key, showErrors, related });
      // recursive validation for nested fields
      if (field.fields.size) {
        this.validateAllDeep(form, field.fields, showErrors, related, $path);
      }
    });
  }

  @action
  validateField({ form = null, field = null, key, showErrors = true, related = false }) {
    const $field = field || form.fields.get(key) || form.select(key, form.fields);
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
      _.each(field.related, key =>
        this.validateField({ form, key, showErrors, related: false }));
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
  }
}
