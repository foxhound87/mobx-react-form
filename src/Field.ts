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
} from "./parser";

import OptionsModel, { OptionsEnum } from "./models/OptionsModel";
import FieldInterface, { FieldConstructor } from "./models/FieldInterface";
import { FieldPropsEnum } from "./models/FieldProps";

const applyFieldPropFunc = (instance: FieldInterface, prop: any): any => {
  if (typeof prop !== 'function') return prop;
  return prop.apply(instance, [{
    field: instance,
    form: instance.state.form
  }])
};

const retrieveFieldPropFunc = (prop: any): Function | any | undefined =>
  (typeof prop === 'function') ? prop : undefined;

const propGetter = (instance: FieldInterface, prop: FieldPropsEnum): any =>
  (typeof instance[`_${prop}`] === 'function')
    ? instance[`_${prop}`].apply(instance, [{
      form: instance.state.form,
      field: instance,
    }]) : instance[`$${prop}`];


const setupFieldProps = (instance: FieldInterface, props: any, data: any) =>
  Object.assign(instance, {
    // retrieve functions
    _label: retrieveFieldPropFunc(props.$label || data?.label),
    _placeholder: retrieveFieldPropFunc(props.$placeholder || data?.placeholder),
    _disabled: retrieveFieldPropFunc(props.$disabled || data?.disabled),
    _rules: retrieveFieldPropFunc(props.$rules || data?.rules),
    _related: retrieveFieldPropFunc(props.$related || data?.related),
    _deleted: retrieveFieldPropFunc(props.$deleted || data?.deleted),
    _validators: retrieveFieldPropFunc(props.$validators || data?.validators),
    _validatedWith: retrieveFieldPropFunc(props.$validatedWith || data?.validatedWith),
    _bindings: retrieveFieldPropFunc(props.$bindings || data?.bindings),
    _extra: retrieveFieldPropFunc(props.$extra || data?.extra),
    _options: retrieveFieldPropFunc(props.$options || data?.options),
    _autoFocus: retrieveFieldPropFunc(props.$autoFocus || data?.autoFocus),
    _inputMode: retrieveFieldPropFunc(props.$inputMode || data?.inputMode),
    // apply functions or value
    $label: applyFieldPropFunc(instance, props.$label || data?.label || ""),
    $placeholder: applyFieldPropFunc(instance, props.$placeholder || data?.placeholder || ""),
    $disabled: applyFieldPropFunc(instance, props.$disabled || data?.disabled || false),
    $rules: applyFieldPropFunc(instance, props.$rules || data?.rules || null),
    $related: applyFieldPropFunc(instance, props.$related || data?.related || []),
    $deleted: applyFieldPropFunc(instance, props.$deleted || data?.deleted || false),
    $validatedWith: applyFieldPropFunc(instance, props.$validatedWith || data?.validatedWith || FieldPropsEnum.value),
    $bindings: applyFieldPropFunc(instance, props.$bindings || data?.bindings || FieldPropsEnum.default),
    $extra: applyFieldPropFunc(instance, props.$extra || data?.extra || null),
    $options: applyFieldPropFunc(instance, props.$options || data?.options || {}),
    $autoFocus: applyFieldPropFunc(instance, props.$autoFocus || data?.autoFocus || false),
    $inputMode: applyFieldPropFunc(instance, props.$inputMode || data?.inputMode || undefined),
    $validators: applyFieldPropFunc(instance, props.$validators || data?.validators || null),
    // other props
    $hooks: props.$hooks || data?.hooks || {},
    $handlers: props.$handlers || data?.handlers || {},
    $observers: props.$observers || data?.observers || null,
    $interceptors: props.$interceptors || data?.interceptors || null,
    $ref: props.$ref || data?.ref || undefined,
  });

