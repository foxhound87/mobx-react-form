import { computed, action, observable } from 'mobx';
import _ from 'lodash';
import { $try } from './parser';

import VJF from './validators/VJF'; // Vanilla JavaScript Functions
import SVK from './validators/SVK'; // Json Schema Validation Keywords
import DVR from './validators/DVR'; // Declarative Validation Rules

export default class Validator {

  promises = [];

  form = {};

  options = {};

  schema = {};

  plugins = {
    vjf: true,
    dvr: false,
    svk: false,
  };

  validators = {
    vjf: null,
    dvr: null,
    svk: null,
  };

  @observable $genericErrorMessage = null;

  constructor(obj = {}) {
    this.assignInitData(obj);
    this.initializePlugins();
    this.checkSVKValidationPlugin();
  }

  assignInitData({ form, options = {}, plugins = {}, schema = {} }) {
    _.merge(this.plugins, plugins);
    this.form = form;
    this.options = options;
    this.schema = schema;
  }

  initializePlugins() {
    _.map({
      vjf: VJF,
      dvr: DVR,
      svk: SVK,
    }, (Class, key) => this.plugins[key] &&
      (this.validators[key] = new Class(this.plugins[key], {
        schema: (key === 'svk') ? this.schema : null,
        promises: this.promises,
        options: this.options,
      })));
  }

  @action
  validate(opt = {}, obj = {}) {
    const path = $try(opt.path, opt);
    const field = $try(opt.field, this.form.select(path, null, null));
    const related = $try(opt.related, obj.related, true);
    const showErrors = $try(opt.showErrors, obj.showErrors, false);
    this.form.state.events.set('validate', field ? field.path : true);
    this.$genericErrorMessage = null;

    // wait all promises then resolve
    const $wait = (resolve, instance) => Promise.all(this.promises)
      .then(action(() => (instance.$validating = false))) // eslint-disable-line
      .then(() => this.form.state.events.set('validate', false))
      .then(() => resolve(instance));

    if (_.isPlainObject(opt) && !_.isString(path)) {
      // VALIDATE FORM
      this.form.$validating = true;
      // validate all fields
      return new Promise((resolve) => {
        this.validateAll({
          showErrors,
          related,
        });

        return $wait(resolve, this.form);
      });
    }

    // VALIDATE FIELD
    field.$validating = true;
    // validate single field by path
    return new Promise((resolve) => {
      this.validateField({
        showErrors,
        related,
        field,
        path,
      });

      return $wait(resolve, field);
    });
  }

  @action
  validateAll({ showErrors = false, related = false }) {
    // validate all fields and nested fields
    this.form.forEach(field =>
      this.validateField({
        path: field.path,
        field,
        showErrors,
        related,
      }));
  }

  @action
  validateField({ field = null, path, showErrors = false, related = false }) {
    const $field = field || this.form.select(path);
    // reset field validation
    $field.resetValidation();

    // get all validators
    const { svk, dvr, vjf } = this.validators;
    // validate with vanilla js functions (vjf)
    if (vjf) vjf.validateField($field, this.form);
    // validate with json schema validation keywords (dvr)
    if (dvr) dvr.validateField($field, this.form);
    // validate with json schema validation keywords (svk)
    if (svk) svk.validateField($field);
    // send error to the view
    $field.showErrors(showErrors);
    // related validation
    if (related) this.relatedFieldValidation($field, showErrors);
  }

  /**
    Validate 'related' fields if specified
    and related validation allowed (recursive)
  */
  relatedFieldValidation(field, showErrors) {
    if (!field.related || !field.related.length) return;

    _.each(field.related, path =>
      this.validateField({ path, showErrors, related: false }));
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
  invalidate(message = null) {
    // set custom genericErrorMessage if provided
    if (_.isString(message)) {
      this.$genericErrorMessage = message;
      return;
    }
    // if no string provided, show default error.
    this.$genericErrorMessage = this.getDefaultErrorMessage();
  }

  checkSVKValidationPlugin() {
    if (_.isNil(this.validators.svk) && !_.isEmpty(this.schema)) {
      // eslint-disable-next-line
      console.warn(
        'The SVK validation schema is defined',
        'but no plugin provided (SVK).',
      );
    }
  }
}
