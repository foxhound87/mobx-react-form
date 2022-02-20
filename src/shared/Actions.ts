import { action, makeObservable } from "mobx";
import _ from "lodash";

import {
  props,
  allowedProps,
  checkPropType,
  throwError,
  isArrayOfObjects,
  getObservableMapValues,
  maxKey,
  $try,
} from "../utils";

import {
  prepareFieldsData,
  parsePath,
  parseInput,
  parseCheckArray,
  parseCheckOutput,
  pathToFieldsTree,
} from "../parser";

import Initializer from "./Initializer";
import SharedActionsInterface from "src/models/SharedActionsInterface";

/**
  Field Actions
*/
export default class Actions
  extends Initializer
  implements SharedActionsInterface
{
  constructor() {
    super();

    makeObservable(this, {
      submit: action,
      deepUpdate: action,
      set: action,
      add: action,
      del: action,
    });
  }

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
}
