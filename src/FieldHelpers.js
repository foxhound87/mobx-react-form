import { action, asMap } from 'mobx';
import _ from 'lodash';
import utils from './utils';
import Events from './Events';

/**
  Field Helpers
*/
export default $this => ({

  /**
    Fields Selector (alias of select)
  */
  $: key => $this.select(key, null, false) || [],

  /**
    Fields Values (recursive with Nested Fields)
  */
  values: () => $this.get('value'),

  /**
    Fields Errors (recursive with Nested Fields)
  */
  errors: () => $this.get('error'),

  /**
    Fields Labels (recursive with Nested Fields)
  */
  labels: () => $this.get('label'),

  /**
    Fields Default Values (recursive with Nested Fields)
  */
  defaults: () => $this.get('default'),

  /**
    Fields Initial Values (recursive with Nested Fields)
  */
  initials: () => $this.get('initial'),

  /**
    Fields Iterator
  */
  map: (path, callback = null) => {
    if (_.isFunction(path) && !callback) {
      // path is the callback here
      return $this.fields.values().map(path);
    }

    const field = $this.select(path);
    return field.fields.values().map(callback);
  },

  /**
    Check Field Computed Values
  */
  check: (computed, deep = false) => {
    utils.allowed('computed', [computed]);

    const $ = {
      hasError: 'some',
      isValid: 'every',
      isDirty: 'some',
      isPristine: 'every',
      isDefault: 'every',
      isEmpty: 'every',
    };

    return deep
      ? utils.check({
        type: $[computed],
        data: $this.deepCheck($[computed], computed, $this.fields),
      }) : $this[computed];
  },

  /**
    Fields Selector
  */
  select: (path, fields = null, isStrict = true) => {
    let $path = path;

    $path = _.replace($path, new RegExp('\\[', 'g'), '.');
    $path = _.replace($path, new RegExp('\\]', 'g'), '');

    const keys = _.split($path, '.');
    const head = _.head(keys);

    keys.shift();

    let $fields = _.isNil(fields)
      ? $this.fields.get(head)
      : fields.get(head);

    let stop = false;
    _.each(keys, ($key) => {
      if (stop) { return; }
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
    Init Form Fields and Nested Fields
  */
  init: action((fields) => {
    _.set($this, 'fields', asMap({}));
    $this.initFields({ fields });
  }),

  /**
    Update Field Values recurisvely
    OR Create Field if 'undefined'
  */
  update: (fields) => {
    const $fields = $this.prepareFieldsData({ fields });
    return $this.deepUpdate($fields);
  },

  deepUpdate: (fields, path = '') => {
    _.each(fields, (field, key) => {
      const $fullPath = _.trimStart(`${path}.${key}`, '.');
      const $field = $this.select($fullPath, null, false);
      const $values = field ? field.fields : null;

      if (!_.isNil($field) && !_.isNil(field)) {
        if (_.isNil($values)) $field.set('value', field);
        else $this.deepUpdate($values, $fullPath);
      } else {
        // create fields
        const cpath = _.trimEnd(path.replace(new RegExp('/[^./]+$/'), ''), '.');
        const container = $this.select(cpath, null, false);
        if (!_.isNil(container)) {
          // init filed into the container field
          container.initField(key, $fullPath, field, null, true);
          // handle nested fields if defined
          if (_.has(field, 'fields')) $this.deepUpdate($values, $fullPath);
          // handle nested fields if undefined or null
          else if (_.isNil(field)) {
            const $fields = $this.pathToFiledsTree($fullPath);
            $this.deepUpdate($fields, $fullPath);
          }
        }
      }
    });
  },

  pathToFiledsTree: (path) => {
    const $ss = $this.state.struct();
    const structPath = utils.pathToStruct(path);
    const structArray = _.filter($ss, item => _.startsWith(item, structPath));
    const tree = $this.handleFieldsArrayOfStrings(structArray);
    const struct = _.replace(structPath, new RegExp('\\[]', 'g'), '[0]');
    return $this.handleFieldsNested(_.get(tree, struct));
  },

  /**
    Get Fields Props
  */
  get: (prop = null) => {
    if (_.isNil(prop)) {
      const all = _.union(utils.computed, utils.props, utils.vprops);
      return $this.deepGet(all, $this.fields);
    }

    utils.allowed('all', _.isArray(prop) ? prop : [prop]);

    if (!_.isArray(prop)) {
      const data = $this.deepMap(prop, $this.fields);
      return $this.incremental ? _.values(data) : data;
    }

    return $this.deepGet(prop, $this.fields);
  },

  /**
    Set Fields Props
  */
  set: action(($, data = null, recursion = false) => {
    const $e = 'update';

    if (!recursion) {
      Events.setRunning($e, true, $this.path);
    }

    // UPDATE CUSTOM PROP
    if ($this.constructor.name === 'Field') {
      if (_.isString($) && !_.isNil(data)) {
        utils.allowed('props', [$]);
        _.set($this, `$${$}`, data);
        if (!recursion) Events.setRunning($e, false);
        return;
      }

      // update just the value
      // $this.value = $; // eslint-disable-line
      // if (!recursion) Events.setRunning($e, false);
      // return;
    }

    // UPDATE NESTED FIELDS VALUE (recursive)
    if (_.isObject($) && !data) {
      // $ is the data
      $this.deepSet('value', $, '', true);
      if (!recursion) Events.setRunning($e, false);
      return;
    }

    // UPDATE NESTED CUSTOM PROP (recursive)
    if (_.isString($) && _.isObject(data)) {
      utils.allowed('props', [$]);
      // $ is the prop key
      $this.deepSet($, data, '', true);
      if (!recursion) Events.setRunning($e, false);
      return;
    }
  }),

  /**
    Set Fields Props Recursively
  */
  deepSet: ($, data, path = '', recursion = false) => {
    const err = 'You are updating a not existent field:';
    const isStrict = $this.$options.get('strictUpdate');

    _.each(data, ($val, $key) => {
      const $path = _.trimStart(`${path}.${$key}`, '.');
      // get the field by path joining keys recursively
      const field = $this.select($path, null, isStrict);
      // if no field found when is strict update, throw error
      if (isStrict) utils.throwError($path, field, err);
      // update the field/fields if defined
      if (!_.isNil(field)) {
        // update field values or others props
        field.set($, $val, recursion);
        // update values recursively only if field has nested
        if (field.fields.size && _.isObject($val)) {
          if (field.fields.size !== 0) {
            $this.deepSet($, $val, $key, recursion);
          }
        }
      }
    });
  },

  /**
    Get Fields Props Recursively
  */
  deepGet: (prop, fields) =>
  _.reduce(fields.values(), (obj, field) => {
    const $nested = $fields => ($fields.size !== 0)
      ? $this.deepGet(prop, $fields)
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
  }, {}),

  deepMap: (prop, fields) =>
  _.reduce(fields.values(), (obj, field) => {
    if (field.fields.size === 0) {
      return Object.assign(obj, {
        [field.key]: field[prop],
      });
    }

    const data = $this.deepMap(prop, field.fields);

    return Object.assign(obj, {
      [field.key]: field.incremental ? _.values(data) : data,
    });
  }, {}),

  deepAction: ($action, fields, recursion = false) => {
    if (!recursion) {
      Events.setRunning($action, true, $this.path);
    }

    if (fields.size !== 0) {
      fields.forEach((field) => {
        field[$action]();
        $this.deepAction($action, field.fields, true);
      });
    }

    if (!recursion) {
      Events.setRunning($action, false);
    }
  },

  deepCheck: ($, prop, fields) =>
    _.reduce(fields.values(), (check, field) => {
      if (field.fields.size === 0) {
        check.push(field[prop]);
        return check;
      }
      const $deep = $this.deepCheck($, prop, field.fields);
      check.push(utils.check({ type: $, data: $deep }));
      return check;
    }, []),
});
