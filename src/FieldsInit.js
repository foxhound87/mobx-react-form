import { action } from 'mobx';
import _ from 'lodash';
import Field from './Field';
import InitialState from './InitialState';

/**
  Fields Initializer
*/
export default $this => ({

  initField: action('init-Field', (key, path, data) => {
    const initial = InitialState.get();
    // try to get props from separated objects
    const $try = prop => _.has(initial[prop], path) && initial[prop][path];

    $this.fields.merge({
      [key]: new Field(key, path, data, {
        $label: $try('labels'),
        $value: $try('values'),
        $default: $try('defaults'),
        $disabled: $try('disabled'),
        $related: $try('related'),
        $validate: $try('validate'),
        $rules: $try('rules'),
      }, {
        options: $this.$options,
        events: $this.$events,
      }),
    });
  }),

  initFields: action('init-Fields', (initial = {}) => {
    let fields = initial.fields || {};

    fields = $this.handleFieldsArray(fields);
    fields = $this.handleFieldsEmpty(fields, initial);
    fields = $this.mergeSchemaDefaults(fields);

    const $path = key => _.trimStart([$this.path, key].join('.'), '.');

    // create fields
    _.each(fields, (field, key) =>
      $this.initField(key, $path(key), field));
  }),

  handleFieldsArray: ($fields) => {
    let fields = $fields;
    if (_.isArray(fields)) {
      fields = _.reduce(fields, ($obj, $) => {
        // as array of objects (with key and props)
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
