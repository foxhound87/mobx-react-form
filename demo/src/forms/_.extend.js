// import MobxReactForm from 'mobx-react-form'; // load from package
// import MobxReactForm from '../../../lib'; // load from build
import MobxReactForm from '../../../src'; // load from source

export default class Form extends MobxReactForm {

  onSuccess(form) {
    alert('Form is valid! Send the request here.'); // eslint-disable-line
    // get field values
    console.log('Form Values!', form.values()); // eslint-disable-line
  }

  onError(form) {
    // get all form errors
    console.log('All form errors', form.errors());  // eslint-disable-line
    // invalidate the form with a custom error message
    form.invalidate('This is a generic error message!');
  }
}
