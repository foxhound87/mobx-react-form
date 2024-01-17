import _ from "lodash";
import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";

const isPromise = (obj) =>
  !!obj &&
  typeof obj.then === "function" &&
  (typeof obj === "object" || typeof obj === "function");

/**
  Schema Validation Keywords

    const plugins = {
      svk: svk({
        package: ajv,
        extend: callback,
      }),
    };

*/
class SVK implements ValidationPluginInterface {
  promises = [];

  config = null;

  state = null;

  extend = null;

  validator = null;

  schema = null;

  constructor({
    config,
    state = null,
    promises = [],
  }: ValidationPluginConstructor) {
    this.state = state;
    this.promises = promises;
    this.extend = config?.extend;
    this.schema = config.schema;
    this.initAJV(config);
  }

  extendOptions(options = {}) {
    return Object.assign(options, {
      errorDataPath: "property",
      allErrors: true,
      coerceTypes: true,
      v5: true,
    });
  }

  initAJV(config) {
    // get ajv package
    const ajv = config.package;
    // create ajv instance
    const validator = new ajv(this.extendOptions(config.options));
    // extend ajv using "extend" callback
    if (typeof this.extend === 'function') {
      this.extend({
        form: this.state.form,
        validator,
      });
    }
    // create ajv validator (compiling rules)
    this.validator = validator.compile(this.schema);
  }

  validate(field) {
    const validate = this.validator(field.state.form.validatedValues);
    // check if is $async schema
    if (isPromise(validate)) {
      const $p = validate
        .then(() => field.setValidationAsyncData(true))
        .catch((err) => err && this.handleAsyncError(field, err.errors))
        .then(() => this.executeAsyncValidation(field));

      // push the promise into array
      this.promises.push($p);
      return;
    }
    // check sync errors
    this.handleSyncError(field, this.validator.errors);
  }

  handleSyncError(field, errors) {
    const fieldErrorObj = this.findError(field.path, errors);
    // if fieldErrorObj is not undefined, the current field is invalid.
    if (_.isUndefined(fieldErrorObj)) return;
    // the current field is now invalid
    // add additional info to the message
    const msg = `${field.label} ${fieldErrorObj.message}`;
    // invalidate the current field with message
    field.invalidate(msg, false);
  }

  handleAsyncError(field, errors) {
    // find current field error message from ajv errors
    const fieldErrorObj = this.findError(field.path, errors);
    // if fieldErrorObj is not undefined, the current field is invalid.
    if (_.isUndefined(fieldErrorObj)) return;
    // the current field is now invalid
    // add additional info to the message
    const msg = `${field.label} ${fieldErrorObj.message}`;
    // set async validation data on the field
    field.setValidationAsyncData(false, msg);
  }

  findError(path, errors) {
    return _.find(errors, ({ dataPath }) => {
      let $dataPath;
      $dataPath = _.trimStart(dataPath, ".");
      $dataPath = _.replace($dataPath, "]", "");
      $dataPath = _.replace($dataPath, "[", ".");
      return _.includes($dataPath, path);
    });
  }

  executeAsyncValidation(field) {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message, false, true);
    }
  }
}

export default (config?: ValidationPluginConfig): ValidationPlugin => ({
  class: SVK,
  config,
});
