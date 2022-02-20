import _ from "lodash";
import { throwError, getObservableMapValues } from "../utils";
import { parsePath } from "../parser";
import SharedUtilsInferface from "src/models/SharedUtilsInterface";

/**
  Field Utils
*/
export const SharedUtils: SharedUtilsInferface = {
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
  },

  /**
    Get Container
   */
  container($path: string) {
    const path = parsePath($path || (this as any).path);
    const cpath = _.trim(path.replace(new RegExp("[^./]+$"), ""), ".");

    if (!!(this as any).path && _.isNil($path)) {
      return cpath !== ""
        ? (this as any).state.form.select(cpath, null, false)
        : (this as any).state.form;
    }

    return cpath !== "" ? this.select(cpath, null, false) : this;
  },

  /**
    Has Field
   */
  has(path: string): boolean {
    return (this as any).fields.has(path);
  },

  /**
    Map Fields
  */
  map(cb: any): any {
    return getObservableMapValues((this as any).fields).map(cb);
  },

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
  },
};
