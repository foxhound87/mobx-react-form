import _ from 'lodash';

const computed = ['hasError', 'isValid', 'isDirty', 'isPristine', 'isDefault', 'isEmpty', 'focus', 'touched', 'changed', 'disabled'];
const props = ['value', 'initial', 'default', 'label', 'placeholder', 'disabled', 'related', 'options', 'bindings', 'type', 'error'];
const iprops = ['values', 'initials', 'defaults', 'labels', 'placeholders', 'disabled', 'related', 'options', 'bindings', 'types'];
const vprops = ['rules', 'validate'];
const fprops = ['observer'];

const checkObserveItem = change => ({ key, to, type, exec }) =>
  (change.type === type && change.name === key && change.newValue === to)
    && exec.apply(change, [change]);

const checkObserve = collection => change =>
  collection.map(checkObserveItem(change));

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
    case 'all': $ = [...computed, ...props, ...vprops]; break;
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

const isEvent = (obj) => {
  if (typeof Event === 'undefined') return false;
  return (obj instanceof Event || !_.isNil(obj.target)); // eslint-disable-line
};

const isStruct = data =>
  (_.isArray(data) && _.every(data, _.isString));

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
  return _.isUndefined(max) ? 0 : max + 1;
};

const makeId = path =>
  _.uniqueId([_.replace(path, new RegExp('\\.', 'g'), '-'), '--'].join(''));

export default {
  checkObserve,
  computed,
  props,
  iprops,
  vprops,
  fprops,
  check,
  has,
  allowed,
  throwError,
  isPromise,
  isEvent,
  isStruct,
  pathToStruct,
  hasUnifiedProps,
  hasSeparatedProps,
  parseIntKeys,
  hasIntKeys,
  maxKey,
  makeId,
};
