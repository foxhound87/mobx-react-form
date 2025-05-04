import _ from "lodash";
import FieldInterface from "src/models/FieldInterface";
import FormInterface from "src/models/FormInterface";
import StateInterface from "src/models/StateInterface";
import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";

function isPromise(obj: any): obj is Promise<any> {
  return (
    !!obj &&
    typeof obj.then === "function" &&
    (typeof obj === "object" || typeof obj === "function")
  );
}

class SVK<TValidator = any> implements ValidationPluginInterface<TValidator> {
  promises: Promise<any>[];
  config: ValidationPluginConfig<TValidator>;
  state: StateInterface;
  extend?: (args: { validator: TValidator; form: FormInterface }) => void;
  validator: any;
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
    this.schema = config.schema;
    this.initValidator();
  }

  extendOptions(options: any = {}) {
    return {
      ...options,
      errorDataPath: "property",
      allErrors: true,
      coerceTypes: true,
      v5: true,
    };
  }

  initValidator(): void {
    const AJV = this.config.package as any;
    const validatorInstance = new AJV(this.extendOptions(this.config.options));

    if (typeof this.extend === "function") {
      this.extend({
        form: this.state.form,
        validator: validatorInstance,
      });
    }

    this.validator = validatorInstance.compile(this.schema);
  }

  validate(field: FieldInterface): void {
    const result = this.validator(field.state.form.validatedValues);

    if (isPromise(result)) {
      const $p = result
        .then(() => field.setValidationAsyncData(true))
        .catch((err) => err && this.handleAsyncError(field, err.errors))
        .then(() => this.executeAsyncValidation(field));

      this.promises.push($p);
      return;
    }

    this.handleSyncError(field, this.validator.errors);
  }

  handleSyncError(field: FieldInterface, errors: any[]): void {
    const fieldError = this.findError(field.path, errors);
    if (!fieldError) return;

    const message = `${field.label} ${fieldError.message}`;
    field.invalidate(message, false);
  }

  handleAsyncError(field: FieldInterface, errors: any[]): void {
    const fieldError = this.findError(field.path, errors);
    if (!fieldError) return;

    const message = `${field.label} ${fieldError.message}`;
    field.setValidationAsyncData(false, message);
  }

  findError(path: string, errors: any[]): any {
    return _.find(errors, ({ dataPath }) => {
      let $dataPath;
      $dataPath = _.trimStart(dataPath, ".");
      $dataPath = _.replace($dataPath, "]", "");
      $dataPath = _.replace($dataPath, "[", ".");
      return _.includes($dataPath, path);
    });
  }

  executeAsyncValidation(field: FieldInterface): void {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message, false, true);
    }
  }
}

export default <TValidator = any>(
  config?: ValidationPluginConfig<TValidator>
): ValidationPlugin<TValidator> => ({
    class: SVK<TValidator>,
    config,
});