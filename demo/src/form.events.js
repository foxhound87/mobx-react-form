import form from './form';

/**
  On Submit
 */
const handleOnSubmit = (e) => {
  e.preventDefault();

  // check if the form is valid, otherwise exit
  if (!form.validate()) return;

  alert('Form is valid! Send the requrest here.'); // eslint-disable-line

  // get fields values
  console.log('Form Values', form.values()); // eslint-disable-line

  // or show a custom generic error after a beckend call
  form.invalidate('The user already exist.');
};

/**
  On Clear
 */
const handleOnClear = (e) => {
  e.preventDefault();

  // clear the form
  form.clear();
};

/**
  On Reset
 */
const handleOnReset = (e) => {
  e.preventDefault();

  // reset to the default initial values
  form.reset();
};

export default {
  handleOnReset,
  handleOnClear,
  handleOnSubmit,
};
