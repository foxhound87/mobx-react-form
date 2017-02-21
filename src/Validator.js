import { computed, action, observable } from 'mobx';
import _ from 'lodash';
import { $try } from './parser';

import VJF from './validators/VJF'; // Vanilla JavaScript Functions
import SVK from './validators/SVK'; // Json Schema Validation Keywords
import DVR from './validators/DVR'; // Declarative Validation Rules

export default class Validator {

  promises = [];

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

  @observable $validating = false;

  @observable $genericErrorMessage = null;

  constructor(obj = {}) {
    this.assignInitData(obj);
    this.initializePlugins();
    this.checkSVKValidationPlugin();
  }

  assignInitData({ options = {}, plugins = {}, schema = {} }) {
    _.merge(this.plugins, plugins);
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

  validate(opt = {}, obj = {}) {
    action(() => (this.$validating = true))();
    action(() => (this.$genericErrorMessage = null))();

    const form = opt.form;
    const path = $try(opt.path, opt);
    const field = $try(opt.field, form.select(path, null, null));
    const related = $try(opt.related, obj.related, false);
    const $showErrors = $try(opt.showErrors, obj.showErrors, true);

    form.state.events.set('validate', field ? field.path : true);
    // look running events and choose when show errors messages
    const notShowErrorsEvents = ['clear', 'reset'];
    if (form.state.options.get('showErrorsOnUpdate') === false) notShowErrorsEvents.push('update');
    const showErrors = $showErrors && !form.state.events.running(notShowErrorsEvents);

    // wait all promises then resolve
    const $wait = resolve => Promise.all(this.promises)
      .then(action(() => (this.$validating = false)))
      .then(() => form.state.events.set('validate', false))
      .then(() => resolve(form.isValid));

    if (_.isPlainObject(opt) && !_.isString(path)) {
      // validate all fields
      return new Promise((resolve) => {
        this.validateAll({
          showErrors,
          related,
          form,
        });

        return $wait(resolve);
      });
    }

    // validate single field by path
    return new Promise((resolve) => {
      this.validateField({
        showErrors,
        related,
        form,
        field,
        path,
      });

      return $wait(resolve);
    });
  }

  @action
  validateAll({ form, showErrors = true, related = false }) {
    // validate all fields and nested fields
    form.forEach(field =>
      this.validateField({
        path: field.path,
        form,
        field,
        showErrors,
        related,
      }));
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

  /**
    Validate 'related' fields if specified
    and related validation allowed (recursive)
  */
  relatedFieldValidation(form, field, showErrors) {
    if (!field.related || !field.related.length) return;

    _.each(field.related, path =>
      this.validateField({ form, path, showErrors, related: false }));
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
