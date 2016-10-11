import { action } from 'mobx';
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
  $: key => $this.select(key),

  /**
    Update Field Values
  */
  update: (data) => {
    const fields = $this.prepareFieldsData({ fields: data });
    $this.deepUpdate(fields);
    $this.set('value', data);
  },

  deepUpdate: (data, path = '') => {
    _.each(data, (field, key) => {
      const $path = _.trimStart(`${path}.${key}`, '.');
      const $field = $this.select($path, null, false);

      if (_.isUndefined($field)) {
        $this.initField(key, path, field);
      }

      if (_.has(field, 'fields')) {
        $this.deepUpdate(field, $path);
      }
    });
  },

  /**
    Fields Values (recursive with Nested Fields)
  */
  values: () => $this.deepMap('value', $this.fields),

  /**
    Fields Errors (recursive with Nested Fields)
  */
  errors: () => $this.deepMap('error', $this.fields),

  /**
    Fields Labels (recursive with Nested Fields)
  */
  labels: () => $this.deepMap('label', $this.fields),

  /**
    Fields Default Values (recursive with Nested Fields)
  */
  defaults: () => $this.deepMap('default', $this.fields),

  /**
    Fields Initial Values (recursive with Nested Fields)
  */
  initials: () => $this.deepMap('initial', $this.fields),

  /**
    Fields Iterator
  */
  map: (key, callback) => {
    const field = $this.$(key);
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

    const $check = $[computed];

    return deep
      ? _[$check]($this.deepCheck($check, computed, $this.fields))
      : $this[computed];
  },

  /**
    Throw Error if undefined Fields
  */
  throwError: (path, fields, msg = null) => {
    if (_.isUndefined(fields)) {
      const $msg = _.isNull(msg) ? 'The selected field is not defined' : msg;
      throw new Error(`${$msg} (${path})`);
    }
  },

  /**
    Fields Selector
  */
  select: (path, fields = null, isStrict = true) => {
    const keys = _.split(path, '.');
    const head = _.head(keys);

    keys.shift();

    let $fields = _.isNull(fields)
      ? $this.fields.get(head)
      : fields.get(head);

    let stop = false;
    _.each(keys, ($key) => {
      if (stop) { return; }
      if (_.isUndefined($fields)) {
        $fields = undefined;
        stop = true;
      } else {
        $fields = $fields.fields.get($key);
      }
    });

    if (isStrict) $this.throwError(path, $fields);

    return $fields;
  },

  /**
    Get Fields Props
  */
  get: (prop = null) => {
    if (_.isNull(prop)) {
      return $this.deepGet(utils.props, $this.fields);
    }

    utils.allowed('props', _.isArray(prop) ? prop : [prop]);

    if (_.isString(prop)) {
      return $this.deepMap(prop, $this.fields);
    }

    if (_.isArray(prop)) {
      return $this.deepGet(prop, $this.fields);
    }

    return null;
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
      if (_.isString($) && !_.isNull(data)) {
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
    Update Recursive Fields
  */
  deepSet: ($, data, path = '', recursion = false) => {
    const err = 'You are updating a not existent field:';
    const isStrict = $this.$options.get('strictUpdate');

    _.each(data, ($val, $key) => {
      const $path = _.trimStart(`${path}.${$key}`, '.');
      // get the field by path joining keys recursively
      const field = $this.select($path, null, isStrict);
      // if no field found when is strict update, throw error
      if (isStrict) $this.throwError($path, field, err);
      // update the field/fields if defined
      if (!_.isUndefined(field)) {
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
    return Object.assign(obj, {
      [field.key]: $this.deepMap(prop, field.fields),
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
      check.push(_[$]($this.deepCheck($, prop, field.fields), Boolean));
      return check;
    }, []),
});
