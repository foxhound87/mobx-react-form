import _ from 'lodash';

const props = {
  booleans: ['hasError', 'isValid', 'isDirty', 'isPristine', 'isDefault', 'isEmpty', 'focused', 'touched', 'changed', 'disabled'],
  field: ['value', 'initial', 'default', 'label', 'placeholder', 'disabled', 'related', 'options', 'bindings', 'type', 'error'],
  separated: ['values', 'initials', 'defaults', 'labels', 'placeholders', 'disabled', 'related', 'options', 'bindings', 'types'],
  function: ['observers', 'interceptors', 'parse', 'format'],
  hooks: ['onSubmit', 'onReset', 'onClear'],
  validation: ['rules', 'validators'],
  types: {
    isDirty: 'some',
    isValid: 'every',
    isPristine: 'every',
    isDefault: 'every',
    isEmpty: 'every',
    hasError: 'some',
    focused: 'some',
    touched: 'some',
    changed: 'some',
    disabled: 'every',
  },
};

const checkObserveItem = change => ({ key, to, type, exec }) =>
  (change.type === type && change.name === key && change.newValue === to)
    && exec.apply(change, [change]);

const checkObserve = collection => change =>
  collection.map(checkObserveItem(change));

const checkPropType = ({ type, data }) => {
  let $check;
  switch (type) {
    case 'some': $check = $data => _.some($data, Boolean); break;
    case 'every': $check = $data => _.every($data, Boolean); break;
    default: $check = null;
  }
  return $check(data);
};

const hasProps = ($type, $data) => {
  let $;
  switch ($type) {
    case 'booleans': $ = props.booleans; break;
    case 'field': $ = [
      ...props.field,
      ...props.validation,
    ]; break;
    case 'all': $ = ['id',
      ...props.booleans,
      ...props.field,
      ...props.validation,
    ]; break;
    default: $ = null;
  }
  return _.intersection($data, $).length > 0;
};

/**
  Check Allowed Properties
*/
const allowedProps = (type, data) => {
  if (hasProps(type, data)) return;
  const $msg = 'The selected property is not allowed';
  throw new Error(`${$msg} (${JSON.stringify(data)})`);
};

/**
  Throw Error if undefined Fields
*/
const throwError = (path, fields, msg = null) => {
  if (!_.isNil(fields)) return;
  const $msg = _.isNil(msg) ? 'The selected field is not defined' : msg;
  throw new Error(`${$msg} (${path})`);
};

const isPromise = obj => (!!obj && typeof obj.then === 'function'
  && (typeof obj === 'object' || typeof obj === 'function'));

const isEvent = (obj) => {
  if (_.isNil(obj) || typeof Event === 'undefined') return false;
  return (obj instanceof Event || !_.isNil(obj.target)); // eslint-disable-line
};

const pathToStruct = (path) => {
  let struct;
  struct = _.replace(path, new RegExp('[.]\\d($|.)', 'g'), '[].');
  struct = _.replace(struct, '..', '.');
  struct = _.trimEnd(struct, '.');
  return struct;
};

const hasSome = (obj, keys) =>
  _.some(keys, _.partial(_.has, obj));

const isStruct = ({ fields }) => (
  _.isArray(fields) &&
  _.every(fields, _.isString)
);

const isEmptyArray = field =>
  (_.isEmpty(field) && _.isArray(field));

const $getKeys = fields =>
_.union(_.map(_.values(fields), values => _.keys(values))[0]);

const $checkKeys = keys =>
  hasProps('field', keys) ||
  hasProps('validation', keys) ||
  hasProps('function', keys);

const hasUnifiedProps = ({ fields }) =>
  !isStruct({ fields }) && $checkKeys($getKeys(fields));

const hasSeparatedProps = initial => (
  hasSome(initial, props.separated) ||
  hasSome(initial, props.validation)
);

const allowNested = (field, strictProps) =>
  _.isObject(field) && !_.isDate(field) && !_.has(field, 'fields')
    && (!hasSome(field, props.field) || strictProps);

const parseIntKeys = fields =>
 _.map(fields.keys(), _.ary(parseInt, 1));

const hasIntKeys = fields =>
  _.every(parseIntKeys(fields), _.isInteger);

const maxKey = (fields) => {
  const max = _.max(parseIntKeys(fields));
  return _.isUndefined(max) ? 0 : max + 1;
};

const makeId = path =>
  _.uniqueId([_.replace(path, new RegExp('\\.', 'g'), '-'), '--'].join(''));

const $try = (...args) => {
  let found = null;

  args.map(val =>
    ((found === null) && !_.isNil(val))
      && (found = val));

  return found;
};

export default {
  props,
  checkObserve,
  checkPropType,
  hasProps,
  allowedProps,
  throwError,
  isPromise,
  isEvent,
  isStruct,
  isEmptyArray,
  pathToStruct,
  hasUnifiedProps,
  hasSeparatedProps,
  allowNested,
  parseIntKeys,
  hasIntKeys,
  maxKey,
  makeId,
  $try,
};
