import {
  observable,
  computed,
  action,
  toJS,
  makeObservable,
  observe,
  intercept,
  ObservableMap,
} from "mobx";
import _ from "lodash";
import {BaseInterface} from "./models/BaseInterface";
import {StateInterface} from "./models/StateInterface";
import {FieldInterface} from "./models/FieldInterface";

import {
  props,
  allowedProps,
  checkPropOccurrence,
  throwError,
  isArrayOfObjects,
  getObservableMapValues,
  maxKey,
  $try,
  isEvent,
  hasIntKeys,
  pathToStruct,
} from "./utils";

import {
  mergeSchemaDefaults,
  prepareFieldsData,
  parsePath,
  parseInput,
  parseCheckArray,
  parseCheckOutput,
  pathToFieldsTree,
  defaultValue,
} from "./parser";
import { AllowedFieldPropsTypes, FieldPropsEnum, SeparatedPropsMode } from "./models/FieldProps";
import { OptionsEnum } from "./models/OptionsModel";
import { ValidateOptions, ValidationHooks } from "./models/ValidatorInterface";
import { SubmitHooks } from "./models/SharedActionsInterface";
export default class Base implements BaseInterface {
  noop = () => {};

  state: StateInterface;

  fields: ObservableMap = observable.map({});
  path: string | undefined | null;

  $submitted: number = 0;
  $submitting: boolean = false;

  $validated: number = 0;
  $validating: boolean = false;

  $clearing: boolean = false;
  $resetting: boolean = false;

  $touched: boolean = false;
  $changed: number = 0;

  $hooks: any = {};
  $handlers: any = {};

  constructor() {
    makeObservable(this, {
      $submitted: observable,
      $submitting: observable,
      $validated: observable,
      $validating: observable,
      $clearing: observable,
      $resetting: observable,
      $touched: observable,
      $changed: observable,
      $hooks: observable,
      $handlers: observable,
      changed: computed,
      submitted: computed,
      submitting: computed,
      validated: computed,
      validating: computed,
      clearing: computed,
      resetting: computed,
      hasIncrementalKeys: computed,
      hasNestedFields: computed,
      size: computed,
      // initialization
      initField: action,
      // actions
      submit: action,
      deepUpdate: action,
      set: action,
      add: action,
      del: action,
    });
  }

  execHook = (name: string, fallback: any = {}): any =>
    $try(
      fallback[name],
      this.$hooks[name],
      this.noop
    ).apply(this, [this]);

  execHandler = (name: string, args: any, fallback: any = undefined, hook = null, execHook = true): any => [
    $try(
      this.$handlers[name] && this.$handlers[name].apply(this, [this]),
      fallback,
      this.noop
    ).apply(this, [...args]),
    execHook && this.execHook(hook || name),
  ];

  get resetting(): boolean {
    return this.hasNestedFields ? this.check(FieldPropsEnum.resetting, true) : this.$resetting;
  }

  get clearing(): boolean {
    return this.hasNestedFields ? this.check(FieldPropsEnum.clearing, true) : this.$clearing;
  }

  get submitted(): number {
    return toJS(this.$submitted);
  }

  get submitting(): boolean {
    return toJS(this.$submitting);
  }

  get validated(): number {
    return toJS(this.$validated);
  }

  get validating(): boolean {
    return toJS(this.$validating);
  }

  get hasIncrementalKeys(): boolean {
    return !!this.fields.size && hasIntKeys(this.fields);
  }

  get hasNestedFields(): boolean {
    return this.fields.size !== 0;
  }

  get size(): number {
    return this.fields.size;
  }

  get changed(): number {
    return !_.isNil(this.path) && this.hasNestedFields
      ? (this.reduce((acc: number, field: FieldInterface) => (acc + field.changed), 0) + this.$changed)
      : this.$changed;
  }

  /**
    Interceptor
  */
  intercept = (opt: any): any =>
    this.MOBXEvent(
      (typeof opt === 'function')
        ? { type: "interceptor", call: opt }
        : { type: "interceptor", ...opt }
    );

  /**
    Observer
  */
  observe = (opt: any): any =>
    this.MOBXEvent(
      (typeof opt === 'function')
        ? { type: "observer", call: opt }
        : { type: "observer", ...opt }
    );

