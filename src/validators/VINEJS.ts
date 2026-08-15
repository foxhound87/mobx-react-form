import vine from "@vinejs/vine";
import FieldInterface from "../models/FieldInterface";
import FormInterface from "../models/FormInterface";
import StateInterface from "../models/StateInterface";
import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";

class VINEJS<TValidator = any> implements ValidationPluginInterface {
  promises: Promise<any>[] = [];
  config: ValidationPluginConfig<TValidator>;
  state: StateInterface | null;
  extend?: (args: { validator: TValidator; form: FormInterface }) => void;
  validator: any;
  schema: any;
  compiled: any;

  constructor({
    config,
    state = null,
    promises = [],
  }: ValidationPluginConstructor<TValidator>) {
    this.state = state;
    this.promises = promises;
    this.config = config;
    this.extend = config?.extend;
    this.validator = config.package ?? vine;
    this.schema = config.schema;
    this.compiled = this.validator.compile(this.schema);

    this.extendValidator();
  }

  extendValidator(): void {
    if (typeof this.extend === "function") {
      this.extend({
        validator: this.validator,
        form: this.state!.form,
      });
    }
  }

  // VineJS emits dot-notation paths (e.g. 'members.0.name') which match
  // the MRF field.path convention.
  validate(field: FieldInterface): void {
    const validationPromise = this.compiled
      .validate(field.state.form.flatMapValues)
      .then(() => field.setValidationAsyncData(true))
      .catch((error: any) => this.handleAsyncFail(field, error))
      .then(() => this.executeAsyncValidation(field));

    this.promises.push(validationPromise);
  }

  handleAsyncFail(field: FieldInterface, error: any): void {
    const messages = error?.messages ?? [];
    if (!messages.length) return;

    const fieldError = messages.find(
      (item: any) => item.field === field.path
    );

    if (fieldError) {
      field.setValidationAsyncData(false, fieldError.message);
    }
  }

  executeAsyncValidation(field: FieldInterface): void {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message ?? undefined, false, true);
    }
  }
}

export default <TValidator = any>(
  config?: ValidationPluginConfig<TValidator>
): ValidationPlugin<TValidator> => ({
  class: VINEJS<TValidator>,
  config,
});