import { useStrict } from 'mobx';

import Form from './Form';
import Field from './Field';

import fieldInitializer from './shared/Initializer';
import fieldHelpers from './shared/Helpers';
import fieldActions from './shared/Actions';
import fieldUtils from './shared/Utils';

const { TEST } = process.env;

/**
  Enables MobX strict mode globally (TEST only).
  - - - - - - - - - - - - - - - - - -
  In strict mode, it is not allowed to
  change any state outside of an action
*/
if (TEST) useStrict(true);

/**
  Extend Classes with Prototype
  - - - - - - - - - - - - - - - - - -
  Cannot use Object.assign as @action
  methods on mixins are non-enumerable
*/
const extend = $class => ([
  fieldInitializer,
  fieldActions,
  fieldHelpers,
  fieldUtils,
])
  .forEach(mixin => Object.getOwnPropertyNames(mixin)
    .forEach(name => $class.prototype[name] = mixin[name])); // eslint-disable-line

extend(Form);
extend(Field);

export default Form;
export { Form, Field };
