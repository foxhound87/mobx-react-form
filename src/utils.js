import _ from 'lodash';

const computed = ['hasError', 'isValid', 'isDirty', 'isPristine', 'isDefault', 'isEmpty'];
const props = ['value', 'error', 'label', 'disable', 'default', 'related'];

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

export default { computed, props, has, allowed, isPromise };
