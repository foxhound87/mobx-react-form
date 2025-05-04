import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";
import FormInterface from "src/models/FormInterface";
import StateInterface from "src/models/StateInterface";

class YUP<TValidator = any> implements ValidationPluginInterface {
  promises: Promise<any>[] = [];
  config: ValidationPluginConfig<TValidator>;
  state: StateInterface;
  extend?: (args: { validator: TValidator; form: FormInterface }) => void;
  validator: TValidator;
  schema: any;

  constructor({
    config,
    state = null,
    promises = [],
  }: ValidationPluginConstructor) {
    this.state = state;
    this.promises = promises;
    this.extend = config?.extend;
    this.validator = config.package;
    this.schema = config.schema(this.validator);
    this.extendValidator();
  }

  // Metodo per estendere il validatore
  extendValidator(): void {
    if (typeof this.extend === 'function') {
      this.extend({
        validator: this.validator,
        form: this.state.form,
      });
    }
  }

  // Metodo di validazione principale
  validate(field: any): void {
    const fieldValidationPromise = this.createValidationPromise(field);
    this.promises.push(fieldValidationPromise);
  }

  // Creazione della promise per la validazione
  private createValidationPromise(field: any): Promise<any> {
    return new Promise((resolve) =>
      (this.validator as any)
        .reach(this.schema, field.path)
        .label(field.label)
        .validate(field.validatedValue, { strict: true })
        .then(() => this.handleAsyncPasses(field, resolve))
        .catch((error) => this.handleAsyncFails(field, resolve, error))
    );
  }

  // Gestione dei successi della validazione asincrona
  private handleAsyncPasses(field: any, resolve: Function): void {
    field.setValidationAsyncData(true);
    resolve();
  }

  // Gestione dei fallimenti della validazione asincrona
  private handleAsyncFails(field: any, resolve: Function, error: any): void {
    field.setValidationAsyncData(false, error.errors[0]);
    this.executeAsyncValidation(field);
    resolve();
  }

  // Esecuzione della validazione asincrona
  private executeAsyncValidation(field: any): void {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message, false, true);
    }
  }
}

export default <TValidator = any>(
  config?: ValidationPluginConfig<TValidator>
): ValidationPlugin<TValidator> => ({
    class: YUP<TValidator>,
    config,
  });