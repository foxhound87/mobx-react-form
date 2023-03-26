import {
  observable,
  observe,
  action,
  computed,
  isObservableArray,
  toJS,
  untracked,
  makeObservable,
  autorun,
} from "mobx";
import _ from "lodash";
import Base from "./Base";

import { $try, $hasFiles, $isBool, $isEvent, pathToStruct } from "./utils";

import {
  parseInput,
  parseCheckOutput,
  defaultValue,
  defaultClearValue,
} from "./parser";

import OptionsModel, { OptionsEnum } from "./models/OptionsModel";
import FieldInterface, { FieldConstructor } from "./models/FieldInterface";
import { FieldPropsEnum } from "./models/FieldProps";

const setupFieldProps = (instance: FieldInterface, props: any, data: any) =>
  Object.assign(instance, {
    $label: props.$label || (data && data.label) || "",
    $placeholder: props.$placeholder || (data && data.placeholder) || "",
    $disabled: props.$disabled || (data && data.disabled) || false,
    $bindings: props.$bindings || (data && data.bindings) || FieldPropsEnum.default,
    $related: props.$related || (data && data.related) || [],
    $validators: toJS(props.$validators || (data && data.validators) || null),
    $validatedWith: props.$validatedWith || (data && data.validatedWith) || FieldPropsEnum.value,
    $rules: props.$rules || (data && data.rules) || null,
    $observers: props.$observers || (data && data.observers) || null,
    $interceptors: props.$interceptors || (data && data.interceptors) || null,
    $extra: props.$extra || (data && data.extra) || null,
    $options: props.$options || (data && data.options) || {},
    $hooks: props.$hooks || (data && data.hooks) || {},
    $handlers: props.$handlers || (data && data.handlers) || {},
  });

const setupDefaultProp = (
  instance: Field,
  data: any,
  props: any,
  update: boolean,
  { isEmptyArray }: { isEmptyArray: boolean }
) =>
  parseInput(instance.$input, {
    nullable: true,
    isEmptyArray,
    type: instance.type,
    unified: update
      ? defaultValue({ type: instance.type })
      : data && data.default,
    separated: props.$default,
    fallback: instance.$initial,
  });

interface ValidationAsyncDataInterface {
  valid?: boolean;
  message?: string;
}

export default class Field extends Base implements FieldInterface {
  hasInitialNestedFields = false;
  incremental = false;

  id: any;
  key: any;
  name: any;

  $observers: any;
  $interceptors: any;

  $input = ($: any) => $;
  $output = ($: any) => $;

  $options: OptionsModel | undefined;
  $value: any;
  $type: string | undefined;
  $label: string | undefined;
  $placeholder: string | undefined;
  $default: any;
  $initial: any;
  $bindings: any;
  $extra: any;
  $related: string[] | undefined;
  $validatedWith: string | undefined;

  $validators: any[] | undefined;
  $rules: string[] | undefined;

  $disabled: boolean = false;
  $focused: boolean = false;
  $blurred: boolean = false;
  $deleted: boolean = false;

  $clearing: boolean = false;
  $resetting: boolean = false;

  autoFocus: boolean = false;
  showError: boolean = false;

  errorSync: string | null = null;
  errorAsync: string | null = null;

  validationErrorStack: string[] = [];
  validationFunctionsData: any[] = [];
  validationAsyncData: ValidationAsyncDataInterface | undefined;
  debouncedValidation: any;

  disposeValidationOnBlur: any;
  disposeValidationOnChange: any;

