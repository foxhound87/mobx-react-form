import MobxAjvForm from '../../../src';

export default class Form extends MobxAjvForm {

  /**
    On Submit
   */
  handleOnSubmit = (e) => {
    e.preventDefault();

    // check if the form is valid, otherwise exit
    if (!this.validate()) return;

    alert('Form is valid! Send the requrest here.'); // eslint-disable-line

    // get fields values
    console.log('Form Values', this.values()); // eslint-disable-line

    // or show a custom generic error after a beckend call
    this.invalidate('This is a generic error message!');
  };

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
