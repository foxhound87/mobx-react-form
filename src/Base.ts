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
import BaseInterface from "./models/BaseInterface";
import StateInterface from "./models/StateInterface";
import FieldInterface from "./models/FieldInterface";

import {
  props,
  allowedProps,
  checkPropType,
  throwError,
  isArrayOfObjects,
  getObservableMapValues,
  maxKey,
  $try,
  $isEvent,
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
  defaultClearValue,
} from "./parser";
import { FieldPropsEnum } from "./models/FieldProps";
import { OptionsEnum } from "./models/OptionsModel";
export default class Base implements BaseInterface {
  noop = () => {};

  state: StateInterface;

  fields: ObservableMap = observable.map({});
  path: string | undefined | null;

  $submitted: number = 0;
  $submitting: boolean = false;

  $validated: number = 0;
  $validating: boolean = false;

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
      $touched: observable,
      $changed: observable,
      changed: computed,
      submitted: computed,
      submitting: computed,
      validated: computed,
      validating: computed,
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
      (this as any).hooks && (this as any).hooks.apply(this, [this])[name],
      this.noop
    ).apply(this, [this]);

  execHandler = (name: string, args: any, fallback: any = null): any => [
    $try(
      this.$handlers[name] && this.$handlers[name].apply(this, [this]),
      (this as any).handlers &&
        (this as any).handlers.apply(this, [this])[name] &&
        (this as any).handlers.apply(this, [this])[name].apply(this, [this]),
      fallback,
      this.noop
    ).apply(this, [...args]),
    this.execHook(name),
  ];

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
      _.isFunction(opt)
        ? { type: "interceptor", call: opt }
        : { type: "interceptor", ...opt }
    );

  /**
    Observer
  */
  observe = (opt: any): any =>
    this.MOBXEvent(
      _.isFunction(opt)
        ? { type: "observer", call: opt }
        : { type: "observer", ...opt }
    );

  /**
    Event Handler: On Clear
  */
  onClear = (...args: any): any =>
    this.execHandler(FieldPropsEnum.onClear, args, (e: Event) => {
      e.preventDefault();
      (this as any).clear(true, false);
    });

  /**
    Event Handler: On Reset
  */
  onReset = (...args: any): any =>
    this.execHandler(FieldPropsEnum.onReset, args, (e: Event) => {
      e.preventDefault();
      (this as any).reset(true, false);
    });

  /**
    Event Handler: On Submit
   */
  onSubmit = (...args: any): any =>
    this.execHandler(FieldPropsEnum.onSubmit, args, (e: Event, o = {}) => {
      e.preventDefault();
      this.submit(o, false);
    });

  /**
    Event Handler: On Add
  */
  onAdd = (...args: any): any =>
    this.execHandler(FieldPropsEnum.onAdd, args, (e: Event, val: any) => {
      e.preventDefault();
      this.add($isEvent(val) ? null : val, false);
    });

  /**
    Event Handler: On Del
  */
  onDel = (...args: any): any =>
    this.execHandler(FieldPropsEnum.onDel, args, (e: Event, path: string) => {
      e.preventDefault();
      this.del($isEvent(path) ? this.path : path, false);
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
                s.substr(structPath.length, 2) === "[]" ||
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
    const $try = (prop: string) => {
      const t = _.get(initial[prop], struct);
      if ((prop === "input" || prop === "output") && typeof t !== "function")
        return undefined;
      return t;
    };

    const props = {
      $value: _.get(initial["values"], path),
      $label: $try("labels"),
      $placeholder: $try("placeholders"),
      $default: $try("defaults"),
      $initial: $try("initials"),
      $disabled: $try("disabled"),
      $bindings: $try("bindings"),
      $type: $try("types"),
      $options: $try("options"),
      $extra: $try("extra"),
      $related: $try("related"),
      $hooks: $try("hooks"),
      $handlers: $try("handlers"),
      $validatedWith: $try("validatedWith"),
      $validators: $try("validators"),
      $rules: $try("rules"),
      $observers: $try("observers"),
      $interceptors: $try("interceptors"),
      $input: $try("input"),
      $output: $try("output"),
    };

    const field = this.state.form.makeField({
      key,
      path,
      data,
      props,
      update,
      state: this.state,
    });

    this.fields.merge({ [key]: field });

    return field;
  }

  /******************************************************************
    Actions
  */

  validate(opt: any = {}, obj: any = {}): Promise<any> {
    const $opt = _.merge(opt, { path: this.path });
    return this.state.form.validator.validate($opt, obj);
  }

  /**
    Submit
  */
  submit(o: any = {}, execHook: boolean = true): Promise<any> {
    execHook && this.execHook(FieldPropsEnum.onSubmit, o);
    this.$submitting = true;
    this.$submitted += 1;

    const exec = (isValid: boolean) =>
      isValid ? this.execHook("onSuccess", o) : this.execHook("onError", o);

    return (
      this.validate({
        showErrors: this.state.options.get(OptionsEnum.showErrorsOnSubmit, this),
      })
        .then(({ isValid }: any) => {
          const handler = exec(isValid);
          if (isValid) return handler;
          const $err = this.state.options.get(OptionsEnum.defaultGenericError, this);
          const $throw = this.state.options.get(OptionsEnum.submitThrowsError, this);
          if ($throw && $err) (this as any).invalidate();
          return handler;
        })
        // eslint-disable-next-line
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
    allowedProps("computed", [prop]);

    return deep
      ? checkPropType({
          type: props.types[prop],
          data: this.deepCheck(props.types[prop], prop, this.fields),
        })
      : (this as any)[prop];
  }

  deepCheck(type: string, prop: string, fields: any): any {
    const $fields = getObservableMapValues(fields);
    return _.transform(
      $fields,
      (check: any, field: any) => {
        if (!field.fields.size || props.exceptions.includes(prop)) {
          check.push(field[prop]);
        }

        const $deep = this.deepCheck(type, prop, field.fields);
        check.push(checkPropType({ type, data: $deep }));
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
      const $field = this.select($path, null, false);
      const $container =
        this.select(path, null, false) ||
        this.state.form.select(this.path, null, false);

      if (!_.isNil($field) && !_.isUndefined(field)) {
        if (_.isArray($field.values())) {
          const n: number = _.max(_.map(field.fields, (f, i) => Number(i))) ?? -1;
          _.each(getObservableMapValues($field.fields), ($f) => {
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
            $field.value = parseInput($field.$input, {
              separated: _.get(raw, $path),
            });
            return;
          }
        }
        if (_.isNull(field) || _.isNil(field.fields)) {
          $field.value = parseInput($field.$input, {
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
        if (_.has(field, "fields") && !_.isNil(field.fields)) {
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
        [...props.computed, ...props.field, ...props.validation],
        this.fields
      );
    }

    allowedProps("all", _.isArray(prop) ? prop : [prop]);

    if (_.isString(prop)) {
      if (strict && this.fields.size === 0) {
        return parseCheckOutput(this, prop);
      }

      const value = this.deepGet(prop, this.fields);
      const removeNullishValuesInArrays = this.state.options.get(OptionsEnum.removeNullishValuesInArrays, this);

      return parseCheckArray(this, value, prop, removeNullishValuesInArrays);
    }

    return this.deepGet(prop, this.fields);
  }

  /**
    Get Fields Props Recursively
   */
  deepGet(prop: any, fields: any): any {
    return _.transform(
      getObservableMapValues(fields),
      (obj: any, field: any) => {
        const $nested = ($fields: any) => $fields.size !== 0
          ? this.deepGet(prop, $fields)
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
            delete obj[field.key]; // eslint-disable-line
            if (removeProp) return obj;
            return Object.assign(obj, {
              [field.key]: parseCheckOutput(field, prop),
            });
          }

          let value = this.deepGet(prop, field.fields);
          if (prop === FieldPropsEnum.value) value = field.$output(value);

          delete obj[field.key];
          // if (removeProp) return obj;

          const removeNullishValuesInArrays = this.state.options.get(OptionsEnum.removeNullishValuesInArrays, this);

          return Object.assign(obj, {
            [field.key]: parseCheckArray(field, value, prop, removeNullishValuesInArrays),
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
      allowedProps("field", [prop]);
      const deep = (_.isObject(data) && prop === FieldPropsEnum.value) || _.isPlainObject(data);
      if (deep && this.hasNestedFields) this.deepSet(prop, data, "", true);
      else _.set(this, `$${prop}`, data);

      if (prop === FieldPropsEnum.value) {
        this.$changed ++;
        this.state.form.$changed ++;
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
    const isStrict = this.state.options.get(OptionsEnum.strictUpdate, this);

    if (_.isNil(data)) {
      this.each((field: any) => field.$value = defaultClearValue({ value: field.$value }));
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
      return;
    }

    let key;
    if (_.has(obj, "key")) key = obj.key;
    if (_.has(obj, "name")) key = obj.name;
    if (!key) key = maxKey(this.fields);

    const $path = ($key: string) =>_.trimStart([this.path, $key].join("."), ".");
    const tree = pathToFieldsTree(this.state.struct(), this.path, 0, true);
    const field = this.initField(key, $path(key), _.merge(tree[0], obj));

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
      return this.select(fullpath).set("deleted", true);
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
  MOBXEvent({ path = null, key = FieldPropsEnum.value, call, type }: any): void {
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
      ffn = (cb: any) => observe($instance.fields, cb);
    }

    if (type === "interceptor") {
      // eslint-disable-next-line
      key = `$${key}`;
      fn = intercept;
      ffn = $instance.fields.intercept;
    }

    const $dkey = $instance.path ? `${key}@${$instance.path}` : key;

    _.merge(this.state.disposers[type], {
      [$dkey]:
        key === "fields"
          ? ffn.apply((change: any) => $call(change))
          : (fn as any)($instance, key, (change: any) => $call(change)),
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

    let $fields = _.isNil(fields) ? this.fields.get(head) : fields.get(head);

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

    if (isStrict) throwError(path, $fields);

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
    _.each(getObservableMapValues($fields), (field: FieldInterface, index) => {
      iteratee(field, index, depth);

      if (field.fields.size !== 0) {
        this.each(iteratee, field.fields, depth + 1);
      }
    });
  }

  reduce(iteratee: any, acc: any): any {
    return _.reduce(getObservableMapValues(this.fields), iteratee, acc);
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
    return this.get(FieldPropsEnum.placeholder);
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