  /**
    Event Handler: On Clear
  */
  onClear = (...args: any): any =>
    this.execHandler(FieldPropsEnum.onClear, args, (e: Event) => {
      isEvent(e) && e.preventDefault();
      (this as any).clear(true, false);
    });

  /**
    Event Handler: On Reset
  */
  onReset = (...args: any): any =>
    this.execHandler(FieldPropsEnum.onReset, args, (e: Event) => {
      isEvent(e) && e.preventDefault();
      (this as any).reset(true, false);
    });

  /**
    Event Handler: On Submit
   */
  onSubmit = (...args: any): any =>
    this.execHandler(FieldPropsEnum.onSubmit, args, (e: Event, o = {}) => {
      isEvent(e) && e.preventDefault();
      this.submit(o);
    }, null, false);

  /**
    Event Handler: On Add
  */
  onAdd = (...args: any): any =>
    this.execHandler(FieldPropsEnum.onAdd, args, (e: Event, val: any) => {
      isEvent(e) && e.preventDefault();
      this.add(isEvent(val) ? null : val, false);
    });

  /**
    Event Handler: On Del
  */
  onDel = (...args: any): any =>
    this.execHandler(FieldPropsEnum.onDel, args, (e: Event, path: string) => {
      isEvent(e) && e.preventDefault();
      this.del(isEvent(path) ? this.path : path, false);
    });

  /******************************************************************
    Initializer
  */
  initFields(initial: any, update: boolean = false): void {
    const fallback = this.state.options.get(OptionsEnum.fallback);
    const $path = (key: string) => _.trimStart([this.path, key].join("."), ".");

    let fields;
    fields = prepareFieldsData(initial, this.state.strict, fallback);
    fields = mergeSchemaDefaults(fields, (this as any).validator);

    // create fields
    _.forIn(fields, (field, key) => {
      const path = $path(key);
      const $f = this.select(path, null, false);
      if (_.isNil($f)) {
        if (fallback) {
          this.initField(key, path, field, update);
        } else {
          const structPath = pathToStruct(path);
          const struct = this.state.struct();
          const found = struct
            .filter((s: any) => s.startsWith(structPath))
            .find(
              (s: any) =>
                s.charAt(structPath.length) === "." ||
                s.substring(structPath.length, structPath.length + 2) === "[]" ||
                s === structPath
            );

          if (found) this.initField(key, path, field, update);
        }
      }
    });
  }

  initField(
    key: string,
    path: string,
    data: any,
    update: boolean = false
  ): any {
    const initial = this.state.get("current", "props");
    const struct = pathToStruct(path);
    // try to get props from separated objects
    const _try = (prop: string) => {
      const t = _.get(initial[prop], struct);
      if (([
        FieldPropsEnum.input,
        FieldPropsEnum.output,
        FieldPropsEnum.converter,
      ] as string[]).includes(prop) && typeof t !== "function") return undefined;

      return t;
    };

    const props = {
      $value: _.get(initial[SeparatedPropsMode.values], path),
      $computed: _try(SeparatedPropsMode.computed),
      $label: _try(SeparatedPropsMode.labels),
      $placeholder: _try(SeparatedPropsMode.placeholders),
      $default: _try(SeparatedPropsMode.defaults),
      $initial: _try(SeparatedPropsMode.initials),
      $disabled: _try(SeparatedPropsMode.disabled),
      $deleted: _try(SeparatedPropsMode.deleted),
      $type: _try(SeparatedPropsMode.types),
      $related: _try(SeparatedPropsMode.related),
      $rules: _try(SeparatedPropsMode.rules),
      $options: _try(SeparatedPropsMode.options),
      $bindings: _try(SeparatedPropsMode.bindings),
      $extra: _try(SeparatedPropsMode.extra),
      $hooks: _try(SeparatedPropsMode.hooks),
      $handlers: _try(SeparatedPropsMode.handlers),
      $validatedWith: _try(SeparatedPropsMode.validatedWith),
      $validators: _try(SeparatedPropsMode.validators),
      $observers: _try(SeparatedPropsMode.observers),
      $interceptors: _try(SeparatedPropsMode.interceptors),
      $converters: _try(SeparatedPropsMode.converters),
      $input: _try(SeparatedPropsMode.input),
      $output: _try(SeparatedPropsMode.output),
      $autoFocus: _try(SeparatedPropsMode.autoFocus),
      $ref: _try(SeparatedPropsMode.refs),
      $nullable: _try(SeparatedPropsMode.nullable),
    };

    const field = this.state.form.makeField(
      {
        key,
        path,
        struct,
        data,
        props,
        update,
        state: this.state,
      },

      data && data[FieldPropsEnum.class] || _try(SeparatedPropsMode.classes)
    );

    this.fields.merge({ [key]: field });

    return field;
  }

