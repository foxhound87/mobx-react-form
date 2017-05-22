import { computed, action, observable } from 'mobx';
import _ from 'lodash';

import { $try } from './utils';

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

  drivers = {
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
      (this.drivers[key] = new Class(this.plugins[key], {
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
    const instance = field || this.form;
    instance.$validating = true;
    this.$genericErrorMessage = null;

    return new Promise((resolve) => {
      // validate instance (form or filed)
      if (instance.path || _.isString(path)) {
        this.validateField({
          field: instance,
          showErrors,
          related,
          path,
        });
      }

      // validate nested fields
      instance.each($field =>
        this.validateField({
          path: $field.path,
          field: $field,
          showErrors,
          related,
        }));

      // wait all promises then resolve
      return Promise.all(this.promises)
        .then(action(() => (instance.$validating = false))) // eslint-disable-line
        .catch(action((err) => {
          // eslint-disable-next-line
          instance.$validating = false;
          throw err;
        }))
        .then(() => resolve(instance));
    });
  }

  @action
  validateField({ field = null, path, showErrors = false, related = false }) {
    const instance = field || this.form.select(path);
    // reset field validation
    if (instance.path) instance.resetValidation();
    // get all validators
    const { svk, dvr, vjf } = this.drivers;
    // validate with vanilla js functions (vjf)
    if (vjf) vjf.validateField(instance, this.form);
    // validate with json schema validation keywords (dvr)
    if (dvr) dvr.validateField(instance, this.form);
    // validate with json schema validation keywords (svk)
    if (svk) svk.validateField(instance);
    // send error to the view
    instance.showErrors(showErrors);
    // related validation
    if (related) this.relatedFieldValidation(instance, showErrors);
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
    if (_.isNil(this.drivers.svk) && !_.isEmpty(this.schema)) {
      // eslint-disable-next-line
      console.warn(
        'The SVK validation schema is defined',
        'but no plugin provided (SVK).',
      );
    }
  }
}
