import {
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";
import _ from "lodash";

/**
  YUP - Dead simple Object schema validation

    const plugins = {
      yup: $yup({
        package: yup,
        schema: (y) => (),
        extend,
      }),
    };

*/

class YUP implements ValidationPluginInterface {
  promises = [];

  config = null;

  state = null;

  extend = null;

  validator = null;

  schema = null;

  constructor({
    config = {},
    state = null,
    promises = [],
  }: ValidationPluginConstructor) {
    this.state = state;
    this.promises = promises;
    this.extend = config.extend;
    this.validator = config.package || config;
    this.schema = config.schema(this.validator);
    this.extendValidator();
  }

  extendValidator() {
    // extend using "extend" callback
    if (typeof this.extend === 'function') {
      this.extend({
        validator: this.validator,
        form: this.state.form,
      });
    }
  }

  validate(field) {
    const $p = new Promise((resolve) =>
      this.validator
        .reach(this.schema, field.path)
        .label(field.label)
        .validate(field.validatedValue, { strict: true })
        .then(() => this.handleAsyncPasses(field, resolve))
        .catch((error) => this.handleAsyncFails(field, resolve, error))
    );

    this.promises.push($p);
  }

  handleAsyncPasses(field, resolve) {
    field.setValidationAsyncData(true);
    field.showAsyncErrors();
    resolve();
  }

  handleAsyncFails(field, resolve, error) {
    field.setValidationAsyncData(false, error.errors[0]);
    this.executeAsyncValidation(field);
    field.showAsyncErrors();
    resolve();
  }

  executeAsyncValidation(field) {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message, false, true);
    }
  }
}

export default (config?: any) => ({
  class: YUP,
  config,
});
