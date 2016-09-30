import ajv from 'ajv';
import validatorjs from 'validatorjs';
import Form from './_.extend';

// forms
import withNestedFields from './withNestedFields';
import registerSimple from './registerSimple';
import registerMaterial from './registerMaterial';
import companySimple from './companySimple';
import companyWidgets from './companyWidgets';

// plugins extensions
import svkExtend from './extensions/_.extend.svk';
import dvrExtend from './extensions/_.extend.dvr';

const plugins = {
  dvr: {
    package: validatorjs,
    extend: dvrExtend,
  },
  svk: {
    package: ajv,
    extend: svkExtend,
  },
};

class FormWithNestedFields extends Form {

  onInit(form) {
  //   console.log('ON INIT');

    form.on('reset', $form => console.log('ON RESET', $form));
    form.on('clear', $form => console.log('ON CLEAR', $form));
    // form.on('update', $form => console.log('ON UPDATE', $form));

    // form.$('address.city').set('aaaa');

    // form.options({
    //   strictUpdate: true,
    // });

    // form.set({
    //   sthElse: '...',
    //   username: 'aaaaaa',
    // });

    // form.set('label', {
    //   sthElse: '...',
    //   username: 'NEW LABEL',
    // });

    // form.$('username').set('label', 'XXXXX');
  }
}

class RegisterMaterialForm extends Form {}
class RegisterSimpleForm extends Form {}
class CompanySimpleForm extends Form {}
class CompanyWidgetsForm extends Form {}

export default {
  withNestedFields: new FormWithNestedFields({
    plugins,
    fields: withNestedFields.fields,
  }),
  registerMaterial: new RegisterMaterialForm({
    plugins,
    fields: registerMaterial.fields,
    schema: registerMaterial.schema,
  }),
  registerSimple: new RegisterSimpleForm({
    plugins,
    fields: registerSimple.fields,
    schema: registerSimple.schema,
  }),
  companySimple: new CompanySimpleForm({
    plugins,
    fields: companySimple.fields,
    schema: companySimple.schema,
    options: { allowRequired: true },
  }),
  companyWidgets: new CompanyWidgetsForm({
    plugins,
    fields: companyWidgets.fields,
    schema: companyWidgets.schema,
  }),
};