  /******************************************************************
    Actions
  */

  validate(opt?: ValidateOptions, obj?: ValidateOptions): Promise<any> {
    const $opt = _.merge(opt, { path: this.path });
    return this.state.form.validator.validate($opt, obj);
  }

  /**
    Submit
  */
  submit(hooks: SubmitHooks = {}, {
    execOnSubmitHook = true,
    execValidationHooks = true,
    validate = true
  } = {}): Promise<any> {
    const execOnSubmit = () => this.execHook(FieldPropsEnum.onSubmit, hooks);
    const submit = execOnSubmitHook ? execOnSubmit() : undefined;
    this.$submitting = true;
    this.$submitted += 1;

    if (!validate || !this.state.options.get(OptionsEnum.validateOnSubmit, this)) {
      return Promise
        .resolve(submit)
        .then(action(() => (this.$submitting = false)))
        .catch(
          action((err: any) => {
            this.$submitting = false;
            throw err;
          })
        )
        .then(() => this)
    }

    const exec = (isValid: boolean) => isValid
      ? this.execHook(ValidationHooks.onSuccess, hooks)
      : this.execHook(ValidationHooks.onError, hooks);

    return (
      this.validate({
        showErrors: this.state.options.get(OptionsEnum.showErrorsOnSubmit, this),
      })
        .then(({ isValid }: any) => {
          const handler = execValidationHooks ? exec(isValid) : undefined;
          if (isValid) return Promise.all([submit, handler]);
          const $err = this.state.options.get(OptionsEnum.defaultGenericError, this);
          const $throw = this.state.options.get(OptionsEnum.submitThrowsError, this);
          if ($throw && $err) (this as any).invalidate();
          return Promise.all([submit, handler]);
        })
        .then(action(() => (this.$submitting = false)))
        .catch(
          action((err: any) => {
            this.$submitting = false;
            throw err;
          })
        )
        .then(() => this)
    );
  }

  /**
    Check Field Computed Values
   */
  check(prop: string, deep: boolean = false): boolean {
    allowedProps(AllowedFieldPropsTypes.computed, [prop]);

    return deep
      ? checkPropOccurrence({
          type: props.occurrences[prop],
          data: this.deepCheck(props.occurrences[prop], prop, this.fields),
        })
      : (this as any)[prop];
  }

  deepCheck(type: string, prop: string, fields: any): any {
    const $fields = getObservableMapValues(fields);
    return _.transform(
      $fields,
      (check: any, field: any) => {
        if (!field.fields.size || !Array.isArray(field.initial)) {
          check.push(field[prop]);
        }

        check.push(checkPropOccurrence({
          data: this.deepCheck(type, prop, field.fields),
          type,
        }));

        return check;
      },
      []
    );
  }

  /**
    Update Field Values recurisvely
    OR Create Field if 'undefined'
   */
  update(fields: any): void {
    if (!_.isPlainObject(fields)) {
      throw new Error("The update() method accepts only plain objects.");
    }

    this.deepUpdate(
      prepareFieldsData({ fields }, this.state.strict),
      undefined,
      undefined,
      fields
    );
  }

