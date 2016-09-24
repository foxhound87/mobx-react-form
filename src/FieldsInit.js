import _ from 'lodash';
import Field from './Field';

/**
  Fields Initializer
*/
export default $this => ({

  initFields: (obj = {}) => {
    if (_.isArray(obj.fields)) {
      _.set($this, 'fields', _.reduce(obj.fields, ($obj, $) => {
        // as array of objects (with key and custom props)
        if (_.isObject($) && _.has($, 'name')) {
          return Object.assign($obj, { [$.name]: $ });
        }
        // as array of strings (with empty values)
        return Object.assign($obj, { [$]: '' });
      }, {}));
    }

    // if the 'field' object is not provided into the constructor
    // and the 'values' object is passed, use it to create fields
    if (_.isEmpty(obj.fields) && _.has(obj, 'values')) {
      _.merge($this.fields, obj.values);
    }

    $this.mergeSchemaDefaults($this.fields);

    // create fields
    _.each($this.fields, (field, key) => _.extend($this.fields, {
      [key]: new Field(key, field, {
        $label: _.has(obj.labels, key) && obj.labels[key],
        $value: _.has(obj.values, key) && obj.values[key],
        $default: _.has(obj.defaults, key) && obj.defaults[key],
        $disabled: _.has(obj.disabled, key) && obj.disabled[key],
        $related: _.has(obj.related, key) && obj.related[key],
        $validate: _.has(obj.validate, key) && obj.validate[key],
        $rules: _.has(obj.rules, key) && obj.rules[key],
      }),
    }));
  },

  mergeSchemaDefaults: (fields) => {
    if (!$this.validator) return;
    const schema = $this.validator.schema();
    const properties = schema.properties;
    if (Object.keys(fields).length === 0 && !!properties) {
      Object.keys(properties).forEach((property) => {
        const label = properties[property].title;
        const value = properties[property].default;
        fields[property] = { label, value }; // eslint-disable-line no-param-reassign
      });
    }
  },

});
