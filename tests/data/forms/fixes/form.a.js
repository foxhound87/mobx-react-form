import MobxReactForm from '../../../../src';

const fields = ['qwerty'];

const values = { qwerty: 0 };

class Form extends MobxReactForm {

  onInit(form) {
    form.options({
      loadingMessage: 'Custom Loading Message...',
    });
  }
}

export default new Form({ fields, values }, 'Fixes-A');
