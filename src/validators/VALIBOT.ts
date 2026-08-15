import * as v from "valibot";
import FieldInterface from "../models/FieldInterface";
import FormInterface from "../models/FormInterface";
import StateInterface from "../models/StateInterface";
import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";

class VALIBOT<TValidator = any> implements ValidationPluginInterface {
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
    this.validator = config.package ?? v;
    this.schema = config.schema;

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

  // Convert a Valibot issue.path (array of { key }) into an MRF-style string path
  // e.g. [{ key: 'members' }, { key: 0 }, { key: 'name' }] => 'members.0.name'
  normalizePath(issuePath: any[] = []): string {
    return issuePath.map((seg) => seg?.key).join(".");
  }

  validate(field: FieldInterface): void {
    const result = v.safeParse(this.schema, field.state.form.flatMapValues);

    if (result.success) return;

    const messages = result.issues
      .filter((issue: any) => this.normalizePath(issue.path) === field.path)
      .map((issue: any) => issue.message);

    if (messages?.length) {
      field.validationErrorStack = messages;
    }
  }
}

export default <TValidator = any>(
  config?: ValidationPluginConfig<TValidator>
): ValidationPlugin<TValidator> => ({
  class: VALIBOT<TValidator>,
  config,
});