import _ from 'lodash';

const computed = ['hasError', 'isValid', 'isDirty', 'isPristine', 'isDefault', 'isEmpty'];
const props = ['value', 'error', 'label', 'disable', 'default', 'related'];
const vprops = ['rules', 'validate'];

const pathToStruct = path => _.trimEnd(_.replace(path, new RegExp('[.]\\d($|.)', 'g'), '[].'), '.');

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
    default: $ = null;
  }
  return _.intersection($data, $).length > 0;
};

const allowed = (type, data) => {
  if (!has(type, data)) {
    const $msg = 'The selected property is not allowed';
    throw new Error(`${$msg} (${JSON.stringify(data)})`);
  }
};

const isPromise = obj => (!!obj
  && (typeof obj === 'object' || typeof obj === 'function')
  && typeof obj.then === 'function');


export default {
  computed,
  props,
  vprops,
  check,
  has,
  allowed,
  isPromise,
  pathToStruct,
};
