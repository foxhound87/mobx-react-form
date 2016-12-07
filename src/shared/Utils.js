import _ from 'lodash';
import utils from '../utils';
import parser from '../parser';

/**
  Field Utils
*/
export default {

  /**
   Fields Selector
   */
  select(path, fields = null, isStrict = true) {
    const $path = utils.parsePath(path);

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
  container(path = null) {
    const $path = path || this.path || '';
    const cpath = _.trimEnd($path.replace(new RegExp('/[^./]+$/'), ''), '.');
    return this.select(cpath, null, false);
  },

  /**
    Trasform a path to a tree
   */
  pathToFieldsTree(path, n = 0) {
    const $ss = this.state.struct();
    const structPath = utils.pathToStruct(path);
    const structArray = _.filter($ss, item => _.startsWith(item, structPath));
    const tree = parser.handleFieldsArrayOfStrings(structArray);
    const struct = _.replace(structPath, new RegExp('\\[]', 'g'), `[${n}]`);
    return parser.handleFieldsNested(_.get(tree, struct));
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
   * form.forEach(formField => data[formField.path] = formField.value);
   * // => {
     *   "state": "USA",
     *   "state.city": "New York",
     *   "state.city.places": "NY Places"
     * }
   *
   */
  forEach(iteratee, fields = null, depth = 0) {
    const $fields = fields || this.fields;
    _.each($fields.values(), (field, index) => {
      iteratee(field, index, depth);

      if (field.fields.size !== 0) {
        this.forEach(iteratee, field.fields, depth + 1);
      }
    });
  },

};

