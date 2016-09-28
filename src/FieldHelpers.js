import { action } from 'mobx';
import _ from 'lodash';

/**
  Field Helpers
*/
export default $this => ({

  /**
    Fields Selector (alias of select)
  */
  $: key => $this.select(key),

  /**
    Fields Selector (alias of select)
  */
  get: key => $this.select(key),

  /**
    Fields Props Setter
  */
  set: (key, data) => $this.update(key, data),


  /**
    Fields Values (recursive with Nested Fields)
  */
  values: () => $this.deepMap('value', $this.fields),

  /**
    Fields Errors (recursive with Nested Fields)
  */
  errors: () => $this.deepMap('error', $this.fields),

  /**
    Fields Iterator
  */
  map: (key, callback) => {
    const field = $this.$(key);
    return field.fields.values().map(callback);
  },

  /**
    Check Fields
  */
  check: (key, fields, msg = null) => {
    if (_.isUndefined(fields)) {
      const $msg = _.isNull(msg) ? 'The selected field is not defined' : msg;
      throw new Error(`${$msg} (${key})`);
    }
  },

  /**
    Fields Selector
  */
  select: (key, fields = null, isStrict = true) => {
    const keys = _.split(key, '.');
    const head = _.head(keys);

    keys.shift();

    let $fields = _.isNull(fields)
      ? $this.fields.get(head)
      : fields.get(head);


    _.each(keys, ($key) => {
      $fields = $fields.fields.get($key);
    });

    if (isStrict) $this.check(key, $fields);

    return $fields;
  },

  /**
    Update Values or Props
  */
  update: action(($, data = null) => {
    const $e = 'update';
    $this.$events.push($e);

    // UPDATE CUSTOM PROP
    if ($this.constructor.name === 'Field') {
      if (_.isString($) && !_.isNull(data)) {
        _.set($this, `$${$}`, data);
        return;
      }

      // update just the value
      $this.value = $; // eslint-disable-line
      return;
    }

    // UPDATE NESTED FIELDS VALUE (recursive)
    if (_.isObject($) && !data) {
      // $ is the data
      $this.updateRecursive('value', $);
      return;
    }

    // UPDATE NESTED CUSTOM PROP (recursive)
    if (_.isString($) && _.isObject(data)) {
      // $ is the prop key
      $this.updateRecursive($, data);
      return;
    }

    $this.$events.pop($e);
  }),

  /**
    Update Recursive Fields
  */
  updateRecursive: ($, data, path = '') => {
    const err = 'You are updating a not existent field:';
    const isStrict = $this.$options.strictUpdate;

    _.each(data, ($val, $key) => {
      const $path = _.trimStart(`${path}.${$key}`, '.');
      // get the field by path joining keys recursively
      const field = $this.select($path, null, isStrict);
      // if no field found when is strict update, throw error
      if (isStrict) $this.check($path, field, err);
      // update the field/fields if defined
      if (!_.isUndefined(field)) {
        // update field values or others props
        if ($ === 'value') field.update($val);
        if ($ !== 'value') field.update($, $val);
        // update values recursively only if field has nested
        if (field.fields.size && _.isObject($val)) {
          if (field.fields.size !== 0) {
            $this.updateRecursive($, $val, $key);
          }
        }
      }
    });
  },

  deepMap: (prop, fields) =>
  _.reduce(fields.values(), (obj, field) => {
    if (field.fields.size === 0) {
      return Object.assign(obj, { [field.key]: field[prop] });
    }
    return Object.assign(obj, {
      [field.key]: $this.deepMap(prop, field.fields),
    });
  }, {}),

  deepAction: ($action, fields) => {
    $this.$events.push($action);
    if (fields.size !== 0) {
      fields.forEach((field) => {
        field[$action]();
        $this.deepAction($action, field.fields);
      });
    }
    $this.$events.pop($action);
  },

});