  deepUpdate(fields: any, path: string = "", recursion: boolean = true, raw?: any): void {
    _.each(fields, (field, key) => {
      const $key = _.has(field, FieldPropsEnum.name) ? field.name : key;
      const $path = _.trimStart(`${path}.${$key}`, ".");

      const strictUpdate = this.state.options.get(OptionsEnum.strictUpdate, this);
      const $field = this.select($path, null, strictUpdate);
      const $container = this.select(path, null, false) || this.state.form.select(this.path, null, false);
      const applyInputConverterOnUpdate = this.state.options.get(OptionsEnum.applyInputConverterOnUpdate, this);

      if (!_.isNil($field) && !_.isUndefined(field)) {
        if (Array.isArray($field.values())) {
          const n: number = _.max(_.map(field.fields, (f, i) => Number(i))) ?? -1;
          getObservableMapValues($field.fields).forEach(($f) => {
            if (Number($f.name) > n) {
              $field.$changed ++;
              $field.state.form.$changed ++;
              $field.fields.delete($f.name);
            }
          });
        }
        if (field?.fields) {
          const fallback = this.state.options.get(OptionsEnum.fallback);
          const x = this.state.struct().findIndex(s => s.startsWith($field.path.replace(/\.\d+\./, '[].') + '[]'));
          if (!fallback && $field.fields.size === 0 && x < 0) {
            $field.value = parseInput(applyInputConverterOnUpdate ? $field.$input : (val) => val, {
              fallbackValueOption: this.state.options.get(OptionsEnum.fallbackValue, this),
              separated: _.get(raw, $path),
            });
            return;
          }
        }
        if (_.isNull(field) || _.isNil(field.fields)) {
          $field.value = parseInput(applyInputConverterOnUpdate ? $field.$input : (val) => val, {
            fallbackValueOption: this.state.options.get(OptionsEnum.fallbackValue, this),
            separated: field,
          });
          return;
        }
      }

      if (!_.isNil($container) && _.isNil($field)) {
        // get full path when using update() with select() - FIX: #179
        const $newFieldPath = _.trimStart([this.path, $path].join("."), ".");
        // init field into the container field
        $container.$changed ++;
        $container.state.form.$changed ++;
        $container.initField($key, $newFieldPath, field, true);
      } else if (recursion) {
        if (_.has(field, FieldPropsEnum.fields) && !_.isNil(field.fields)) {
          // handle nested fields if defined
          this.deepUpdate(field.fields, $path);
        } else {
          // handle nested fields if undefined or null
          const $fields = pathToFieldsTree(this.state.struct(), $path);
          this.deepUpdate($fields, $path, false);
        }
      }
    });
  }

  /**
    Get Fields Props
   */
  get(prop: any = null, strict: boolean = true): any {
    if (_.isNil(prop)) {
      return this.deepGet(
        [...props.computed, ...props.editable, ...props.validation],
        this.fields,
        strict,
      );
    }

    allowedProps(AllowedFieldPropsTypes.all, Array.isArray(prop) ? prop : [prop]);

    if (_.isString(prop)) {
      if (([
        FieldPropsEnum.hooks,
        FieldPropsEnum.handlers
      ] as string[]).includes(prop)) {
        return this[`$${prop}`];
      }

      if (strict && this.fields.size === 0) {
        const retrieveNullifiedEmptyStrings = this.state.options.get(OptionsEnum.retrieveNullifiedEmptyStrings, this);
        return parseCheckOutput(this, prop, strict ? retrieveNullifiedEmptyStrings : false);
      }

      const value = this.deepGet(prop, this.fields, strict);
      const removeNullishValuesInArrays = this.state.options.get(OptionsEnum.removeNullishValuesInArrays, this);

      return parseCheckArray(this, value, prop, strict ? removeNullishValuesInArrays : false);
    }

    return this.deepGet(prop, this.fields, strict);
  }

