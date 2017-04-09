import { observe, intercept } from 'mobx';
import _ from 'lodash';
import utils from '../utils';
import parser from '../parser';

/**
  Field Utils
*/
export default {

  on(event, callback) {
    const isField = !!this.path;
    const path = isField ? this.path : true;
    return observe(this.state.events.$running, change =>
      (event === change.name &&
      (change.newValue !== false) &&
      (this.state.events.$running[event] === path))
        && callback({
          path: this.state.events.$running[event],
          change: _.omit(change, 'type', 'object'),
          field: isField ? this : null,
          form: this.state.form,
          event,
        }));
  },

  /**
   MobX Event (observe/intercept)
   */
  MOBXEvent({ path = null, key = 'value', call, type }) {
    const $field = this.path ? this : this.select(path);

    const $call = change => call.apply(null, [{
      change,
      form: this.state.form,
      path: $field.path,
      field: $field,
    }]);

    let fn;
    let ffn;

    if (type === 'observer') {
      fn = observe;
      ffn = $field.fields.observe;
    }

    if (type === 'interceptor') {
      // eslint-disable-next-line
      key = `$${key}`;
      fn = intercept;
      ffn = $field.fields.intercept;
    }

    _.merge(this.state.disposers[type], {
      [`${key}@${$field.path}`]: (key === 'fields')
        ? ffn.apply(change => $call(change))
        : fn($field, key, change => $call(change)),
    });
  },

  /**
   Disposer
   */
  dispose({ type, key = 'value', path = null }) {
    const $path = parser.parsePath(utils.$try(path, this.path));
    // eslint-disable-next-line
    if (type === 'interceptor') key = `$${key}`;
    this.state.disposers[type][`${key}@${$path}`].apply();
    delete this.state.disposers[type][`${key}@${$path}`];
  },

  /**
   Fields Selector
   */
  select(path, fields = null, isStrict = true) {
    const $path = parser.parsePath(path);

    const keys = _.split($path, '.');
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

    if (isStrict) utils.throwError(path, $fields);

    return $fields;
  },

  /**
    Get Container
   */
  container(path) {
    const $path = parser.parsePath(utils.$try(path, this.path));
    const cpath = _.trim($path.replace(new RegExp('[^./]+$'), ''), '.');

    if (!!this.path && _.isNil(path)) {
      return this.state.form.select(cpath, null, false);
    }

    return this.select(cpath, null, false);
  },

  /**
    Has Field
   */
  has(path) {
    return this.fields.has(path);
  },

  /**
   Map Fields
  */
  map(cb) {
    return this.fields.values().map(cb);
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
  each(iteratee, fields = null, depth = 0) {
    const $fields = fields || this.fields;
    _.each($fields.values(), (field, index) => {
      iteratee(field, index, depth);

      if (field.fields.size !== 0) {
        this.each(iteratee, field.fields, depth + 1);
      }
    });
  },

};

