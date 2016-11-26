import _ from 'lodash';

const computed = ['error', 'hasError', 'isValid', 'isDirty', 'isPristine', 'isDefault', 'isEmpty', 'focus', 'touched', 'changed'];
const props = ['value', 'label', 'disabled', 'initial', 'default', 'related'];
const iprops = ['values', 'labels', 'disabled', 'initials', 'defaults', 'related'];
const vprops = ['rules', 'validate'];

const check = ({ type, data }) => {
  let $check;
  switch (type) {
    case 'some': $check = $data => _.some($data, Boolean); break;
    case 'every': $check = $data => _.every($data, Boolean); break;
    default: $check = null;
  }
  return $check(data);
};

const has = ($type, $data) => {
  let $;
  switch ($type) {
    case 'props': $ = props; break;
    case 'computed': $ = computed; break;
    case 'all': $ = _.union(computed, props, vprops); break;
    default: $ = null;
  }
  return _.intersection($data, $).length > 0;
};

/**
  Check Allowed Properties
*/
const allowed = (type, data) => {
  if (has(type, data)) return;
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

const isStruct = data =>
  (_.isArray(data) && _.every(data, _.isString));

const parsePath = (path) => {
  let $path = path;
  $path = _.replace($path, new RegExp('\\[', 'g'), '.');
  $path = _.replace($path, new RegExp('\\]', 'g'), '');
  return $path;
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

const hasUnifiedProps = field =>
  (hasSome(field, props) || hasSome(field, vprops));

const hasSeparatedProps = initial =>
  (hasSome(initial, iprops) || hasSome(initial, vprops));

const parseIntKeys = fields =>
 _.map(fields.keys(), _.ary(parseInt, 1));

const hasIntKeys = fields =>
  _.every(parseIntKeys(fields), _.isInteger);

const maxKey = (fields) => {
  const max = _.max(parseIntKeys(fields));
  return _.isUndefined(max) ? 0 : max;
};

export default {
  computed,
  props,
  iprops,
  vprops,
  check,
  has,
  allowed,
  throwError,
  isPromise,
  isStruct,
  parsePath,
  pathToStruct,
  hasUnifiedProps,
  hasSeparatedProps,
  parseIntKeys,
  hasIntKeys,
  maxKey,
};
