import _ from 'lodash';
import utils from './utils';

const defaultClearValue = ({ value }) => {
  if (_.isArray(value)) return [];
  if (_.isDate(value)) return null;
  if (_.isBoolean(value)) return false;
  if (_.isNumber(value)) return 0;
  if (_.isString(value)) return '';
  return undefined;
};

const defaultValue = ({ type, isEmptyArray = false }) => {
  if (type === 'date') return null;
  if (type === 'checkbox') return false;
  if (type === 'number') return 0;
  return isEmptyArray ? [] : '';
};

const parsePath = (path) => {
  let $path = path;
  $path = _.replace($path, new RegExp('\\[', 'g'), '.');
  $path = _.replace($path, new RegExp('\\]', 'g'), '');
  return $path;
};

const parseFieldValue = (parser, { type, isEmptyArray, separated, unified, initial }) =>
  parser(utils.$try(separated, unified, initial, defaultValue({ type, isEmptyArray })));

// make integers labels empty
const parseGetLabel = label =>
  _.isInteger(_.parseInt(label)) ? '' : label;

const parseArrayProp = ($val, $prop) => {
  const $values = _.values($val);
  if ($prop === 'value' || $prop === 'initial' || $prop === 'default') {
    return _.without($values, null, undefined, '');
  }
  return $values;
};

const parseCheckArray = (field, value, prop) =>
  field.hasIncrementalNestedFields
    ? parseArrayProp(value, prop)
    : value;

const parseCheckFormatter = ($field, $prop) =>
  ($prop === 'value')
    ? $field.$formatter($field[$prop])
    : $field[$prop];

const defineFieldsFromStruct = (struct, add = false) =>
  _.reduceRight(struct, ($, name) => {
    const obj = {};
    if (_.endsWith(name, '[]')) {
      const val = (add) ? [$] : [];
      obj[_.trimEnd(name, '[]')] = val;
      return obj;
    }
    // no brakets
    const prev = struct[struct.indexOf(name) - 1];
    const stop = _.endsWith(prev, '[]') && (_.last(struct) === name);
    if (!add && stop) return obj;
    obj[name] = $;
    return obj;
  }, {});

const handleFieldsValuesFallback = (fields, initial) => {
  if (!_.has(initial, 'values')) return fields;
  // if the 'fields' object is not provided into the constructor
  // and the 'values' object is passed, use it to create fields
  return _.merge(fields, initial.values);
};

const handleFieldsArrayOfStrings = ($fields, add = false) => {
  let fields = $fields;
  // handle array with field struct (strings)
  if (utils.isStruct({ fields })) {
    fields = _.reduce(fields, ($obj, $) => {
      const pathStruct = _.split($, '.');
      // as array of strings (with empty values)
      if (!pathStruct.length) return Object.assign($obj, { [$]: '' });
      // define flat or nested fields from pathStruct
      return _.merge($obj, defineFieldsFromStruct(pathStruct, add));
    }, {});
  }
  return fields;
};

const handleFieldsArrayOfObjects = ($fields) => {
  let fields = $fields;
  // handle array of objects (with unified props)
  if (_.isArray(fields) && _.every(fields, _.isPlainObject)) {
    fields = _.reduce(fields, ($obj, $) => {
      if (!_.has($, 'name')) return undefined;
      return Object.assign($obj, { [$.name]: $ });
    }, {});
  }
  return fields;
};

const handleFieldsNested = (fields, initial, strictProps) =>
  _.reduce(fields, (obj, field, key) => {
    if (utils.allowNested(field, strictProps)) {
      // define nested field
      return Object.assign(obj, {
        [key]: { fields: utils.isEmptyArray(field) ? [] : handleFieldsNested(field) },
      });
    }
    return Object.assign(obj, { [key]: field });
  }, {});


const mergeSchemaDefaults = (fields, validator) => {
  if (validator) {
    const properties = validator.schema.properties;
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
};

const prepareFieldsData = (initial, strictProps = true) => {
  let fields = initial.fields || {};
  fields = handleFieldsArrayOfStrings(fields, false);
  fields = handleFieldsArrayOfObjects(fields);
  fields = handleFieldsValuesFallback(fields, initial);
  fields = handleFieldsNested(fields, initial, strictProps);
  return fields;
};

const pathToFieldsTree = (struct, path, n = 0, add = false) => {
  const structPath = utils.pathToStruct(path);
  const structArray = _.filter(struct, item => _.startsWith(item, structPath));
  const $tree = handleFieldsArrayOfStrings(structArray, add);
  const $struct = _.replace(structPath, new RegExp('\\[]', 'g'), `[${n}]`);
  return handleFieldsNested(_.get($tree, $struct));
};

export default {
  defaultValue,
  defaultClearValue,
  parseFieldValue,
  parsePath,
  parseGetLabel,
  parseArrayProp,
  parseCheckArray,
  parseCheckFormatter,
  mergeSchemaDefaults,
  handleFieldsNested,
  handleFieldsArrayOfStrings,
  prepareFieldsData,
  pathToFieldsTree,
};
