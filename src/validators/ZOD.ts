import _ from "lodash";
import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";

class ZOD implements ValidationPluginInterface {

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
    this.validator = config.package;
    this.schema = config.schema;
    this.extendValidator();
  }

  extendValidator(): void {
    // extend using "extend" callback
    if (typeof this.extend === 'function') {
      this.extend({
        validator: this.validator,
        form: this.state.form,
      });
    }
  }

  validate(field): void {
    const result = this.schema.safeParse(field.state.form.validatedValues);
    if (result.success) return;
    const errors = _.get(result.error.format(), field.path)?._errors;
    if (errors?.length) field.validationErrorStack = errors;
  }
}

export default (config?: ValidationPluginConfig): ValidationPlugin => ({
  class: ZOD,
  config,
});
