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
    return new Promise((resolve) => {
      this.schema
        .validateAt(field.path, this.state.form.values(), { strict: true })
        .then(() => this.handleAsyncPasses(field, resolve))
        .catch((error) => this.handleAsyncFails(field, resolve, error));
    });
  }
  // Gestione dei successi della validazione asincrona
  private handleAsyncPasses(field: any, resolve: Function): void {
    field.setValidationAsyncData(true);
    resolve();
  }

  // Gestione dei fallimenti della validazione asincrona
  private handleAsyncFails(field: any, resolve: Function, error: any): void {
    // Yup a volte restituisce errori senza path (es. array vuoti)
    const isSameField = error.path === field.path || error.path === undefined;

    if (isSameField) {
      const message = error.message?.replace(error.path ?? field.path, field.label);
      field.setValidationAsyncData(false, message);
      this.executeAsyncValidation(field);
    }

    resolve(undefined);
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