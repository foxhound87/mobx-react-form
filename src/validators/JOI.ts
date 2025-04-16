import _ from "lodash";
import FieldInterface from "src/models/FieldInterface";
import FormInterface from "src/models/FormInterface";
import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";

class JOI<TValidator = any> implements ValidationPluginInterface<TValidator> {
  promises: Promise<any>[];
  config: ValidationPluginConfig<TValidator>;
  state: any;
  extend?: (args: { validator: TValidator; form: FormInterface }) => void;
  validator: TValidator;
  schema: any;

  constructor({
    config,
    state = null,
    promises = [],
  }: ValidationPluginConstructor<TValidator>) {
    this.state = state;
    this.promises = promises;
    this.config = config;
    this.extend = config?.extend;
    this.validator = config.package;
    this.schema = config.schema;
    this.extendValidator();
  }

  extendValidator(): void {
    if (typeof this.extend === "function") {
      this.extend({
        validator: this.validator,
        form: this.state.form,
      });
    }
  }

  validate(field: FieldInterface): void {
    const data = this.state.form.validatedValues;
    const { error } = this.schema.validate(data, { abortEarly: false });

    if (!error) return;

    const fieldPathArray = field.path.split(".");

    const fieldErrors = error.details
      .filter((detail) => {
        const errorPathString = detail.path.join(".");
        const fieldPathString = fieldPathArray.join(".");
        return (
          errorPathString === fieldPathString ||
          errorPathString.startsWith(`${fieldPathString}.`)
        );
      })
      .map((detail) => {
        const label = detail.context?.label || detail.path.join(".");
        const message = detail.message.replace(`${detail.path.join(".")}`, label);
        return message;
      });

    if (fieldErrors.length) {
      field.validationErrorStack = fieldErrors;
    }
  }
}

export default <TValidator = any>(
  config?: ValidationPluginConfig<TValidator>
): ValidationPlugin<TValidator> => ({
    class: JOI<TValidator>,
    config,
  });