  /**
    Get Fields Props Recursively
   */
  deepGet(prop: any, fields: any, strict = true): any {
    return _.transform(
      getObservableMapValues(fields),
      (obj: any, field: any) => {
        const $nested = ($fields: any) => $fields.size !== 0
          ? this.deepGet(prop, $fields, strict)
          : undefined;

        Object.assign(obj, {
          [field.key]: { fields: $nested(field.fields) },
        });

        if (_.isString(prop)) {
          const opt = this.state.options;
          const removeProp =
            ((opt.get(OptionsEnum.retrieveOnlyDirtyFieldsValues, this) && prop === FieldPropsEnum.value && field.isPristine) ||
            (opt.get(OptionsEnum.retrieveOnlyEnabledFieldsValues, this) && prop === FieldPropsEnum.value && field.disabled) ||
            (opt.get(OptionsEnum.retrieveOnlyEnabledFieldsErrors, this) && prop === FieldPropsEnum.error && field.disabled && field.isValid && (!field.error || !field.hasError)) ||
            (opt.get(OptionsEnum.softDelete, this) && prop === FieldPropsEnum.value && field.deleted));

          if (field.fields.size === 0) {
            delete obj[field.key];
            if (removeProp) return obj;
            const retrieveNullifiedEmptyStrings = this.state.options.get(OptionsEnum.retrieveNullifiedEmptyStrings, this);
            return Object.assign(obj, {
              [field.key]: parseCheckOutput(field, prop, strict ? retrieveNullifiedEmptyStrings : false),
            });
          }

          let value = this.deepGet(prop, field.fields, strict);
          if (prop === FieldPropsEnum.value) value = field.$output(value);

          delete obj[field.key];
          if (removeProp) return obj;
          const removeNullishValuesInArrays = this.state.options.get(OptionsEnum.removeNullishValuesInArrays, this);

          return Object.assign(obj, {
            [field.key]: parseCheckArray(field, value, prop, strict ? removeNullishValuesInArrays : false),
          });
        }

        _.each(prop, ($prop) =>
          Object.assign(obj[field.key], {
            [$prop]: field[$prop],
          })
        );

        return obj;
      },
      {}
    );
  }

  /**
    Set Fields Props
   */
  set(prop: any, data?: any): void {
    // UPDATE CUSTOM PROP
    if (_.isString(prop) && !_.isUndefined(data)) {
      allowedProps(AllowedFieldPropsTypes.editable, [prop]);

      const isPlain = ([
        FieldPropsEnum.hooks,
        FieldPropsEnum.handlers,
      ] as string[]).includes(prop);

      const deep: boolean = (_.isObject(data) && prop === FieldPropsEnum.value) || (_.isPlainObject(data) && !isPlain);
      if (deep && this.hasNestedFields) return this.deepSet(prop, data, "", true);

      if (prop === FieldPropsEnum.value) {
        const applyInputConverterOnSet = this.state.options.get(OptionsEnum.applyInputConverterOnSet, this);
        (this as any).value = parseInput(applyInputConverterOnSet ? (this as any).$input : (val) => val, {
          fallbackValueOption: this.state.options.get(OptionsEnum.fallbackValue, this),
          separated: data,
        });
      } else if(isPlain) {
        Object.assign(this[`$${prop}`], data);
      } else {
        _.set(this, `$${prop}`, data);
      }

      return;
    }

    // NO PROP NAME PROVIDED ("prop" is value)
    if (_.isNil(data)) {
      if (this.hasNestedFields) this.deepSet(FieldPropsEnum.value, prop, "", true);
      else this.set(FieldPropsEnum.value, prop);
    }
  }

  /**
    Set Fields Props Recursively
   */
  deepSet(
    prop: any,
    data: any,
    path: string = "",
    recursion: boolean = false
  ): void {
    const err = "You are updating a not existent field:";
    const isStrict = this.state.options.get(OptionsEnum.strictSet, this);

    if (_.isNil(data)) {
      this.each((field: any) => field.$value = defaultValue({
        fallbackValueOption: this.state.options.get(OptionsEnum.fallbackValue, this),
        value: field.$value,
        nullable: field.$nullable,
        type: field.type,
      }));
      return;
    }

    _.each(data, ($val, $key) => {
      const $path = _.trimStart(`${path}.${$key}`, ".");
      // get the field by path joining keys recursively
      const field = this.select($path, null, isStrict);
      // if no field found when is strict update, throw error
      if (isStrict) throwError($path, field, err);
      // update the field/fields if defined
      if (!_.isUndefined(field)) {
        // update field values or others props
        if (!_.isUndefined($val)) {
          field.set(prop, $val, recursion);
        }
        // update values recursively only if field has nested
        if (field.fields.size && _.isObject($val)) {
          this.deepSet(prop, $val, $path, recursion);
        }
      }
    });
  }

