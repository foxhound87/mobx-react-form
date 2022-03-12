import {
  observable,
  computed,
  action,
  toJS,
  makeObservable,
  observe,
  intercept,
} from "mobx";
import _ from "lodash";
import BaseInterface from "./models/BaseInterface";
import SharedInitializerInterface from "./models/SharedInitializerInterface";
import SharedActionsInterface from "./models/SharedActionsInterface";
import SharedEventsInterface from "./models/SharedEventsInterface";
import SharedHelpersInterface from "./models/SharedHelpersInterface";
import SharedUtilsInferface from "./models/SharedUtilsInterface";

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
} from "./parser";
export default class Base implements BaseInterface {
  noop = () => {};

  $submitted = 0;
  $submitting = false;

  $validated = 0;
  $validating = false;

  constructor() {
    makeObservable(this, {
      $submitted: observable,
      $submitting: observable,
      $validated: observable,
      $validating: observable,
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
      (this as any).$hooks[name],
      (this as any).hooks && (this as any).hooks.apply(this, [this])[name],
      this.noop
    ).apply(this, [this]);

  execHandler = (name: string, args: any, fallback: any = null): any => [
    $try(
      (this as any).$handlers[name] &&
        (this as any).$handlers[name].apply(this, [this]),
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
    return !!(this as any).fields.size && hasIntKeys((this as any).fields);
  }

  get hasNestedFields(): boolean {
    return (this as any).fields.size !== 0;
  }

  get size(): number {
    return (this as any).fields.size;
  }

  /**
    Interceptor
  */
  intercept = (opt: any): any =>
    (this as any).MOBXEvent(
      _.isFunction(opt)
        ? { type: "interceptor", call: opt }
        : { type: "interceptor", ...opt }
    );

  /**
    Observer
  */
  observe = (opt: any): any =>
    (this as any).MOBXEvent(
      _.isFunction(opt)
        ? { type: "observer", call: opt }
        : { type: "observer", ...opt }
    );

  /**
    Event Handler: On Clear
  */
  onClear = (...args: any): any =>
    this.execHandler("onClear", args, (e: Event) => {
      e.preventDefault();
      (this as any).clear(true);
    });

  /**
    Event Handler: On Reset
  */
  onReset = (...args: any): any =>
    this.execHandler("onReset", args, (e: Event) => {
      e.preventDefault();
      (this as any).reset(true);
    });

  /**
    Event Handler: On Submit
   */
  onSubmit = (...args: any): any =>
    this.execHandler("onSubmit", args, (e: Event, o = {}) => {
      e.preventDefault();
      (this as any).submit(o);
    });

  /**
    Event Handler: On Add
  */
  onAdd = (...args: any): any =>
    this.execHandler("onAdd", args, (e: Event, val: any) => {
      e.preventDefault();
      (this as any).add($isEvent(val) ? null : val);
    });

  /**
    Event Handler: On Del
  */
  onDel = (...args: any): any =>
    this.execHandler("onDel", args, (e: Event, path: string) => {
      e.preventDefault();
      (this as any).del($isEvent(path) ? (this as any).path : path);
    });

  /******************************************************************
    Initializer
  */
  initFields(initial: any, update: boolean = false): void {
    const fallback = (this as any).state.options.get("fallback");
    const $path = (key: string) =>
      _.trimStart([(this as any).path, key].join("."), ".");

    let fields;
    fields = prepareFieldsData(initial, (this as any).state.strict, fallback);
    fields = mergeSchemaDefaults(fields, (this as any).validator);

    // create fields
    _.forIn(fields, (field, key) => {
      const path = $path(key);
      const $f = (this as any).select(path, null, false);
      if (_.isNil($f)) {
        if (fallback) {
          this.initField(key, path, field, update);
        } else {
          const structPath = pathToStruct(path);
          const struct = (this as any).state.struct();
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
    const initial = (this as any).state.get("current", "props");
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

    const field = (this as any).state.form.makeField({
      key,
      path,
      data,
      props,
      update,
      state: (this as any).state,
    });

    (this as any).fields.merge({ [key]: field });

    return field;
  }

  /******************************************************************
    Actions
  */

  validate(opt: any = {}, obj: any = {}) {
    const $opt = _.merge(opt, { path: (this as any).path });
    return (this as any).state.form.validator.validate($opt, obj);
  }

  /**
    Submit
  */
  submit(o: any = {}) {
    (this as any).$submitting = true;
    (this as any).$submitted += 1;

    const exec = (isValid: boolean) =>
      isValid
        ? (this as any).execHook("onSuccess", o)
        : (this as any).execHook("onError", o);

    return (
      this.validate({
        showErrors: (this as any).state.options.get("showErrorsOnSubmit", this),
      })
        .then(({ isValid }: any) => {
          const handler = exec(isValid);
          if (isValid) return handler;
          const $err = (this as any).state.options.get(
            "defaultGenericError",
            this
          );
          const $throw = (this as any).state.options.get(
            "submitThrowsError",
            this
          );
          if ($throw && $err) (this as any).invalidate();
          return handler;
        })
        // eslint-disable-next-line
        .then(action(() => ((this as any).$submitting = false)))
        .catch(
          action((err: any) => {
            (this as any).$submitting = false;
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
          data: this.deepCheck(props.types[prop], prop, (this as any).fields),
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

    this.deepUpdate(prepareFieldsData({ fields }));
  }

  deepUpdate(fields: any, path: string = "", recursion: boolean = true): void {
    _.each(fields, (field, key) => {
      const $key = _.has(field, "name") ? field.name : key;
      const $path = _.trimStart(`${path}.${$key}`, ".");
      const $field = (this as any).select($path, null, false);
      const $container =
        (this as any).select(path, null, false) ||
        (this as any).state.form.select((this as any).path, null, false);

      if (!_.isNil($field) && !_.isUndefined(field)) {
        if (_.isArray($field.values())) {
          let n: number = _.max(_.map(field.fields, (f, i) => Number(i))) ?? -1;
          _.each(getObservableMapValues($field.fields), ($f) => {
            if (Number($f.name) > n) $field.fields.delete($f.name);
          });
        }
        if (_.isNull(field) || _.isNil(field.fields)) {
          $field.$value = parseInput($field.$input, {
            separated: field,
          });
          return;
        }
      }

      if (!_.isNil($container) && _.isNil($field)) {
        // get full path when using update() with select() - FIX: #179
        const $newFieldPath = _.trimStart(
          [(this as any).path, $path].join("."),
          "."
        );
        // init field into the container field
        $container.initField($key, $newFieldPath, field, true);
      } else if (recursion) {
        if (_.has(field, "fields") && !_.isNil(field.fields)) {
          // handle nested fields if defined
          this.deepUpdate(field.fields, $path);
        } else {
          // handle nested fields if undefined or null
          const $fields = pathToFieldsTree((this as any).state.struct(), $path);
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
        (this as any).fields
      );
    }

    allowedProps("all", _.isArray(prop) ? prop : [prop]);

    if (_.isString(prop)) {
      if (strict && (this as any).fields.size === 0) {
        return parseCheckOutput(this, prop);
      }

      const value = this.deepGet(prop, (this as any).fields);
      return parseCheckArray(this, value, prop);
    }

    return this.deepGet(prop, (this as any).fields);
  }

  /**
    Get Fields Props Recursively
   */
  deepGet(prop: any, fields: any): any {
    return _.transform(
      getObservableMapValues(fields),
      (obj: any, field: any) => {
        const $nested = ($fields: any) =>
          $fields.size !== 0 ? this.deepGet(prop, $fields) : undefined;

        Object.assign(obj, {
          [field.key]: { fields: $nested(field.fields) },
        });

        if (_.isString(prop)) {
          const removeValue =
            prop === "value" &&
            (((this as any).state.options.get(
              "retrieveOnlyDirtyValues",
              this
            ) &&
              field.isPristine) ||
              ((this as any).state.options.get(
                "retrieveOnlyEnabledFields",
                this
              ) &&
                field.disabled) ||
              ((this as any).state.options.get("softDelete", this) &&
                field.deleted));

          if (field.fields.size === 0) {
            delete obj[field.key]; // eslint-disable-line
            if (removeValue) return obj;
            return Object.assign(obj, {
              [field.key]: parseCheckOutput(field, prop),
            });
          }

          let value = this.deepGet(prop, field.fields);
          if (prop === "value") value = field.$output(value);

          delete obj[field.key]; // eslint-disable-line
          if (removeValue) return obj;

          return Object.assign(obj, {
            [field.key]: parseCheckArray(field, value, prop),
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
  set(prop: any, data: any): void {
    // UPDATE CUSTOM PROP
    if (_.isString(prop) && !_.isUndefined(data)) {
      allowedProps("field", [prop]);
      const deep =
        (_.isObject(data) && prop === "value") || _.isPlainObject(data);
      if (deep && (this as any).hasNestedFields)
        this.deepSet(prop, data, "", true);
      else _.set(this, `$${prop}`, data);
      return;
    }

    // NO PROP NAME PROVIDED ("prop" is value)
    if (_.isNil(data)) {
      if ((this as any).hasNestedFields) this.deepSet("value", prop, "", true);
      else this.set("value", prop);
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
    const isStrict = (this as any).state.options.get("strictUpdate", this);

    if (_.isNil(data)) {
      (this as any).each((field: any) => field.clear(true));
      return;
    }

    _.each(data, ($val, $key) => {
      const $path = _.trimStart(`${path}.${$key}`, ".");
      // get the field by path joining keys recursively
      const field = (this as any).select($path, null, isStrict);
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
  add(obj: any): any {
    if (isArrayOfObjects(obj)) {
      return _.each(obj, (values) =>
        this.update({
          [maxKey((this as any).fields)]: values,
        })
      );
    }

    let key; // eslint-disable-next-line
    if (_.has(obj, "key")) key = obj.key;
    if (_.has(obj, "name")) key = obj.name;
    if (!key) key = maxKey((this as any).fields);

    const $path = ($key: string) =>
      _.trimStart([(this as any).path, $key].join("."), ".");
    const tree = pathToFieldsTree(
      (this as any).state.struct(),
      (this as any).path,
      0,
      true
    );
    return this.initField(key, $path(key), _.merge(tree[0], obj));
  }

  /**
    Del Field
   */
  del($path: string | null = null) {
    const isStrict = (this as any).state.options.get("strictDelete", this);
    const path = parsePath($path ?? (this as any).path);
    const fullpath = _.trim([(this as any).path, path].join("."), ".");
    const container = (this as any).container($path);
    const keys = _.split(path, ".");
    const last = _.last(keys);

    if (isStrict && !container.fields.has(last)) {
      const msg = `Key "${last}" not found when trying to delete field`;
      throwError(fullpath, null, msg);
    }

    if ((this as any).state.options.get("softDelete", this)) {
      return (this as any).select(fullpath).set("deleted", true);
    }

    return container.fields.delete(last);
  }

  /******************************************************************
    Events
  */

  /**
    MobX Event (observe/intercept)
   */
  MOBXEvent({ path = null, key = "value", call, type }: any): void {
    const $instance =
      (this as any).select(path || (this as any).path, null, null) || this;

    const $call = (change: any) =>
      call.apply(null, [
        {
          change,
          form: (this as any).state.form,
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

    _.merge((this as any).state.disposers[type], {
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
    if ((this as any).path && opt) return this.disposeSingle(opt);
    return this.disposeAll();
  }

  /**
    Dispose All Events (observe/intercept)
   */
  disposeAll() {
    const dispose = (disposer: any) => disposer.apply();
    _.each((this as any).state.disposers.interceptor, dispose);
    _.each((this as any).state.disposers.observer, dispose);
    (this as any).state.disposers = { interceptor: {}, observer: {} };
    return null;
  }

  /**
    Dispose Single Event (observe/intercept)
   */
  disposeSingle({ type, key = "value", path = null }: any) {
    const $path = parsePath(path ?? (this as any).path);
    // eslint-disable-next-line
    if (type === "interceptor") key = `$${key}`; // target observables
    (this as any).state.disposers[type][`${key}@${$path}`].apply();
    delete (this as any).state.disposers[type][`${key}@${$path}`];
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
      ? (this as any).fields.get(head)
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

    if (isStrict) throwError(path, $fields);

    return $fields;
  }

  /**
    Get Container
   */
  container($path: string) {
    const path = parsePath($path ?? (this as any).path);
    const cpath = _.trim(path.replace(new RegExp("[^./]+$"), ""), ".");

    if (!!(this as any).path && _.isNil($path)) {
      return cpath !== ""
        ? (this as any).state.form.select(cpath, null, false)
        : (this as any).state.form;
    }

    return cpath !== "" ? this.select(cpath, null, false) : this;
  }

  /**
    Has Field
   */
  has(path: string): boolean {
    return (this as any).fields.has(path);
  }

  /**
    Map Fields
  */
  map(cb: any): any {
    return getObservableMapValues((this as any).fields).map(cb);
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
    const $fields = fields || (this as any).fields;
    _.each(getObservableMapValues($fields), (field, index) => {
      iteratee(field, index, depth);

      if (field.fields.size !== 0) {
        this.each(iteratee, field.fields, depth + 1);
      }
    });
  }

  /******************************************************************
    Helpers
  */

  /**
    Fields Selector (alias of select)
   */
  $(key: string) {
    return (this as any).select(key);
  }

  /**
    Fields Values (recursive with Nested Fields)
   */
  values() {
    return (this as any).get("value");
  }

  /**
    Fields Errors (recursive with Nested Fields)
   */
  errors() {
    return (this as any).get("error");
  }

  /**
    Fields Labels (recursive with Nested Fields)
   */
  labels() {
    return (this as any).get("label");
  }

  /**
    Fields Placeholders (recursive with Nested Fields)
   */
  placeholders() {
    return (this as any).get("placeholder");
  }

  /**
    Fields Default Values (recursive with Nested Fields)
   */
  defaults() {
    return (this as any).get("default");
  }

  /**
    Fields Initial Values (recursive with Nested Fields)
   */
  initials() {
    return (this as any).get("initial");
  }

  /**
    Fields Types (recursive with Nested Fields)
   */
  types() {
    return (this as any).get("type");
  }
}
