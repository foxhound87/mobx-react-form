import { useStrict } from 'mobx';
import Form from './form';

/**
  Enables / disables strict mode globally.
  In strict mode, it is not allowed to
  change any state outside of an action
 */
useStrict(true);

export default Form;