  /**
    Add Field
   */
  add(obj: any, execEvent: boolean = true): any {
    if (isArrayOfObjects(obj)) {
      _.each(obj, (values) =>
        this.update({
          [maxKey(this.fields)]: values,
        })
      );

      this.$changed ++;
      this.state.form.$changed ++;
      execEvent && this.execHook(FieldPropsEnum.onAdd);
      return this;
    }

    let key;
    if (_.has(obj, FieldPropsEnum.key)) key = obj.key;
    if (_.has(obj, FieldPropsEnum.name)) key = obj.name;
    if (!key) key = maxKey(this.fields);

    const $path = ($key: string) =>_.trimStart([this.path, $key].join("."), ".");
    const tree = pathToFieldsTree(this.state.struct(), this.path, 0, true);
    const field = this.initField(key, $path(key), _.merge(tree[0], obj));
    const hasValues = _.has(obj, FieldPropsEnum.value) || _.has(obj, FieldPropsEnum.fields);

    if(!hasValues && !this.state.options.get(OptionsEnum.preserveDeletedFieldsValues, this)) {
      const fallbackValueOption = this.state.options.get(OptionsEnum.fallbackValue, this);
      field.$value = defaultValue({ fallbackValueOption, value: field.$value, nullable: field.$nullable, type: field.type });
      field.each((field: any) => field.$value = defaultValue({
        fallbackValueOption,
        value: field.$value,
        nullable: field.$nullable,
        type: field.type
      }));
    }

    this.$changed ++;
    this.state.form.$changed ++;
    execEvent && this.execHook(FieldPropsEnum.onAdd);
    return field;
  }

  /**
    Del Field
   */
  del($path: string | null = null, execEvent: boolean = true) {
    const isStrict = this.state.options.get(OptionsEnum.strictDelete, this);
    const path = parsePath($path ?? this.path);
    const fullpath = _.trim([this.path, path].join("."), ".");
    const container = this.container($path);
    const keys = _.split(path, ".");
    const last = _.last(keys);

    if (isStrict && !container.fields.has(last)) {
      const msg = `Key "${last}" not found when trying to delete field`;
      throwError(fullpath, null, msg);
    }

    container.$changed ++;
    container.state.form.$changed ++;

    if (this.state.options.get(OptionsEnum.softDelete, this)) {
      return this.select(fullpath).set(FieldPropsEnum.deleted, true);
    }

    container.each((field) => field.debouncedValidation.cancel());
    execEvent && this.execHook(FieldPropsEnum.onDel);
    return container.fields.delete(last);
  }

  /******************************************************************
    Events
  */

  /**
    MobX Event (observe/intercept)
   */
  MOBXEvent({
    prop = FieldPropsEnum.value,
    key = null,
    path = null,
    call,
    type
  }: any): void {
    let $prop = key || prop;
    allowedProps(AllowedFieldPropsTypes.observable, [$prop]);
    const $instance = this.select(path || this.path, null, null) || this;

    const $call = (change: any) =>
      call.apply(null, [
        {
          change,
          form: this.state.form,
          path: $instance.path || null,
          field: $instance.path ? $instance : null,
        },
      ]);

    let fn;
    let ffn;

    if (type === "observer") {
      fn = observe;
      ffn = (cb: any) => observe($instance.fields, cb); // fields
    }

    if (type === "interceptor") {
      $prop = `$${prop}`;
      fn = intercept;
      ffn = $instance.fields.intercept; // fields
    }
    const $dkey = $instance.path ? `${$prop}@${$instance.path}` : $prop;

    _.merge(this.state.disposers[type], {
      [$dkey]:
      $prop === FieldPropsEnum.fields
          ? ffn.apply((change: any) => $call(change))
          : (fn as any)($instance, $prop, (change: any) => $call(change)),
    });
  }

  /**
    Dispose MOBX Events
   */
  dispose(opt = null): void {
    if (this.path && opt) return this.disposeSingle(opt);
    return this.disposeAll();
  }

  /**
    Dispose All Events (observe/intercept)
   */
  disposeAll() {
    const dispose = (disposer: any) => disposer.apply();
    _.each(this.state.disposers.interceptor, dispose);
    _.each(this.state.disposers.observer, dispose);
    this.state.disposers = { interceptor: {}, observer: {} };
    return null;
  }

  /**
    Dispose Single Event (observe/intercept)
   */
  disposeSingle({ type, key = FieldPropsEnum.value, path = null }: any) {
    const $path = parsePath(path ?? this.path);
    // eslint-disable-next-line
    if (type === "interceptor") key = `$${key}`; // target observables
    this.state.disposers[type][`${key}@${$path}`].apply();
    delete this.state.disposers[type][`${key}@${$path}`];
  }

