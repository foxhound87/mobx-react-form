import _ from 'lodash';
import Field from './Field';

/**
  Fields Initializer
*/
export default $this => ({

  initFields: (obj = {}) => {
    let fields = obj.fields || {};

    fields = $this.handleFieldsArray(fields);
    fields = $this.handleFieldsEmpty(fields, obj);
    fields = $this.mergeSchemaDefaults(fields);

    // create fields
    _.each(fields, (field, key) => _.extend($this.fields, {
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

  handleFieldsArray: ($fields) => {
    let fields = $fields;
    if (_.isArray(fields)) {
      fields = _.reduce(fields, ($obj, $) => {
        // as array of objects (with key and custom props)
        if (_.isObject($) && _.has($, 'name')) {
          return Object.assign($obj, { [$.name]: $ });
        }
        // as array of strings (with empty values)
        return Object.assign($obj, { [$]: '' });
      }, {});
    }
    return fields;
  },

  handleFieldsEmpty: (fields, obj) => {
    // if the 'field' object is not provided into the constructor
    // and the 'values' object is passed, use it to create fields
    if (_.isEmpty(fields) && _.has(obj, 'values')) {
      _.merge(fields, obj.values);
    }
    return fields;
  },

  mergeSchemaDefaults: (fields) => {
    if ($this.validator) {
      const schema = $this.validator.schema();
      const properties = schema.properties;
      if (_.isEmpty(fields) && !!properties) {
        _.each(properties, (prop, key) => {
          _.set(fields, key, {
            value: prop.default,
            label: prop.title,
          });
        });
      }
    }
    return fields;
  },

});
