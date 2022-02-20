import { action, computed, observable, makeObservable } from "mobx";
import _ from "lodash";

import Base from "./Base";
import Validator from "./Validator";
import State from "./State";
import Field from "./Field";
import StateInterface from "./models/StateInterface";
import ValidatorInterface from "./models/ValidatorInterface";

export default class Form extends Base {
  name: string | null;
  state: StateInterface;
  validator: ValidatorInterface;

  $hooks: any = {};
  $handlers: any = {};

  fields: any = observable.map({});

  debouncedValidation: any = null;

  constructor(
    setup = {},
    {
      name = null,
      options = {},
      plugins = {},
      bindings = {},
      hooks = {},
      handlers = {},
    } = {}
  ) {
    super();
    makeObservable(this, {
      fields: observable,
      validatedValues: computed,
      clearing: computed,
      resetting: computed,
      error: computed,
      hasError: computed,
      isValid: computed,
      isPristine: computed,
      isDirty: computed,
      isDefault: computed,
      isEmpty: computed,
      focused: computed,
      touched: computed,
      changed: computed,
      disabled: computed,
      init: action,
      invalidate: action,
      clear: action,
      reset: action,
    });

    this.name = name;
    this.$hooks = hooks;
    this.$handlers = handlers;

    // load data from initializers methods
    const initial = _.each(
      {
        setup,
        options,
        plugins,
        bindings,
      },
      (val, key) =>
        _.isFunction((this as any)[key])
          ? _.merge(val, (this as any)[key].apply(this, [this]))
          : val
    );

    this.state = new State({
      form: this,
      initial: initial.setup,
      options: initial.options,
      bindings: initial.bindings,
    });

    this.validator = new Validator({
      form: this,
      plugins: initial.plugins,
    });

    this.initFields(initial.setup);

    this.debouncedValidation = _.debounce(
      this.validate,
      this.state.options.get("validationDebounceWait"),
      this.state.options.get("validationDebounceOptions")
    );

    // execute validation on form initialization
    if (this.state.options.get("validateOnInit") === true) {
      this.validator.validate({
        showErrors: this.state.options.get("showErrorsOnInit"),
      });
    }

    this.execHook("onInit");
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  get validatedValues(): object {
    const data: any = {};
    (this as any).each(
      ($field: any) => (data[$field.path] = $field.validatedValue)
    );

    return data;
  }

  get clearing(): boolean {
    return this.check("clearing", true);
  }

  get resetting(): boolean {
    return this.check("resetting", true);
  }

  get error(): string | null {
    return this.validator.error;
  }

  get hasError(): boolean {
    return !!this.validator.error || this.check("hasError", true);
  }

  get isValid(): boolean {
    return !this.validator.error && this.check("isValid", true);
  }

  get isPristine(): boolean {
    return this.check("isPristine", true);
  }

  get isDirty(): boolean {
    return this.check("isDirty", true);
  }

  get isDefault(): boolean {
    return this.check("isDefault", true);
  }

  get isEmpty(): boolean {
    return this.check("isEmpty", true);
  }

  get focused(): boolean {
    return this.check("focused", true);
  }

  get touched(): boolean {
    return this.check("touched", true);
  }

  get changed(): boolean {
    return this.check("changed", true);
  }

  get disabled(): boolean {
    return this.check("disabled", true);
  }

  makeField(data: any) {
    return new Field(data);
  }

  /**
    Init Form Fields and Nested Fields
   */
  init($fields: any = null): void {
    _.set(this, "fields", observable.map({}));

    this.state.initial.props.values = $fields; // eslint-disable-line
    this.state.current.props.values = $fields; // eslint-disable-line

    this.initFields({
      fields: $fields || this.state.struct(),
    });
  }

  invalidate(message: string | null = null): void {
    this.validator.error =
      message || this.state.options.get("defaultGenericError") || true;
  }

  showErrors(show: boolean = true): void {
    (this as any).each((field: any) => field.showErrors(show));
  }

  /**
    Clear Form Fields
  */
  clear(): void {
    (this as any).$touched = false;
    (this as any).$changed = false;
    (this as any).each((field: any) => field.clear(true));
  }

  /**
    Reset Form Fields
  */
  reset(): void {
    (this as any).$touched = false;
    (this as any).$changed = false;
    (this as any).each((field: any) => field.reset(true));
  }
}
