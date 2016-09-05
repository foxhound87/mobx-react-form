import MobxAjvForm from '../../../src';

export default class Form extends MobxAjvForm {

  /**
    On Submit
   */
  handleOnSubmit = (e) => {
    e.preventDefault();

    this.validate()
      .then((isValid) => isValid
        ? this.onSuccess()
        : this.onError());
  };

  onError() {
    // get all form errors
    console.log('All form errors', this.errors());  // eslint-disable-line
    // invalidate the form with a custom error message
    this.invalidate('This is a generic error message!');
  }

  onSuccess() {
    alert('Form is valid! Send the request here.'); // eslint-disable-line
    // get field values
    console.log('Form Values!', this.values()); // eslint-disable-line
  }

  /**
    On Clear
   */
  handleOnClear = (e) => {
    e.preventDefault();

    // clear the form
    this.clear();
  };

  /**
    On Reset
   */
  handleOnReset = (e) => {
    e.preventDefault();

    // reset to the default initial values
    this.reset();
  };
}
