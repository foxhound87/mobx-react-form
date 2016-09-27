import _ from 'lodash';

/**
  Field Helpers
*/
export default $this => ({

  /**
    Fields Selector
  */
  select: (key, fields = null) => {
    const keys = _.split(key, '.');
    const head = _.head(keys);
    keys.shift();

    let $fields = _.isNull(fields)
      ? $this.fields.get(head)
      : fields.get(head);

    _.each(keys, ($key) => {
      $fields = $fields.fields.get($key);
    });

    return $fields;
  },
});
