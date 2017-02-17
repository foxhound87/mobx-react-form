import { action } from 'mobx';
import _ from 'lodash';
import utils from '../utils';
import parser from '../parser';

/**
  Field Actions
*/
export default {

  /**
   Check Field Computed Values
   */
  check(computed, deep = false) {
    utils.allowed('computed', [computed]);

    const $ = {
      hasError: 'some',
      isValid: 'every',
      isDirty: 'some',
      isPristine: 'every',
      isDefault: 'every',
      isEmpty: 'every',
      focus: 'some',
      touched: 'some',
      changed: 'some',
      disabled: 'every',
    };

    return deep
      ? utils.check({
        type: $[computed],
        data: this.deepCheck($[computed], computed, this.fields),
      })
      : this[computed];
  },

  deepCheck($, prop, fields) {
    return _.reduce(fields.values(), (check, field) => {
      if (field.fields.size === 0) {
        check.push(field[prop]);
        return check;
      }
      const $deep = this.deepCheck($, prop, field.fields);
      check.push(utils.check({ type: $, data: $deep }));
      return check;
    }, []);
  },

  /**
   Update Field Values recurisvely
   OR Create Field if 'undefined'
   */
  update(fields) {
    const $fields = parser.prepareFieldsData({ fields }, this.state.strict);
    this.deepUpdate($fields);
  },

  @action
  deepUpdate(fields, path = '', recursion = true) {
    _.each(fields, (field, key) => {
      const $path = _.trimStart(`${path}.${key}`, '.');
      const $field = this.select($path, null, false);
      const $container = this.container(path);

      if (!_.isNil($field) && !_.isNil(field)) {
        if (_.isArray($field.values())) {
          _.each($field.fields.values(), $f =>
            $field.fields.delete($f.name));
        }
        if (_.isNil(field.fields)) {
          $field.value = field;
          return;
        }
      }

      if (!_.isNil($container)) {
        // get full path when using update() with select() - FIX: #179
        const $fullPath = _.trimStart([this.path, $path].join('.'), '.');
        // init field into the container field
        $container.initField(key, $fullPath, field, null, true);
      }

      if (recursion) {
        // handle nested fields if undefined or null
        const $fields = parser.pathToFieldsTree(this.state.struct(), $path);
        this.deepUpdate($fields, $path, false);
      }

      if (recursion && _.has(field, 'fields') && !_.isNil(field.fields)) {
        // handle nested fields if defined
        this.deepUpdate(field.fields, $path);
      }
    });
  },

  /**
   Map Fields
  */
  map(path, callback = null) {
    if (_.isFunction(path) && !callback) {
      // path is the callback here
      return this.fields.values().map(path);
    }

    const field = this.select(path);
    return field.fields.values().map(callback);
  },

  /**
    Get Fields Props
   */
  get(prop = null) {
    if (_.isNil(prop)) {
      const all = [...utils.computed, ...utils.props, ...utils.vprops];
      return this.deepGet(all, this.fields);
    }

    utils.allowed('all', _.isArray(prop) ? prop : [prop]);

    if (_.isString(prop)) {
      if (this.fields.size === 0) {
        return parser.parseCheckFormatter(this, prop);
      }

      const value = this.deepGet(prop, this.fields);
      return parser.parseCheckArray(this, value, prop);
    }

    return this.deepGet(prop, this.fields);
  },

  /**
    Get Fields Props Recursively
   */
  deepGet(prop, fields) {
    return _.reduce(fields.values(), (obj, field) => {
      const $nested = $fields => ($fields.size !== 0)
        ? this.deepGet(prop, $fields)
        : undefined;

      Object.assign(obj, {
        [field.key]: { fields: $nested(field.fields) },
      });

      if (_.isString(prop)) {
        if (field.fields.size === 0) {
          return Object.assign(obj, {
            [field.key]: parser.parseCheckFormatter(field, prop),
          });
        }

        let value = this.deepGet(prop, field.fields);
        if (prop === 'value') value = field.$formatter(value);

        return Object.assign(obj, {
          [field.key]: parser.parseCheckArray(field, value, prop),
        });
      }

      _.each(prop, $prop =>
        Object.assign(obj[field.key], {
          [$prop]: field[$prop],
        }));

      return obj;
    }, {});
  },

  /**
   Set Fields Props
   */
  @action
  set($, data, recursion = false) {
    const $e = 'update';
    // console.log('a', $, data);

    if (!recursion) {
      this.state.events.set($e, this.path || true);
    }

    // UPDATE CUSTOM PROP
    if (_.has(this, 'isField')) {
      if (_.isString($) && !_.isUndefined(data)) {
        utils.allowed('props', [$]);
        _.set(this, `$${$}`, data);
        if (!recursion) this.state.events.set($e, false);
        return;
      }

      if (_.isString($) && _.isUndefined(data)) {
        // update just the value
        this.set('value', $);
        if (!recursion) this.state.events.set($e, false);
        return;
      }
    }

    // UPDATE NESTED FIELDS VALUE (recursive)
    if (_.isObject($) && !data) {
      // $ is the data
      this.deepSet('value', $, '', true);
      if (!recursion) this.state.events.set($e, false);
      return;
    }

    // UPDATE NESTED CUSTOM PROP (recursive)
    if (_.isString($) && _.isObject(data)) {
      utils.allowed('props', [$]);
      // $ is the prop key
      this.deepSet($, data, '', true);
      if (!recursion) this.state.events.set($e, false);
    }
  },

  /**
    Set Fields Props Recursively
   */
  deepSet($, data, path = '', recursion = false) {
    const err = 'You are updating a not existent field:';
    const isStrict = this.state.options.get('strictUpdate');

    _.each(data, ($val, $key) => {
      const $path = _.trimStart(`${path}.${$key}`, '.');
      // get the field by path joining keys recursively
      const field = this.select($path, null, isStrict);
      // if no field found when is strict update, throw error
      if (isStrict) utils.throwError($path, field, err);
      // update the field/fields if defined
      if (!_.isUndefined(field)) {
        // update field values or others props
        // console.log('c', $, $val);
        field.set($, $val, recursion);
        // update values recursively only if field has nested
        if (field.fields.size && _.isObject($val)) {
          this.deepSet($, $val, $path, recursion);
        }
      }
    });
  },

  /**
    Call field method recursively
  */
  deepAction($action, fields, recursion = false) {
    if (!recursion) {
      this.state.events.set($action, this.path || true);
    }

    if (fields.size !== 0) {
      fields.forEach((field) => {
        field[$action]();
        this.deepAction($action, field.fields, true);
      });
    }

    if (!recursion) {
      this.state.events.set($action, false);
    }
  },

  /**
   Add Field
   */
  @action
  add(value = null, opt = {}) {
    let $key;

    if (_.has(opt, 'key')) $key = opt.key;
    else $key = utils.maxKey(this.fields);

    const tree = parser.pathToFieldsTree(this.state.struct(), this.path, 0, true);
    const $path = key => _.trimStart([this.path, key].join('.'), '.');

    _.each(tree, field => this.initField($key, $path($key), field));

    if (!_.isNil(value)) {
      const field = this.select($key);

      if (_.isPlainObject(value)) {
        field.update(value);
      }

      field.initial = value;
      field.default = value;
      field.set('value', value);
    }

    return $key;
  },

  /**
   Del Field
   */
  @action
  del(partialPath = null) {
    const path = parser.parsePath(partialPath);
    const keys = _.split(path, '.');
    const last = _.last(keys);
    const cpath = _.trimEnd(path, `.${last}`);
    const isStrict = this.state.options.get('strictDelete');

    const container = this.select(cpath, null, false)
      || this.state.form.select(cpath, null, false)
      || this.state.form.select(this.path, null, true);

    if (isStrict && !container.fields.has(last)) {
      const msg = `Key "${last}" not found when trying to delete field`;
      const $path = _.trimStart([this.path, path].join('.'), '.');
      utils.throwError($path, null, msg);
    }

    container.fields.delete(last);
  },

};