const setupDefaultProp = (
  instance: Field,
  data: any,
  props: any,
  update: boolean,
  { isEmptyArray, fallbackValueOption }:
  { isEmptyArray: boolean, fallbackValueOption: any }
) =>
  parseInput((val) => val, {
    defaultValue,
    isEmptyArray,
    type: instance.type,
    unified: update
      ? defaultValue({
        fallbackValueOption,
        type: instance.type,
        value: instance.value
      })
      : data?.default,
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

  $converter = ($: any) => $;
  $input = ($: any) => $;
  $output = ($: any) => $;

  _value: Function;
  _label: Function;
  _placeholder: Function;
  _disabled: Function;
  _rules: Function;
  _related: Function;
  _deleted: Function;
  _validatedWith: Function;
  _validators: Function;
  _bindings: Function;
  _extra: Function;
  _options: Function;
  _autoFocus: Function;
  _inputMode: Function;

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
  $autoFocus: boolean = false;
  $inputMode: string = undefined;
  $ref: any = undefined

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
      showError: observable,
      errorSync: observable,
      errorAsync: observable,
      validationErrorStack: observable,
      validationFunctionsData: observable,
      validationAsyncData: observable,
      files: observable,
      autoFocus: computed,
      inputMode: computed,
      ref: computed,
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
      blur: action,
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

    this.initMOBXEvent(FieldPropsEnum.observers);
    this.initMOBXEvent(FieldPropsEnum.interceptors);

    this.execHook(FieldPropsEnum.onInit);

    // handle Field onChange Hook
    autorun(() => this.changed && this.execHook(FieldPropsEnum.onChange));
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

  set value(newVal) {
    if (_.isString(newVal) && this.state.options.get(OptionsEnum.autoTrimValue, this)) {
      newVal = newVal.trim();
    }
    if (this.$value === newVal) return;
    if (this.handleSetNumberValue(newVal)) return;
    this.$value = this.$converter(newVal);
    this.$changed ++;
    if (!this.actionRunning) {
      this.state.form.$changed ++;
    };
  }

  handleSetNumberValue(newVal: any): boolean {
    if (!this.state.options.get(OptionsEnum.autoParseNumbers, this))
      return false;

    if (_.isNumber(this.$initial) || this.type == 'number') {
      if (new RegExp("^-?\\d+(,\\d+)*(\\.\\d+([eE]\\d+)?)?$", "g").exec(newVal)) {
        this.$value = this.$converter(_.toNumber(newVal));
        this.$changed ++;
        if (!this.actionRunning) {
          this.state.form.$changed ++;
        };
        return true;
      }
    }
  }

  get actionRunning() {
    return this.submitting || this.clearing || this.resetting;
  }

  get checked() {
    return this.type === "checkbox" ? this.value : undefined;
  }

  get value() {
    return (typeof this._value === 'function' && !this.hasNestedFields)
      ? propGetter(this, FieldPropsEnum.value)
      : this.getComputedProp(FieldPropsEnum.value);
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
    this.$initial = val;
  }

  set default(val) {
    this.$default = val;
  }

  get ref() {
    return propGetter(this, FieldPropsEnum.ref)
  }

  get extra() {
    return propGetter(this, FieldPropsEnum.extra)
  }

  get autoFocus() {
    return propGetter(this, FieldPropsEnum.autoFocus)
  }

  get inputMode() {
    return propGetter(this, FieldPropsEnum.inputMode)
  }

  get type() {
    return propGetter(this, FieldPropsEnum.type)
  }

  get label() {
    return propGetter(this, FieldPropsEnum.label)
  }

  get placeholder() {
    return propGetter(this, FieldPropsEnum.placeholder)
  }

  get options() {
    return propGetter(this, FieldPropsEnum.options)
  }

  get bindings() {
    return propGetter(this, FieldPropsEnum.bindings)
  }

  get related() {
    return propGetter(this, FieldPropsEnum.related)
  }

  get disabled() {
    return propGetter(this, FieldPropsEnum.disabled)
  }

  get rules() {
    return propGetter(this, FieldPropsEnum.rules)
  }

  get validators() {
    return propGetter(this, FieldPropsEnum.validators)
  }

  get validatedWith() {
    return propGetter(this, FieldPropsEnum.validatedWith)
  }

  get validatedValue() {
    return parseCheckOutput(this, this.validatedWith as string);
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

  onSync = (...args: any) =>
    this.type === "file"
      ? this.onDrop(...args)
      : this.execHandler(
          FieldPropsEnum.onChange,
          args,
          this.sync,
          FieldPropsEnum.onSync
        );

  onChange = this.onSync;

  onToggle = (...args: any) =>
    this.execHandler(
      FieldPropsEnum.onToggle,
      args,
      this.sync
    );

  onBlur = (...args: any) =>
    this.execHandler(
      FieldPropsEnum.onBlur,
      args,
      action(() => {
        this.$focused = false;
        this.$blurred = true;
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

        this.files = [
          ..._.map(this.files),
          ...(files || args)
        ];
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
    const fallbackValueOption = this.state.options.get(OptionsEnum.fallbackValue, this);
    const applyInputConverterOnInit = this.state.options.get(OptionsEnum.applyInputConverterOnInit, this);
    const struct = this.state.struct();
    const structPath = pathToStruct(this.path);
    const isEmptyArray: boolean = Array.isArray(struct)
      ? !!struct
          .filter((s) => s.startsWith(structPath))
          .find((s) => s.substring(structPath.length) === "[]")
      : !!Array.isArray(_.get(struct, this.path));

    const { $type, $input, $output, $converter, $computed } = $props;

    if (_.isPlainObject($data)) {
      const { type, input, output, converter, computed } = $data;

      this.name = _.toString($data.name || $key);
      this.$type = $type || type || "text";
      this.$converter = $try($converter, converter, this.$converter);
      this.$input = $try($input, input, this.$input);
      this.$output = $try($output, output, this.$output);

      const value = parseInput(applyInputConverterOnInit ? this.$input : (val) => val, {
        fallbackValueOption,
        isEmptyArray,
        type: this.type,
        unified: computed || $data.value,
        separated: $computed || $props.$value,
        fallback: $props.$initial,
      });

      this._value = retrieveFieldPropFunc(value)
      this.$value = (typeof this._value === 'function')
        ? applyFieldPropFunc(this, value)
        : value;

      this.$initial = parseInput((val) => val, {
        fallbackValueOption,
        isEmptyArray,
        type: this.type,
        unified: $data.initial,
        separated: $props.$initial,
        fallback: this.$value,
      });

      this.$default = setupDefaultProp(this, $data, $props, update, {
        fallbackValueOption,
        isEmptyArray,
      });

      setupFieldProps(this, $props, $data);
      return;
    }

    /* The field IS the value here */
    this.name = _.toString($key);
    this.$type = $type || "text";
    this.$converter = $try($converter, this.$converter);
    this.$input = $try($input, this.$input);
    this.$output = $try($output, this.$output);

    const value = parseInput(applyInputConverterOnInit ? this.$input : (val) => val, {
      fallbackValueOption,
      isEmptyArray,
      type: this.type,
      unified: $computed || $data,
      separated: $computed || $props.$value,
    });

    this._value = retrieveFieldPropFunc(value)
    this.$value = (typeof this._value === 'function')
      ? applyFieldPropFunc(this, value)
      : value;

    this.$initial = parseInput((val) => val, {
      fallbackValueOption,
      isEmptyArray,
      type: this.type,
      unified: $data,
      separated: $props.$initial,
      fallback: this.$value,
    });

    this.$default = setupDefaultProp(this, $data, $props, update, {
      fallbackValueOption,
      isEmptyArray,
    });

    setupFieldProps(this, $props, $data);
  }

  getComputedProp(key: string): any {
    if (this.incremental || this.hasNestedFields) {
      return (key === FieldPropsEnum.value)
          ? this.get(key, false)
          : untracked(() => this.get(key, false));
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
    Promise.resolve().then(action(() => {
      this.$resetting = false;
      this.$clearing = false;
    }))
    if (deep) this.each((field: any) => field.resetValidation(deep));
  }

  clear(deep: boolean = true, execHook: boolean = true): void {
    execHook && this.execHook(FieldPropsEnum.onClear);
    this.$clearing = true;
    this.$touched = false;
    this.$blurred = false;
    this.$changed = 0;
    this.files = undefined;
    this.$value = defaultValue({
      fallbackValueOption: this.state.options.get(OptionsEnum.fallbackValue),
      value: this.$value,
      type: this.type,
    });

    if (deep) this.each((field: FieldInterface) => field.clear(deep));

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

    if (deep) this.each((field: FieldInterface) => field.reset(deep));

    this.state.options.get(OptionsEnum.validateOnReset, this)
      ? this.validate({
        showErrors: this.state.options.get(OptionsEnum.showErrorsOnReset, this),
      }) : this.resetValidation(deep);
  }

  focus(): void {
    if(this.ref && !this.focused) this.ref.focus();
    this.$focused = true;
    this.$touched = true;
  }

  blur(): void {
    if(this.ref && this.focused) this.ref.blur();
    this.$focused = false;
    this.$blurred = true;
  }

  trim(): void {
    if (!_.isString(this.value)) return;
    this.$value = this.value.trim();
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
    if (!_.isArray(this[`$${type}`])) return;

    let fn: any;
    if (type === FieldPropsEnum.observers) fn = this.observe;
    if (type === FieldPropsEnum.interceptors) fn = this.intercept;
    this[`$${type}`].map((obj: any) => fn(_.omit(obj, FieldPropsEnum.path)));
  }

  bind(props = {}) {
    return {
      ...this.state.bindings.load(this, this.bindings, props),
      ref: ($ref) => (this.$ref = $ref),
    }
  }

  update(fields: any): void {
    if (!_.isPlainObject(fields)) {
      throw new Error("The update() method accepts only plain objects.");
    }
    const fallback = this.state.options.get(OptionsEnum.fallback, this);
    const applyInputConverterOnUpdate = this.state.options.get(OptionsEnum.applyInputConverterOnUpdate, this);
    const x = this.state.struct().findIndex(s => s.startsWith(this.path.replace(/\.\d+\./, '[].') + '[]'));
    if (!fallback && this.fields.size === 0 && x < 0) {
      this.value = parseInput(applyInputConverterOnUpdate ? this.$input : (val) => val, {
        fallbackValueOption: this.state.options.get(OptionsEnum.fallbackValue, this),
        separated: fields,
      });
      return;
    }
    super.update(fields);
  }
}
