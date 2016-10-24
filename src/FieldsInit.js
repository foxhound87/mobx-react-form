import { action } from 'mobx';
import _ from 'lodash';
import utils from './utils';
import Field from './Field';

/**
  Fields Initializer
*/
export default $this => ({

  initField: action('init-Field', (key, path, data, fields = null, update = false) => {
    const $fields = fields || $this.fields;
    const initial = $this.state.get('current', 'props');

    // try to get props from separated objects
    const $try = prop => _.get(initial[prop], utils.pathToStruct(path));

    const props = {
      $value: $try('values'),
      $label: $try('labels'),
      $default: $try('defaults'),
      $disabled: $try('disabled'),
      $related: $try('related'),
      $validate: $try('validate'),
      $rules: $try('rules'),
    };

    $fields.merge({
      [key]: new Field(key, path, data, $this.state, props, update),
    });
  }),

  initFields: action('init-Fields', (initial, update) => {
    const $path = key => _.trimStart([$this.path, key].join('.'), '.');
    const fields = $this.prepareFieldsData(initial);

    // create fields
    _.each(fields, (field, key) =>
      _.isUndefined($this.select($path(key), null, false))
      && $this.initField(key, $path(key), field, null, update));
  }),

  prepareFieldsData: (initial) => {
    let fields = initial.fields || {};
    fields = $this.handleFieldsArrayOfStrings(fields);
    fields = $this.handleFieldsArrayOfObjects(fields);
    fields = $this.handleFieldsEmpty(fields, initial);
    fields = $this.handleFieldsNested(fields, initial);
    fields = $this.mergeSchemaDefaults(fields);
    return fields;
  },

  defineFieldsFromStruct: struct =>
    _.reduceRight(struct, ($, name) => {
      if (_.endsWith(name, '[]')) {
        const obj = {};
        obj[_.trimEnd(name, '[]')] = [$];
        return obj;
      }

      // no brakets
      const obj = {};
      obj[name] = $;
      return obj;
    }, {}),

  handleFieldsEmpty: (fields, initial) => {
    if (!_.has(initial, 'values')) return fields;
    // if the 'field' object is not provided into the constructor
    // and the 'values' object is passed, use it to create fields
    return _.merge(fields, initial.values);
  },

  handleFieldsArrayOfStrings($fields) {
    let fields = $fields;
    // handle array with field struct (strings)
    if (utils.isStruct(fields)) {
      // save the global struct into state
      $this.state.struct(fields);
      fields = _.reduce(fields, ($obj, $) => {
        const pathStruct = _.split($, '.');
        // as array of strings (with empty values)
        if (!pathStruct.length) return Object.assign($obj, { [$]: '' });
        // define flat or nested fields from pathStruct
        return _.merge($obj, $this.defineFieldsFromStruct(pathStruct));
      }, {});
    }
    return fields;
  },

  handleFieldsArrayOfObjects: ($fields) => {
    let fields = $fields;
    // handle array of objects (with unified props)
    if (_.isArray(fields) && _.every(fields, _.isObject)) {
      fields = _.reduce(fields, ($obj, $) => {
        if (!_.has($, 'name')) return undefined;
        return Object.assign($obj, { [$.name]: $ });
      }, {});
    }
    return fields;
  },

  handleFieldsNested: (fields, initial) =>
    _.reduce(fields, (obj, field, key) => {
      if (_.isObject(field) && !_.has(field, 'fields')
        && (!utils.hasUnifiedProps(field) || utils.hasSeparatedProps(initial))) {
        // define nested field
        return Object.assign(obj, {
          [key]: { fields: $this.handleFieldsNested(field) },
        });
      }
      return Object.assign(obj, { [key]: field });
    }, {}),

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
