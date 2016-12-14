import { action, observe, asMap } from 'mobx';
import _ from 'lodash';
import utils from '../utils';
import parser from '../parser';
import Events from '../Events';

/**
  Field Actions
*/
export default {

  /**
   Init Form Fields and Nested Fields
   */
  @action
  init($fields = null) {
    _.set(this, 'fields', asMap({}));

    this.state.initial.props.values = $fields; // eslint-disable-line
    this.state.current.props.values = $fields; // eslint-disable-line

    this.initFields({
      fields: $fields || this.state.struct(),
    });
  },

  /**
   Observe Fields and Validate
  */
  observeFields(fields = null) {
    // deep observe and validate each field
    this.deepObserveFields(fields || this.fields);
  },

  deepObserveFields(fields) {
    fields.forEach((field, key) => {
      observe(fields.get(key), '$value', () => {
        if (this.state.options.get('validateOnChange') === false) return;
        this.state.form.validate({ key, field, showErrors: true, related: true });
      });
      // recursive observe and validate each field
      if (field.fields.size) this.deepObserveFields(field.fields);
    });
  },

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
    const $fields = parser.prepareFieldsData({ fields });
    return this.deepUpdate($fields);
  },

  @action
  deepUpdate(fields, path = '', recursion = true) {
    _.each(fields, (field, key) => {
      const $fullPath = _.trimStart(`${path}.${key}`, '.');
      const $field = this.select($fullPath, null, false);
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
        // init field into the container field
        $container.initField(key, $fullPath, field, null, true);
      }

      if (recursion) {
        // handle nested fields if undefined or null
        const $fields = this.pathToFieldsTree($fullPath);
        this.deepUpdate($fields, $fullPath, false);
      }

      if (recursion && _.has(field, 'fields') && !_.isNil(field.fields)) {
        // handle nested fields if defined
        this.deepUpdate(field.fields, $fullPath);
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

  deepMap(prop, fields) {
    return _.reduce(fields.values(), (obj, field) => {
      if (field.fields.size === 0) {
        return Object.assign(obj, {
          [field.key]: field[prop],
        });
      }

      const data = this.deepMap(prop, field.fields);

      const value = field.hasIncrementalNestedFields
        ? parser.parseArrayProp(data, prop)
        : data;

      return Object.assign(obj, { [field.key]: value });
    }, {});
  },

  /**
    Get Fields Props
   */
  get(prop = null) {
    if (_.isNil(prop)) {
      const all = _.union(utils.computed, utils.props, utils.vprops);
      return this.deepGet(all, this.fields);
    }

    utils.allowed('all', _.isArray(prop) ? prop : [prop]);

    if (!_.isArray(prop)) {
      const data = this.deepMap(prop, this.fields);
      return this.hasIncrementalNestedFields
        ? parser.parseArrayProp(data, prop)
        : data;
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

      if (_.isArray(prop)) {
        _.each(prop, $prop =>
          Object.assign(obj[field.key], {
            [$prop]: field[$prop],
          }));
      }

      // if (_.isString(prop)) {
      //   Object.assign(obj[field.key], {
      //     [prop]: field[prop],
      //   });
      // }

      return obj;
    }, {});
  },

  /**
   Set Fields Props
   */
  @action
  set($, data = null, recursion = false) {
    const $e = 'update';

    if (!recursion) {
      Events.setRunning($e, true, this.path);
    }

    // UPDATE CUSTOM PROP
    if (_.has(this, 'isField')) {
      if (_.isString($) && !_.isNil(data)) {
        utils.allowed('props', [$]);
        _.set(this, `$${$}`, data);
        if (!recursion) Events.setRunning($e, false);
        return;
      }

      // update just the value
      // this.value = $; // eslint-disable-line
      // if (!recursion) Events.setRunning($e, false);
      // return;
    }

    // UPDATE NESTED FIELDS VALUE (recursive)
    if (_.isObject($) && !data) {
      // $ is the data
      this.deepSet('value', $, '', true);
      if (!recursion) Events.setRunning($e, false);
      return;
    }

    // UPDATE NESTED CUSTOM PROP (recursive)
    if (_.isString($) && _.isObject(data)) {
      utils.allowed('props', [$]);
      // $ is the prop key
      this.deepSet($, data, '', true);
      if (!recursion) Events.setRunning($e, false);
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
      if (!_.isNil(field)) {
        // update field values or others props
        field.set($, $val, recursion);
        // update values recursively only if field has nested
        if (field.fields.size && _.isObject($val)) {
          if (field.fields.size !== 0) {
            this.deepSet($, $val, $key, recursion);
          }
        }
      }
    });
  },

  /**
    Call field method recursively
  */
  deepAction($action, fields, recursion = false) {
    if (!recursion) {
      Events.setRunning($action, true, this.path);
    }

    if (fields.size !== 0) {
      fields.forEach((field) => {
        field[$action]();
        this.deepAction($action, field.fields, true);
      });
    }

    if (!recursion) {
      Events.setRunning($action, false);
    }
  },

  /**
   Add Field
   */
  @action
  add(value = null, opt = {}) {
    let $key;

    if (_.has(opt, 'key')) $key = opt.key;
    else $key = utils.maxKey(this.fields) + 1;

    const tree = this.pathToFieldsTree(this.path);
    const $path = key => _.trimStart([this.path, key].join('.'), '.');

    _.each(tree, field => this.initField($key, $path($key), field));

    this.observeFields(this.fields);

    if (!_.isNil(value)) {
      const field = this.select($key);

      if (_.isObject(value)) {
        field.update(value);
      }

      field.initial = value;
      field.default = value;
      field.value = value;
    }

    return $key;
  },

  /**
   Del Field
   */
  @action
  del(path = null) {
    if (_.isInteger(_.parseInt(path))) {
      this.fields.delete(path);
      return;
    }

    const $path = utils.parsePath(path);
    const keys = _.split($path, '.');
    const last = _.last(keys);
    const cpath = _.trimEnd($path, `.${last}`);

    if (_.has(this, 'isField')) {
      this.state.form.select(cpath, null, true).del(last);
      return;
    }

    this.select(cpath, null, true).del(last);
  },

};
