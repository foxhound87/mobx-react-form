import { isStrictModeEnabled } from 'mobx';
import Form from './Form';

/**
  Enables MobX strict mode globally.
  In strict mode, it is not allowed to
  change any state outside of an action
 */
isStrictModeEnabled();

export default Form;
