import { get } from "lodash";
import FieldInterface from "../models/FieldInterface";
import FormInterface from "../models/FormInterface";
import StateInterface from "../models/StateInterface";
import { ZodSchema } from "zod";
import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";

class ZOD<TValidator = any> implements ValidationPluginInterface {
  promises: Promise<any>[];
  config: ValidationPluginConfig;
  state: StateInterface;
  extend?: (args: { validator: TValidator; form: FormInterface }) => void;
  validator: any;
  schema: ZodSchema<any>;

  constructor({
    config,
    state = null,
    promises = [],
  }: ValidationPluginConstructor) {
    this.state = state;
    this.promises = promises;
    this.config = config;
    this.extend = config?.extend;
    this.validator = config.package;
    this.schema = config.schema as ZodSchema<any>;

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
    const result = this.schema.safeParse(field.state.form.flatMapValues);

    if (result.success) return;

    const fieldErrors = get(
      (result as any).error.format(),
      field.path
    )?._errors;

    if (fieldErrors?.length) {
      field.validationErrorStack = fieldErrors;
    }
  }
}

export default <TValidator = any>(
  config?: ValidationPluginConfig<TValidator>
): ValidationPlugin<TValidator> => ({
  class: ZOD<TValidator>,
  config,
});
