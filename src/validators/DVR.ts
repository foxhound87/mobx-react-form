import { filter, forIn, head, isEmpty, isString, split } from "lodash";
import FieldInterface from "../models/FieldInterface";
import FormInterface from "../models/FormInterface";
import StateInterface from "../models/StateInterface";
import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";

export class DVR<TValidator = any>
  implements ValidationPluginInterface<TValidator>
{
  promises: Promise<any>[];
  config: any;
  state: StateInterface;
  extend?: (args: { validator: TValidator; form: FormInterface }) => void;
  validator: TValidator;
  schema?: any;

  constructor({
    config,
    state = null,
    promises = [],
  }: ValidationPluginConstructor<TValidator>) {
    this.state = state;
    this.promises = promises;
    this.extend = config?.extend;
    this.validator = config.package;
    this.extendValidator();
  }

  extendValidator() {
    if (typeof this.extend === "function") {
      this.extend({
        validator: this.validator,
        form: this.state.form,
      });
    }
  }

  validate(field: FieldInterface) {
    const data = this.state.form.flatMapValues;
    this.validateFieldAsync(field, data);
    this.validateFieldSync(field, data);
  }

  makeLabels(validation: any, field: FieldInterface) {
    const labels = { [field.path]: field.label };
    forIn(validation.rules[field.path], (rule) => {
      if (
        typeof rule.value === "string" &&
        rule.name.match(/^(required_|same|different)/)
      ) {
        forIn(rule.value.split(","), (p, i: any) => {
          if (!rule.name.match(/^required_(if|unless)/) || i % 2 === 0) {
            const f = this.state.form.$(p);
            if (f && f.path && f.label) {
              labels[f.path] = f.label;
            }
          }
        });
      } else if (
        typeof rule.value === "string" &&
        rule.name.match(/^(before|after)/)
      ) {
        const f = this.state.form.$(rule.value);
        if (f && f.path && f.label) {
          labels[f.path] = f.label;
        }
      }
    });
    validation.setAttributeNames(labels);
  }

  validateFieldSync(field: FieldInterface, data: any) {
    const $rules = this.rules(field.rules, "sync");
    if (isEmpty($rules[0])) return;
    const rules = { [field.path]: $rules };
    const validation = new (this.validator as any)(data, rules);
    this.makeLabels(validation, field);
    if (validation.passes()) return;
    field.invalidate(head(validation.errors.get(field.path)), false);
  }

  validateFieldAsync(field: FieldInterface, data: any) {
    const $rules = this.rules(field.rules, "async");
    if (isEmpty($rules[0])) return;
    const rules = { [field.path]: $rules };
    const validation = new (this.validator as any)(data, rules);
    this.makeLabels(validation, field);

    const $p = new Promise((resolve: any) =>
      validation.checkAsync(
        () => this.handleAsyncPasses(field, resolve),
        () => this.handleAsyncFails(field, validation, resolve)
      )
    );

    this.promises.push($p);
  }

  handleAsyncPasses(field: FieldInterface, resolve: () => void) {
    field.setValidationAsyncData(true);
    resolve();
  }

  handleAsyncFails(
    field: FieldInterface,
    validation: any,
    resolve: () => void
  ) {
    field.setValidationAsyncData(
      false,
      head(validation.errors.get(field.path))
    );
    this.executeAsyncValidation(field);
    resolve();
  }

  executeAsyncValidation(field: FieldInterface) {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message, false, true);
    }
  }

  rules(rules: any, type: "sync" | "async") {
    const $rules = isString(rules) ? split(rules, "|") : rules;
    const v = new (this.validator as any)();
    return filter($rules, ($rule) =>
      type === "async"
        ? v.getRule(split($rule, ":")[0])?.async
        : !v.getRule(split($rule, ":")[0])?.async
    );
  }
}

export default <TValidator = any>(
  config?: ValidationPluginConfig<TValidator>
): ValidationPlugin<TValidator> => ({
  class: DVR<TValidator>,
  config,
});
