import { action, computed, observable, makeObservable, autorun } from "mobx";
import _ from "lodash";

import Base from "./Base";
import Validator from "./Validator";
import State from "./State";
import Field from "./Field";
import ValidatorInterface from "./models/ValidatorInterface";
import FieldInterface, { FieldConstructor } from "./models/FieldInterface";
import FormInterface, {
  FieldsDefinitions,
  FormConfig,
} from "./models/FormInterface";
import { FieldPropsEnum } from "./models/FieldProps";
import { OptionsEnum } from "./models/OptionsModel";

export default class Form extends Base implements FormInterface {
  name: string;
  path = null;
  validator: ValidatorInterface;

  debouncedValidation: any = null;

  constructor(
    setup: FieldsDefinitions,
    {
      name = "",
      options = {},
      plugins = {},
      bindings = {},
      hooks = {},
      handlers = {},
    }: FormConfig = {}
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
      disabled: computed,
      // init: action,
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
      this.state.options.get(OptionsEnum.validationDebounceWait),
      this.state.options.get(OptionsEnum.validationDebounceOptions)
    );

    // execute validation on form initialization
    this.state.options.get(OptionsEnum.validateOnInit)
      && this.validator.validate({
        showErrors: this.state.options.get(OptionsEnum.showErrorsOnInit),
      });

    this.execHook(FieldPropsEnum.onInit);

    // handle Form onChange Hook
    autorun(() => this.$changed && this.execHook(FieldPropsEnum.onChange));
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  get validatedValues(): object {
    const data: any = {};
    this.each(($field: any) => (data[$field.path] = $field.validatedValue));

    return data;
  }

  get clearing(): boolean {
    return this.check(FieldPropsEnum.clearing, true);
  }

  get resetting(): boolean {
    return this.check(FieldPropsEnum.resetting, true);
  }

  get error(): string | null {
    return this.validator.error;
  }

  get hasError(): boolean {
    return !!this.validator.error || this.check(FieldPropsEnum.hasError, true);
  }

  get isValid(): boolean {
    return !this.validator.error && this.check(FieldPropsEnum.isValid, true);
  }

  get isPristine(): boolean {
    return this.check(FieldPropsEnum.isPristine, true);
  }

  get isDirty(): boolean {
    return this.check(FieldPropsEnum.isDirty, true);
  }

  get isDefault(): boolean {
    return this.check(FieldPropsEnum.isDefault, true);
  }

  get isEmpty(): boolean {
    return this.check(FieldPropsEnum.isEmpty, true);
  }

  get focused(): boolean {
    return this.check(FieldPropsEnum.focused, true);
  }

  get touched(): boolean {
    return this.check(FieldPropsEnum.touched, true);
  }

  get disabled(): boolean {
    return this.check(FieldPropsEnum.disabled, true);
  }

  makeField(data: FieldConstructor) {
    return new Field(data);
  }

  /**
    Init Form Fields and Nested Fields

  init($fields: any = null): void {
    _.set(this, "fields", observable.map({}));

    this.state.initial.props.values = $fields; // eslint-disable-line
    this.state.current.props.values = $fields; // eslint-disable-line

    this.initFields({
      fields: $fields || this.state.struct(),
    });
  }
  */

  invalidate(message: string | null = null): void {
    this.debouncedValidation.cancel();
    this.each((field) => field.debouncedValidation.cancel());
    this.validator.error = message || this.state.options.get(OptionsEnum.defaultGenericError);
  }

  showErrors(show: boolean = true): void {
    this.each((field: any) => field.showErrors(show));
  }

  resetValidation(deep: boolean): void {
    this.validator.error = null;
    this.each((field: any) => field.resetValidation(deep));
  }

  /**
    Clear Form Fields
  */
  clear(deep: boolean = true, execHook: boolean = true): void {
    execHook && this.execHook(FieldPropsEnum.onClear);
    this.$touched = false;
    this.$changed = 0;
    this.each((field: FieldInterface) => field.clear(deep));
  }

  /**
    Reset Form Fields
  */
  reset(deep: boolean = true, execHook: boolean = true): void {
    execHook && this.execHook(FieldPropsEnum.onReset);
    this.$touched = false;
    this.$changed = 0;
    this.each((field: FieldInterface) => field.reset(deep));
  }
}
