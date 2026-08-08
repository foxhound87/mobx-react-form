
import FieldInterface from "../models/FieldInterface";
import FormInterface from "../models/FormInterface";
import StateInterface from "../models/StateInterface";
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
  state: StateInterface | null;
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
      allErrors: true,
      coerceTypes: true,
      strict: false,
    };
  }

  initValidator(): void {
    const AJV = this.config.package as any;
    const validatorInstance = new AJV(this.extendOptions(this.config.options));

    if (typeof validatorInstance.addFormat === "function") {
      validatorInstance.addFormat("email", (value: any) =>
        typeof value === "string"
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          : false
      );
    }

    if (typeof this.extend === "function") {
      this.extend({
        form: this.state!.form,
        validator: validatorInstance,
      });
    }

    this.validator = validatorInstance.compile(this.schema);
  }

  validate(field: FieldInterface): void {
    const result = this.validator(field.state.form.flatMapValues);

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
    const fieldError = this.findError(field.path ?? '', errors);
    if (!fieldError) return;

    const message = `${field.label} ${fieldError.message}`;
    field.invalidate(message, false);
  }

  handleAsyncError(field: FieldInterface, errors: any[]): void {
    const fieldError = this.findError(field.path ?? '', errors);
    if (!fieldError) return;

    const message = `${field.label} ${fieldError.message}`;
    field.setValidationAsyncData(false, message);
  }

  normalizePath(value: any): string {
    return String(value)
      .replace(/^[./]+/, "")
      .replace(/\]/g, "")
      .replace(/\[/g, ".")
      .replace(/\//g, ".");
  }

  findError(path: string, errors: any[]): any {
    if (!errors) return;
    const $path = this.normalizePath(path);
    return errors.find(({ instancePath, dataPath }) => {
      const $dataPath = this.normalizePath(
        typeof instancePath === "string" ? instancePath : dataPath
      );
      return $dataPath.includes($path);
    });
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
  class: SVK<TValidator>,
  config,
});
