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
    this.$genericErrorMessage = null;

    // wait all promises then resolve
    const $wait = (resolve, instance) => Promise.all(this.promises)
      .then(action(() => (instance.$validating = false))) // eslint-disable-line
      .then(() => resolve(instance));

    const instance = field || this.form;

    instance.$validating = true;

    return new Promise((resolve) => {
      if (instance.path || _.isString(path)) {
        this.validateField({
          field: instance,
          showErrors,
          related,
          path,
        });
      }

      instance.each($field =>
        this.validateField({
          path: $field.path,
          $field,
          showErrors,
          related,
        }));

      return $wait(resolve, instance);
    });
  }

  @action
  validateField({ field = null, path, showErrors = false, related = false }) {
    const $field = field || this.form.select(path);
    // reset field validation
    $field.resetValidation();
    // get all validators
    const { svk, dvr, vjf } = this.drivers;
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
    if (_.isNil(this.drivers.svk) && !_.isEmpty(this.schema)) {
      // eslint-disable-next-line
      console.warn(
        'The SVK validation schema is defined',
        'but no plugin provided (SVK).',
      );
    }
  }
}
