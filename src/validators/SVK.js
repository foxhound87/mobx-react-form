import _ from 'lodash';
import utils from '../utils';

/**
  Schema Validation Keywords

    const plugins = {
      svk: {
        package: ajv,
        extend: callback,
      },
    };

*/
export default class SVK {

  validate = null;

  promises = [];

  schema = {};

  extend = null;

  options = {
    ajv: {
      v5: true,
      allErrors: true,
      coerceTypes: true,
      errorDataPath: 'property',
    },
  };

  constructor(plugin, obj = {}) {
    this.assignInitData(plugin, obj);
    this.initAJV(plugin);
  }

  assignInitData(plugin, { options = {}, schema = {}, promises = [] }) {
    _.merge(this.options, options);
    _.merge(this.schema, schema);
    this.promises = promises;
    this.extend = plugin.extend;
  }

  initAJV(plugin) {
    if (!this.schema) return;
    // get ajv package
    const AJV = plugin.package || plugin;
    // create ajv instance
    const ajvInstance = new AJV(this.options.ajv);
    // extend ajv using "extend" callback
    if (_.isFunction(this.extend)) this.extend(ajvInstance);
    // create ajvInstance validator (compiling rules)
    this.validate = ajvInstance.compile(this.schema);
  }

  validateField(field) {
    const data = { [field.name]: field.value };
    const validate = this.validate(this.parseValues(data));
    // check if is $async schema
    if (utils.isPromise(validate)) {
      if (!field.hasError) field.invalidate(this.loadingMessage(), true);
      const $p = validate
        .then(() => field.setValidationAsyncData({ valid: true, message: '' }))
        .catch(err => err && this.handleAsyncError(field, err.errors))
        .then(() => this.executeAsyncValidation(field))
        .then(() => field.showAsyncErrors());

      // push the promise into array
      this.promises.push($p);
      return;
    }
    // check sync errors
    this.handleSyncError(field);
  }

  handleSyncError(field) {
    const fieldErrorObj = _.find(this.validate.errors, item =>
      _.includes(item.dataPath, `.${field.path}`));
    // if fieldErrorObj is not undefined, the current field is invalid.
    if (_.isUndefined(fieldErrorObj)) return;
    // the current field is now invalid
    // add additional info to the message
    const msg = `${field.label} ${fieldErrorObj.message}`;
    // invalidate the current field with message
    field.invalidate(msg);
  }

  handleAsyncError(field, errors) {
    // find current field error message from ajv errors
    const fieldErrorObj = _.find(errors, item =>
      _.includes(item.dataPath, `.${field.path}`));
    // if fieldErrorObj is not undefined, the current field is invalid.
    if (_.isUndefined(fieldErrorObj)) return;
    // the current field is now invalid
    // add additional info to the message
    const msg = `${field.label} ${fieldErrorObj.message}`;
    // set async validation data on the field
    field.setValidationAsyncData({ valid: false, message: msg });
  }

  executeAsyncValidation(field) {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message, true);
    }
  }

  parseValues(values) {
    if (this.options.allowRequired === true) {
      return _.omitBy(values, (_.isEmpty || _.isNull || _.isUndefined || _.isNaN));
    }
    return values;
  }

  loadingMessage() {
    return this.options.loadingMessage || 'validating...';
  }
}
