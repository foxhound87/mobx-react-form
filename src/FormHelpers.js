import _ from 'lodash';

/**
  Form Helpers
*/
export default $this => ({

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
