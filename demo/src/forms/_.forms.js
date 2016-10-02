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

  onInit($form) {
    // console.log('ON INIT');

    // $form.on('reset', ({ form, path }) => console.log('reset', path, form));
    // $form.on('clear', ({ form, path }) => console.log('clear', path, form));
    // $form.on('clear@club', ({ form, path }) => console.log('clear@club', path, form));
    // $form.on('update', ({ form, path }) => console.log('update', path, form));
    // $form.on('update@club', ({ form, path }) => console.log('update@club', path, form));

    // console.log('GET', $form.$('address').get());

    // $form.$('address.street').set('');
    // console.log('street isValid', $form.$('address.street').isValid);
    // console.log('isEmpty', $form.$('address.street').check('isEmpty'));

    // $form.options({
    //   strictUpdate: true,
    // });

    // $form.set({
    //   sthElse: '...',
    //   username: 'aaaaaa',
    // });

    // $form.set('label', {
    //   sthElse: '...',
    //   username: 'NEW LABEL',
    // });

    $form.$('club').set('test');
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
