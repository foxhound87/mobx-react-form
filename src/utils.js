import _ from 'lodash';
import mixins from './mixins';

const computed = ['error', 'hasError', 'isValid', 'isDirty', 'isPristine', 'isDefault', 'isEmpty'];
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
  if (!has(type, data)) {
    const $msg = 'The selected property is not allowed';
    throw new Error(`${$msg} (${JSON.stringify(data)})`);
  }
};

/**
  Throw Error if undefined Fields
*/
const throwError = (path, fields, msg = null) => {
  if (_.isUndefined(fields)) {
    const $msg = _.isNull(msg) ? 'The selected field is not defined' : msg;
    throw new Error(`${$msg} (${path})`);
  }
};

const isPromise = obj => (!!obj
  && (typeof obj === 'object' || typeof obj === 'function')
  && typeof obj.then === 'function');

const isStruct = data =>
  (_.isArray(data) && _.every(data, _.isString));

const pathToStruct = path =>
  _.trimEnd(_.replace(path, new RegExp('[.]\\d($|.)', 'g'), '[].'), '.');

const hasUnifiedProps = field =>
  (mixins.hasSome(field, props) || mixins.hasSome(field, vprops));

const hasSeparatedProps = initial =>
  (mixins.hasSome(initial, iprops) || mixins.hasSome(initial, vprops));

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
  pathToStruct,
  hasUnifiedProps,
  hasSeparatedProps,
};
