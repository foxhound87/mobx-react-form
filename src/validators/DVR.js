import _ from 'lodash';

/**
 Declarative Validation Rules

  const plugins = {
    dvr: {
      validatorjs: {
        package: validatorjs,
        extend: callback,
      },
    },
  };

*/
export default class DVR {

  promises = [];

  asyncRules = [];

  validators = {};

  validator = null;

  extend = null;

  options = {};

  constructor(plugin, obj = {}) {
    this.assignInitData(plugin, obj);
    this.extendValidator();
  }

  assignInitData(plugin, { options = {}, promises = [] }) {
    _.merge(this.options, options);
    this.promises = promises;
    this.extend = plugin.extend;
    this.validator = plugin.package || plugin;
  }

  extendValidator() {
    // extend the validator with custom "registerAsyncRule" method
    _.extend(this.validator, {
      registerAsyncRule: (key, callback) => this.registerAsyncRule(key, callback),
    });
    // extend ajv using "extend" callback
    if (_.isFunction(this.extend)) this.extend(this.validator);
  }

  validateField(field) {
    this.validateFieldAsync(field);
    this.validateFieldSync(field);
  }

  validateFieldSync(field) {
    const $rules = this.rules(field.rules, 'sync');
    // exit if no rules found
    if (_.isEmpty($rules[0])) return;
    // get field data and rules
    const data = { [field.key]: field.value };
    const rules = { [field.key]: $rules };
    // create the validator instance
    const Validator = this.validator;
    const validation = new Validator(data, rules);
    // set label into errors messages instead key
    validation.setAttributeNames({ [field.key]: field.label });
    // check validation
    if (validation.passes()) return;
    // the validation is failed, set the field errorbre
    field.setInvalid(_.first(validation.errors.get(field.key)));
  }

  validateFieldAsync(field) {
    const $rules = this.rules(field.rules, 'async');
    // exit if no rules found
    if (_.isEmpty($rules[0])) return;
    // get field data and rules
    const data = { [field.key]: field.value };
    const rules = { [field.key]: $rules };
    // create the validator instance
    const Validator = this.validator;
    const validation = new Validator(data, rules);
    // set label into errors messages instead key
    validation.setAttributeNames({ [field.key]: field.label });
    // handle async fails
    if (!field.hasError) field.setInvalid(this.loadingMessage(), true);

    const $p = new Promise((resolve) => {
      validation.passes(() => this.handleAsyncPasses(field, resolve));
      validation.fails(() => this.handleAsyncFails(field, validation, resolve));
    });

    this.promises.push($p);
  }

  handleAsyncPasses(field, resolve) {
    field.setValidationAsyncData({ valid: true, message: '' });
    field.showAsyncErrors();
    resolve();
  }

  handleAsyncFails(field, validation, resolve) {
    field.setValidationAsyncData({
      valid: false,
      message: _.first(validation.errors.get(field.key)),
    });
    this.executeAsyncValidation(field);
    field.showAsyncErrors();
    resolve();
  }

  executeAsyncValidation(field) {
    if (field.validationAsyncData.valid === false) {
      field.setInvalid(field.validationAsyncData.message, true);
    }
  }

  registerAsyncRule(key, callback) {
    this.asyncRules.push(key);
    this.validator.registerAsync(key, callback);
  }

  rules(rules, type) {
    let diff = [];
    const $rules = _.split(rules, '|');
    if (type === 'sync') diff = _.difference($rules, this.asyncRules);
    if (type === 'async') diff = _.intersection($rules, this.asyncRules);
    return diff;
  }

  loadingMessage() {
    return this.options.loadingMessage || 'validating...';
  }
}
