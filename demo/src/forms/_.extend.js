import MobxReactForm from 'mobx-react-form'; // eslint-disable-line
// import MobxReactForm from '../../../lib'; // load from build
// import MobxReactForm from '../../../src'; // load from source

export default class Form extends MobxReactForm {

  // onInit(form) {
  //   console.log('ON INIT');

  //   form.options({
  //     strictUpdate: true,
  //   });

  //   form.update({
  //     sthElse: '...',
  //     username: 'aaaaaa',
  //   });
  // }

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
