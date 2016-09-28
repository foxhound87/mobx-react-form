import _ from 'lodash';

/**
  Form Helpers
*/
export default $this => ({

  actionRecursive: (action, fields) => {
    if (fields.size === 0) return;
    fields.forEach((field) => {
      field[action]();
      $this.actionRecursive(action, field.fields);
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
