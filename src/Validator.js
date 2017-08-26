import { action, observable } from 'mobx';
import _ from 'lodash';

import { $try } from './utils';

import vjf from './validators/VJF'; // Vanilla JavaScript Functions
import svk from './validators/SVK'; // Json Schema Validation Keywords
import dvr from './validators/DVR'; // Declarative Validation Rules

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

  drivers = {};

  @observable error = null;

  constructor(obj = {}) {
    _.merge(this.plugins, obj.plugins);
    this.form = obj.form;
    this.schema = obj.schema || {};
    this.initDrivers({ vjf, dvr, svk });
    this.checkSVKValidationPlugin();
  }

  initDrivers(drivers) {
    _.map(drivers, (Class, key) => this.plugins[key] &&
      (this.drivers[key] = new Class(this.plugins[key], {
        schema: (key === 'svk') ? this.schema : null,
        options: this.form.state.options,
        promises: this.promises,
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
    this.error = null;

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

      // wait all promises
      resolve(Promise.all(this.promises));
    })
      .then(action(() => {
        instance.$validating = false;
        instance.$clearing = false;
        instance.$resetting = false;
      }))
      .catch(action((err) => {
        instance.$validating = false;
        instance.$clearing = false;
        instance.$resetting = false;
        throw err;
      }))
      .then(() => instance);
  }

  @action
  validateField({ field = null, path, showErrors = false, related = false }) {
    const instance = field || this.form.select(path);
    // check if the field is a valid instance
    if (!instance.path) throw new Error('Validation Error: Invalid Field Instance');
    // do not validate disabled fields
    if (instance.disabled && !this.form.state.options.get('validateDisabledFields')) return;
    // reset field validation
    instance.resetValidation();
    // validate with all drivers
    _.each(this.drivers, driver =>
      driver.validateField(instance, this.form));
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
