import { useStrict } from 'mobx';

import Form, { prototypes as formPrototypes } from './Form';
import Field, { prototypes as fieldPrototypes } from './Field';

/* shared prototype methods */
import fieldInitializer from './shared/Initializer';
import fieldHelpers from './shared/Helpers';
import fieldActions from './shared/Actions';
import fieldUtils from './shared/Utils';
import fieldEvents from './shared/Events';

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
const extend = ($class, $obj) => ($obj)
  .forEach(mixin => Object.getOwnPropertyNames(mixin)
    .forEach(name => $class.prototype[name] = mixin[name])); // eslint-disable-line

const shared = [
  fieldInitializer,
  fieldActions,
  fieldHelpers,
  fieldUtils,
  fieldEvents,
];

extend(Form, shared.concat(formPrototypes));
extend(Field, shared.concat(fieldPrototypes));

export default Form;
export { Form, Field };
