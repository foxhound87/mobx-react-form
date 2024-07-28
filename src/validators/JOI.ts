import _ from "lodash";
import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";

class JOI implements ValidationPluginInterface {
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
    if (typeof this.extend === "function") {
      this.extend({
        validator: this.validator,
        form: this.state.form,
      });
    }
  }

  validate(field): void {
    const { error } = this.schema.validate(field.state.form.validatedValues, { abortEarly: false });
    if (!error) return;

    const fieldPathArray = field.path.split('.');

    const fieldErrors = error.details
      .filter(detail => {
        const errorPathString = detail.path.join('.');
        const fieldPathString = fieldPathArray.join('.');
        return errorPathString === fieldPathString || errorPathString.startsWith(`${fieldPathString}.`);
      })
      .map(detail => {
        // Replace the path in the error message with the custom label
        const label = detail.context?.label || detail.path.join('.');
        const message = detail.message.replace(`${detail.path.join('.')}`, label);
        return message;
      });

    if (fieldErrors.length) {
      field.validationErrorStack = fieldErrors;
    }
  }
}

export default (config?: ValidationPluginConfig): ValidationPlugin => ({
  class: JOI,
  config,
});