  /******************************************************************
    Utils
  */

  /**
    Fields Selector
  */
  select(path: string, fields: any = null, isStrict: boolean = true) {
    const $path = parsePath(path);
    const keys = _.split($path, ".");
    const head = _.head(keys);

    keys.shift();

    let $fields = _.isNil(fields)
      ? this.fields.get(head)
      : fields.get(head);

    let stop = false;
    _.each(keys, ($key) => {
      if (stop) return;
      if (_.isNil($fields)) {
        $fields = undefined;
        stop = true;
      } else {
        $fields = $fields.fields.get($key);
      }
    });

    if (isStrict && this.state.options.get(OptionsEnum.strictSelect, this)) {
      throwError(path, $fields);
    }

    return $fields;
  }

  /**
    Get Container
   */
  container($path: string) {
    const path = parsePath($path ?? this.path);
    const cpath = _.trim(path.replace(new RegExp("[^./]+$"), ""), ".");

    if (!!this.path && _.isNil($path)) {
      return cpath !== ""
        ? this.state.form.select(cpath, null, false)
        : this.state.form;
    }

    return cpath !== "" ? this.select(cpath, null, false) : this;
  }

  /**
    Has Field
   */
  has(path: string): boolean {
    return this.fields.has(path);
  }

  /**
    Map Fields
  */
  map(cb: any): ReadonlyArray<FieldInterface> {
    return getObservableMapValues(this.fields).map(cb);
  }

  /**
   * Iterates deeply over fields and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, depth).
   *
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Array|Object} [fields=form.fields] fields to iterate over.
   * @param {number} [depth=1] The recursion depth for internal use.
   * @returns {Array} Returns [fields.values()] of input [fields] parameter.
   * @example
   *
   * JSON.stringify(form)
   * // => {
   *   "fields": {
   *     "state": {
   *       "fields": {
   *         "city": {
   *           "fields": { "places": {
   *                "fields": {},
   *                "key": "places", "path": "state.city.places", "$value": "NY Places"
   *              }
   *           },
   *           "key": "city", "path": "state.city", "$value": "New York"
   *         }
   *       },
   *       "key": "state", "path": "state", "$value": "USA"
   *     }
   *   }
   * }
   *
   * const data = {};
   * form.each(field => data[field.path] = field.value);
   * // => {
   *   "state": "USA",
   *   "state.city": "New York",
   *   "state.city.places": "NY Places"
   * }
   *
   */
  each(iteratee: any, fields: any = null, depth: number = 0) {
    const $fields = fields || this.fields;
    getObservableMapValues($fields).forEach((field: FieldInterface, index) => {
      iteratee(field, index, depth);

      if (field.fields.size !== 0) {
        this.each(iteratee, field.fields, depth + 1);
      }
    });
  }

  reduce(iteratee: any, acc: any): any {
    return getObservableMapValues(this.fields).reduce(iteratee, acc);
  }

  /******************************************************************
    Helpers
  */

  /**
    Fields Selector (alias of select)
   */
  $(key: string) {
    return this.select(key);
  }

  /**
    Fields Values (recursive with Nested Fields)
   */
  values() {
    return this.get(FieldPropsEnum.value);
  }

  /**
    Fields Errors (recursive with Nested Fields)
   */
  errors() {
    return this.get(FieldPropsEnum.error);
  }

  /**
    Fields Labels (recursive with Nested Fields)
   */
  labels() {
    return this.get(FieldPropsEnum.label);
  }

  /**
    Fields Placeholders (recursive with Nested Fields)
   */
  placeholders() {
    return this.get(FieldPropsEnum.placeholder);
  }

  /**
    Fields Default Values (recursive with Nested Fields)
   */
  defaults() {
    return this.get(FieldPropsEnum.default);
  }

  /**
    Fields Initial Values (recursive with Nested Fields)
   */
  initials() {
    return this.get(FieldPropsEnum.initial);
  }

  /**
    Fields Types (recursive with Nested Fields)
   */
  types() {
    return this.get(FieldPropsEnum.type);
  }
}
