import _ from "lodash";
import FieldInterface from "src/models/FieldInterface";
import FormInterface from "src/models/FormInterface";
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

export class VJF<TValidator = any> implements ValidationPluginInterface<TValidator> {
  promises: Promise<any>[];
  config: ValidationPluginConfig<TValidator>;
  state: any;
  extend?: (args: { validator: TValidator; form: FormInterface }) => void;
  validator: TValidator;

  constructor({
    config,
    state = null,
    promises = [],
  }: ValidationPluginConstructor<TValidator>) {
    this.state = state;
    this.promises = promises;
    this.config = config;
    this.extend = config?.extend;
    this.validator = config?.package;
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
    if (!field.validators) return;

    const validators = Array.isArray(field.validators) ? field.validators : [field.validators];

    validators.forEach((fn) => this.collectData(fn, field));

    this.executeValidation(field);
  }

  collectData(fn: Function, field: FieldInterface): void {
    const result = this.handleFunctionResult(fn, field);

    if (isPromise(result)) {
      const $p = result
        .then(([valid, message]) => field.setValidationAsyncData(valid, message))
        .then(() => this.executeAsyncValidation(field));

      this.promises.push($p);
      return;
    }

    field.validationFunctionsData.unshift({
      valid: result[0],
      message: result[1],
    });
  }

  executeValidation(field: FieldInterface): void {
    field.validationFunctionsData.forEach(({ valid, message }) => {
      if (valid === false) {
        field.invalidate(message, false);
      }
    });
  }

  executeAsyncValidation(field: FieldInterface): void {
    const data = field.validationAsyncData;
    if (data.valid === false) {
      field.invalidate(data.message, false, true);
    }
  }

  handleFunctionResult(fn: Function, field: FieldInterface): [boolean, string] | Promise<[boolean, string]> {
    const result = fn({
      validator: this.validator,
      form: this.state.form,
      field,
    });

    if (Array.isArray(result)) {
      return [result[0] || false, result[1] || "Error"];
    }

    if (_.isBoolean(result)) {
      return [result, "Error"];
    }

    if (_.isString(result)) {
      return [false, result];
    }

    if (isPromise(result)) {
      return result;
    }

    return [false, "Error"];
  }
}

export default <TValidator = any>(
  config?: ValidationPluginConfig<TValidator>
): ValidationPlugin<TValidator> => ({
    class: VJF<TValidator>,
    config,
  });