  files: any;
  constructor({
    key,
    path,
    data = {},
    props = {},
    update = false,
    state,
  }: FieldConstructor) {
    super();

    makeObservable(this, {
      $options: observable,
      $value: observable,
      $type: observable,
      $label: observable,
      $placeholder: observable,
      $default: observable,
      $initial: observable,
      $bindings: observable,
      $extra: observable,
      $related: observable,
      $validatedWith: observable,
      $validators: observable,
      $rules: observable,
      $disabled: observable,
      $focused: observable,
      $blurred: observable,
      $deleted: observable,
      $clearing: observable,
      $resetting: observable,
      autoFocus: observable,
      showError: observable,
      errorSync: observable,
      errorAsync: observable,
      validationErrorStack: observable,
      validationFunctionsData: observable,
      validationAsyncData: observable,
      files: observable,
      checkValidationErrors: computed,
      checked: computed,
      value: computed,
      initial: computed,
      default: computed,
      actionRunning: computed,
      type: computed,
      label: computed,
      placeholder: computed,
      extra: computed,
      options: computed,
      bindings: computed,
      related: computed,
      disabled: computed,
      rules: computed,
      validators: computed,
      validatedValue: computed,
      error: computed,
      hasError: computed,
      isValid: computed,
      isDefault: computed,
      isDirty: computed,
      isPristine: computed,
      isEmpty: computed,
      resetting: computed,
      clearing: computed,
      focused: computed,
      blurred: computed,
      touched: computed,
      deleted: computed,
      setupField: action,
      initNestedFields: action,
      invalidate: action,
      setValidationAsyncData: action,
      resetValidation: action,
      clear: action,
      reset: action,
      focus: action,
      showErrors: action,
      showAsyncErrors: action,
      update: action
    });

    this.state = state;

    this.setupField(key, path, data, props, update);
    this.checkValidationPlugins();
    this.initNestedFields(data, update);

    this.incremental = this.hasIncrementalKeys;

    this.debouncedValidation = _.debounce(
      this.validate,
      this.state.options.get(OptionsEnum.validationDebounceWait, this),
      this.state.options.get(OptionsEnum.validationDebounceOptions, this)
    );

    this.observeValidationOnBlur();
    this.observeValidationOnChange();

    this.initMOBXEvent("observers");
    this.initMOBXEvent("interceptors");

    this.execHook(FieldPropsEnum.onInit);

    // handle Field onChange Hook for nested fields
    this.hasNestedFields
      && autorun(() => this.changed && this.execHook(FieldPropsEnum.onChange));
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  get checkValidationErrors() {
    return (
      (this.validationAsyncData?.valid === false &&
        !_.isEmpty(this.validationAsyncData)) ||
      !_.isEmpty(this.validationErrorStack) ||
      _.isString(this.errorAsync) ||
      _.isString(this.errorSync)
    );
  }

  get checked() {
    return this.type === "checkbox" ? this.value : undefined;
  }

  get value() {
    return this.getComputedProp(FieldPropsEnum.value);
  }

  set value(newVal) {
    if (this.$value === newVal) return;
    // handle numbers
    if (this.state.options.get(OptionsEnum.autoParseNumbers, this) === true) {
      if (_.isNumber(this.$initial)) {
        if (
          new RegExp("^-?\\d+(,\\d+)*(\\.\\d+([eE]\\d+)?)?$", "g").exec(newVal)
        ) {
          this.$value = _.toNumber(newVal);
          this.$changed ++;
          if (!this.resetting && !this.clearing) {
            this.state.form.$changed ++;
          };
          return;
        }
      }
    }
    // handle parse value
    this.$value = newVal;
    this.$changed ++;
    if (!this.resetting && !this.clearing) {
      this.state.form.$changed ++;
    };
  }

  get initial() {
    return this.$initial
      ? toJS(this.$initial)
      : this.getComputedProp(FieldPropsEnum.initial);
  }

  get default() {
    return this.$default
      ? toJS(this.$default)
      : this.getComputedProp(FieldPropsEnum.default);
  }

  set initial(val) {
    this.$initial = parseInput(this.$input, { separated: val });
  }

  set default(val) {
    this.$default = parseInput(this.$input, { separated: val });
  }

  get actionRunning() {
    return this.submitting || this.clearing || this.resetting;
  }

  get extra() {
    return this.$extra;
  }

  get type() {
    return toJS(this.$type);
  }

  get label() {
    return toJS(this.$label);
  }

  get placeholder() {
    return toJS(this.$placeholder);
  }

  get options() {
    return toJS(this.$options);
  }

  get bindings() {
    return toJS(this.$bindings);
  }

  get related() {
    return toJS(this.$related);
  }

  get disabled() {
    return toJS(this.$disabled);
  }

  get rules() {
    return toJS(this.$rules);
  }

  get validators() {
    return toJS(this.$validators);
  }

  get validatedValue() {
    return parseCheckOutput(this, this.$validatedWith as string);
  }

  get error() {
    if (this.showError === false) return null;
    return this.errorAsync || this.errorSync || null;
  }

  get hasError(): boolean {
    return this.checkValidationErrors || this.check(FieldPropsEnum.hasError, true);
  }

  get isValid(): boolean {
    return !this.checkValidationErrors && this.check(FieldPropsEnum.isValid, true);
  }

  get isDefault(): boolean {
    return !_.isNil(this.default) && _.isEqual(this.default, this.value);
  }

  get isDirty(): boolean {
    const value = this.changed ? this.value : this.initial;
    return !_.isNil(this.initial) && !_.isEqual(this.initial, value);
  }

  get isPristine(): boolean {
    const value = this.changed ? this.value : this.initial;
    return !_.isNil(this.initial) && _.isEqual(this.initial, value);
  }

  get isEmpty(): boolean {
    if (this.hasNestedFields) return this.check(FieldPropsEnum.isEmpty, true);
    if (_.isBoolean(this.value)) return !!this.$value;
    if (_.isNumber(this.value)) return false;
    if (_.isDate(this.value)) return false;
    return _.isEmpty(this.value);
  }

  get resetting(): boolean {
    return this.hasNestedFields ? this.check(FieldPropsEnum.resetting, true) : this.$resetting;
  }

  get clearing(): boolean {
    return this.hasNestedFields ? this.check(FieldPropsEnum.clearing, true) : this.$clearing;
  }

  get focused(): boolean {
    return this.hasNestedFields ? this.check(FieldPropsEnum.focused, true) : this.$focused;
  }

  get blurred(): boolean {
    return this.hasNestedFields ? this.check(FieldPropsEnum.blurred, true) : this.$blurred;
  }

  get touched(): boolean {
    return this.hasNestedFields ? this.check(FieldPropsEnum.touched, true) : this.$touched;
  }

  get deleted(): boolean {
    return this.hasNestedFields ? this.check(FieldPropsEnum.deleted, true) : this.$deleted;
  }

  /* ------------------------------------------------------------------ */
  /* EVENTS HANDLERS */

  sync = action((e: any, v: any = null) => {
    const $get = ($: any) =>
      $isBool($, this.value) ? $.target.checked : $.target.value;

    // assume "v" or "e" are the values
    if (_.isNil(e) || _.isNil(e.target)) {
      if (!_.isNil(v) && !_.isNil(v.target)) {
        v = $get(v); // eslint-disable-line
      }

      this.value = $try(e, v);
      return;
    }

    if (!_.isNil(e.target)) {
      this.value = $get(e);
      return;
    }

    this.value = e;
  });

  onChange = (...args: any) =>
    this.type === "file"
      ? this.onDrop(...args)
      : this.execHandler(FieldPropsEnum.onChange, args, this.sync);

  onToggle = (...args: any) =>
    this.execHandler(FieldPropsEnum.onToggle, args, this.sync);

  onBlur = (...args: any) =>
    this.execHandler(
      FieldPropsEnum.onBlur,
      args,
      action(() => {
        if (!this.$blurred) {
          this.$blurred = true;
        }

        this.$focused = false;
      })
    );

  onFocus = (...args: any) =>
    this.execHandler(
      FieldPropsEnum.onFocus,
      args,
      action(() => {
        this.$focused = true;
        this.$touched = true;
      })
    );

  onDrop = (...args: any) =>
    this.execHandler(
      FieldPropsEnum.onDrop,
      args,
      action(() => {
        const e = args[0];
        let files: unknown[] | null = null;

        if ($isEvent(e) && $hasFiles(e)) {
          files = _.map(e.target.files);
        }

        this.files = files || args;
      })
    );

  onKeyDown = (...args: any) =>
    this.execHandler(
      FieldPropsEnum.onKeyDown,
      args,
    );

  onKeyUp = (...args: any) =>
    this.execHandler(
      FieldPropsEnum.onKeyUp,
      args,
    );

  setupField(
    $key: string,
    $path: string,
    $data: any,
    $props: any,
    update: boolean
  ): void {
    this.key = $key;
    this.path = $path;
    this.id = this.state.options.get(OptionsEnum.uniqueId)?.apply(this, [this]);
    const struct = this.state.struct();
    const structPath = pathToStruct(this.path);
    const isEmptyArray: boolean = Array.isArray(struct)
      ? !!struct
          .filter((s) => s.startsWith(structPath))
          .find((s) => s.substr(structPath.length, 2) === "[]")
      : !!Array.isArray(_.get(struct, this.path));

    const { $type, $input, $output } = $props;

    // eslint-disable-next-line
    // if (_.isNil($data)) $data = '';

    if (_.isPlainObject($data)) {
      const { type, input, output } = $data;

      this.name = _.toString($data.name || $key);
      this.$type = $type || type || "text";
      this.$input = $try($input, input, this.$input);
      this.$output = $try($output, output, this.$output);

      this.$value = parseInput(this.$input, {
        isEmptyArray,
        type: this.type,
        unified: $data.value,
        separated: $props.$value,
        fallback: $props.$initial,
      });

      this.$initial = parseInput(this.$input, {
        nullable: true,
        isEmptyArray,
        type: this.type,
        unified: $data.initial,
        separated: $props.$initial,
        fallback: this.$value,
      });

      this.$default = setupDefaultProp(this, $data, $props, update, {
        isEmptyArray,
      });

      setupFieldProps(this, $props, $data);
      return;
    }

    /* The field IS the value here */
    this.name = _.toString($key);
    this.$type = $type || "text";
    this.$input = $try($input, this.$input);
    this.$output = $try($output, this.$output);

    this.$value = parseInput(this.$input, {
      isEmptyArray,
      type: this.type,
      unified: $data,
      separated: $props.$value,
    });

    this.$initial = parseInput(this.$input, {
      nullable: true,
      isEmptyArray,
      type: this.type,
      unified: $data,
      separated: $props.$initial,
      fallback: this.$value,
    });

    this.$default = setupDefaultProp(this, $data, $props, update, {
      isEmptyArray,
    });

    setupFieldProps(this, $props, $data);
  }

  getComputedProp(key: string): any {
    if (this.incremental || this.hasNestedFields) {
      const $val =
        key === FieldPropsEnum.value
          ? this.get(key, false)
          : untracked(() => this.get(key, false));

      return !_.isEmpty($val) ? $val : [];
    }

    // @ts-ignore
    const val = this[`$${key}`];

    if (_.isArray(val) || isObservableArray(val)) {
      return [].slice.call(val);
    }

    return toJS(val);
  }

  checkValidationPlugins(): void {
    const { drivers } = this.state.form.validator;
    const form = this.state.form.name ? `${this.state.form.name}/` : "";

    if (_.isNil(drivers.dvr) && !_.isNil(this.rules)) {
      throw new Error(
        `The DVR validation rules are defined but no DVR plugin provided. Field: "${
          form + this.path
        }".`
      );
    }

    if (_.isNil(drivers.vjf) && !_.isNil(this.validators)) {
      throw new Error(
        `The VJF validators functions are defined but no VJF plugin provided. Field: "${
          form + this.path
        }".`
      );
    }
  }

  initNestedFields(field: any, update: boolean): void {
    const fields = _.isNil(field) ? null : field.fields;

    if (_.isArray(fields) && !_.isEmpty(fields)) {
      this.hasInitialNestedFields = true;
    }

    this.initFields({ fields }, update);

    if (!update && _.isArray(fields) && _.isEmpty(fields)) {
      if (_.isArray(this.value) && !_.isEmpty(this.value)) {
        this.hasInitialNestedFields = true;
        this.initFields({ fields, values: this.value }, update);
      }
    }
  }

  invalidate(message: string, async: boolean = false): void {
    if (async === true) {
      this.errorAsync = message;
      return;
    }

    if (_.isArray(message)) {
      this.validationErrorStack = message;
      this.showErrors(true);
      return;
    }

    this.validationErrorStack.unshift(message);
    this.showErrors(true);
  }

  setValidationAsyncData(valid: boolean = false, message: string = ""): void {
    this.validationAsyncData = { valid, message };
  }

  resetValidation(deep: boolean = false): void {
    this.showError = true;
    this.errorSync = null;
    this.errorAsync = null;
    this.validationAsyncData = {};
    this.validationFunctionsData = [];
    this.validationErrorStack = [];
    if (deep) this.each((field: any) => field.resetValidation());
  }

  clear(deep: boolean = true, execHook: boolean = true): void {
    execHook && this.execHook(FieldPropsEnum.onClear);
    this.$clearing = true;
    this.$touched = false;
    this.$blurred = false;
    this.$changed = 0;
    this.files = undefined;
    this.$value = defaultClearValue({ value: this.$value });

    if (deep) this.each((field: FieldInterface) => field.clear(true));

    this.state.options.get(OptionsEnum.validateOnClear, this)
      ? this.validate({
        showErrors: this.state.options.get(OptionsEnum.showErrorsOnClear, this),
      }) : this.resetValidation(deep);
  }

  reset(deep: boolean = true, execHook: boolean = true): void {
    execHook && this.execHook(FieldPropsEnum.onReset);
    this.$resetting = true;
    this.$touched = false;
    this.$blurred = false;
    this.$changed = 0;
    this.files = undefined;

    const useDefaultValue = this.$default !== this.$initial;
    if (useDefaultValue) this.value = this.$default;
    if (!useDefaultValue) this.value = this.$initial;

    if (deep) this.each((field: FieldInterface) => field.reset(true));

    this.state.options.get(OptionsEnum.validateOnReset, this)
      ? this.validate({
        showErrors: this.state.options.get(OptionsEnum.showErrorsOnReset, this),
      }) : this.resetValidation(deep);
  }

  focus(): void {
    this.state.form.each((field: any) => (field.autoFocus = false));
    this.autoFocus = true;
  }

  showErrors(show: boolean = true): void {
    this.showError = show;
    this.errorSync = _.head(this.validationErrorStack) as string;
    this.each((field: any) => field.showErrors(show));
  }

  showAsyncErrors(): void {
    if (this.validationAsyncData?.valid === false) {
      this.errorAsync = this.validationAsyncData?.message as string;
      return;
    }
    this.errorAsync = null;
  }

  observeValidationOnBlur(): void {
    const opt = this.state.options;
    if (opt.get(OptionsEnum.validateOnBlur, this)) {
      this.disposeValidationOnBlur = observe(
        this,
        "$focused",
        (change) =>
          change.newValue === false &&
          this.debouncedValidation({
            showErrors: opt.get(OptionsEnum.showErrorsOnBlur, this),
          })
      );
    }
  }

  observeValidationOnChange(): void {
    const opt = this.state.options;
    if (opt.get(OptionsEnum.validateOnChange, this)) {
      this.disposeValidationOnChange = observe(
        this,
        "$value",
        () =>
          !this.actionRunning &&
          this.debouncedValidation({
            showErrors: opt.get(OptionsEnum.showErrorsOnChange, this),
          })
      );
    } else if (
      opt.get(OptionsEnum.validateOnChangeAfterInitialBlur, this) ||
      opt.get(OptionsEnum.validateOnChangeAfterSubmit, this)
    ) {
      this.disposeValidationOnChange = observe(
        this,
        "$value",
        () =>
          !this.actionRunning &&
          ((opt.get(OptionsEnum.validateOnChangeAfterInitialBlur, this) &&
            this.blurred) ||
            (opt.get(OptionsEnum.validateOnChangeAfterSubmit, this) &&
              this.state.form.submitted)) &&
          this.debouncedValidation({
            showErrors: opt.get(OptionsEnum.showErrorsOnChange, this),
          })
      );
    }
  }

  initMOBXEvent(type: string): void {
    // @ts-ignore
    if (!_.isArray(this[`$${type}`])) return;

    let fn: any;
    if (type === "observers") fn = this.observe;
    if (type === "interceptors") fn = this.intercept;
    // @ts-ignore
    this[`$${type}`].map((obj: any) => fn(_.omit(obj, FieldPropsEnum.path)));
  }

  bind(props = {}) {
    return this.state.bindings.load(this, this.bindings, props);
  }

  update(fields: any): void {
    if (!_.isPlainObject(fields)) {
      throw new Error("The update() method accepts only plain objects.");
    }
    const fallback = this.state.options.get(OptionsEnum.fallback);
    const x = this.state.struct().findIndex(s => s.startsWith(this.path.replace(/\.\d+\./, '[].') + '[]'));
    if (!fallback && this.fields.size === 0 && x < 0) {
      this.value = parseInput(this.$input, {
        separated: fields,
      });
      return;
    }
    super.update(fields);
  }
}
