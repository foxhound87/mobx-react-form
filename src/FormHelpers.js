import _ from 'lodash';

/**
  Form Helpers
*/
export default $this => ({

  valuesRecursive: fields =>
    _.reduce(fields, (obj, field) => {
      if (!_.isEmpty(field.fields)) {
        return Object.assign(obj, {
          [field.key]: $this.valuesRecursive(field.fields),
        });
      }
      return Object.assign(obj, { [field.key]: field.$value });
    }, {}),

  errorsRecursive: fields =>
    _.reduce(fields, (obj, field) => {
      if (!_.isEmpty(field.fields)) {
        return Object.assign(obj, {
          [field.key]: $this.errorsRecursive(field.fields),
        });
      }
      return Object.assign(obj, {
        [field.key]: field.$error || field.asyncErrorMessage,
      });
    }, {}),

  /* ------------------------------------------------------------------ */

  actionRecursive: (action, fields) => {
    if (fields.size === 0) return;
    fields.forEach((field) => {
      field[action]();
      $this.actionRecursive(action, field.fields);
    });
  },

  updateRecursive: ($, data, path = '') => {
    const isStrict = ($this.$options.strictUpdate === true);
    const err = 'You are updating a not existent field:';

    _.each(data, ($val, $key) => {
      // get the field by path joining keys recursively
      const field = $this.$(_.trimStart(`${path}.${$key}`, '.'));
      // if no field found when is strict update, throw error
      if (_.isUndefined(field) && isStrict) throw new Error(`${err} ${path}`);
      // update field values or others props
      if (!_.isUndefined(field) && $ === 'value') field.update($val);
      if (!_.isUndefined(field) && $ !== 'value') field.set($, $val);
      // update values recursively only if field has nested
      if (_.has(field, 'fields') && _.isObject($val)) {
        if (field.fields.size !== 0) {
          $this.updateRecursive($, $val, $key, isStrict);
        }
      }
    });
  },

  /* ------------------------------------------------------------------ */

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
