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
    Fields Iterator
  */
  map: (key, callback) => {
    const field = $this.$(key);
    return field.fields.values().map(callback);
  },

  /**
    Check Fields
  */
  check: (key, fields) => {
    if (_.isUndefined(fields)) {
      const msg = 'The selected field is not defined';
      throw new Error(`${msg} (${key})`);
    }
  },

});
