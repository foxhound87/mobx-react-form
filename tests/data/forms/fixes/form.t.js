import { expect } from 'chai';
import { Form } from '../../../../src';
import formN from './form.n';

// FIXES #436 #417 #450

const fields = [
  'arrayChangeAdd[]',
  'arrayChangeDel[]',
  'arrayChangeEqual[]',
  'emptyArray[]',
  'flatStill',
  'flatChange',
  'obj.still',
  'obj.deep.change',
  'array[].id',
  'array[].name',
];

const values = {
  'arrayChangeAdd': ['a'],
  'arrayChangeDel': ['a', 'b'],
  'arrayChangeEqual': ['a', 'b'],
  'emptyArray': [],
  'flatStill': 'flat',
  'flatChange': 'flat',
  'obj.still': 'deep',
  'obj.deep.change': 'deep',
  'array': [{
    id: 1,
    name: 'joe',
  }, {
    id: 2,
    name: 'sam',
  }],
};

const initials = {
  'arrayChangeEqual': ['a', 'b'],
  'obj.deep.change': 'deep',
};

class NewForm extends Form {

  hooks() {
    return {
      onInit(form) {

        describe('Check initial prop state:', () => {
          it('`flatStill` value should be equal `flat`',    () => expect(form.$('flatStill').value).to.be.equal('flat'));
          it('`flatStill` initial should be equal `flat`',  () => expect(form.$('flatStill').initial).to.be.equal('flat'));
          it('`flatStill` isDirty should be false',         () => expect(form.$('flatStill').isDirty).to.be.false);
          it('`flatStill` isPristine should be true',       () => expect(form.$('flatStill').isPristine).to.be.true);
        });

        describe('Check prop state after change:', () => {
          form.$('flatChange').set('flat-changed'); // change state
          it('`flatChange` value should be equal `flat`',   () => expect(form.$('flatChange').value).to.be.equal('flat-changed'));
          it('`flatChange` initial should be equal `flat`', () => expect(form.$('flatChange').initial).to.be.equal('flat'));
          it('`flatChange` isDirty should be false',        () => expect(form.$('flatChange').isDirty).to.be.true);
          it('`flatChange` isPristine should be true',      () => expect(form.$('flatChange').isPristine).to.be.false);
        });

        describe('Check initial props state:', () => {
          it('`obj.still` value should be equal `deep`',    () => expect(form.$('obj.still').value).to.be.equal('deep'));
          it('`obj.still` initial should be equal `deep`',  () => expect(form.$('obj.still').initial).to.be.equal('deep'));
          it('`obj.still` isDirty should be false',         () => expect(form.$('obj.still').isDirty).to.be.false);
          it('`obj.still` isPristine should be true',       () => expect(form.$('obj.still').isPristine).to.be.true);
        });

        describe('Check props state after change:', () => {
          form.$('obj.deep.change').set('deep-changed'); // change state
          it('`obj.deep.change` value should be equal `flat`',    () => expect(form.$('obj.deep.change').value).to.be.equal('deep-changed'));
          it('`obj.deep.change` initial should be equal `flat`',  () => expect(form.$('obj.deep.change').initial).to.be.equal('deep'));
          it('`obj.deep.change` isDirty should be true',          () => expect(form.$('obj.deep.change').isDirty).to.be.true);
          it('`obj.deep.change` isPristine should be false',      () => expect(form.$('obj.deep.change').isPristine).to.be.false);
        });

        describe('Check initial props state:', () => {
          it('`emptyArray` value should be equal []',         () => expect(form.$('emptyArray').value).to.be.deep.equal([]));
          it('`emptyArray` initial should be equal []',       () => expect(form.$('emptyArray').initial).to.be.deep.equal([]));
          it('`emptyArray` isDirty should be false',          () => expect(form.$('emptyArray').isDirty).to.be.false);
          it('`emptyArray` isPristine should be true',        () => expect(form.$('emptyArray').isPristine).to.be.true);
        });

        describe('Check props state after change:', () => {
          form.$('arrayChangeAdd').add({ value: 'b' }); // change state
          it(`"arrayChangeAdd" value should be equal ['a', 'b']`,   () => expect(form.$('arrayChangeAdd').value).to.be.deep.equal(['a', 'b']));
          it(`"arrayChangeAdd" initial should be equal ['a']`,      () => expect(form.$('arrayChangeAdd').initial).to.be.deep.equal(['a']));
          it(`"arrayChangeAdd" isDirty should be true`,             () => expect(form.$('arrayChangeAdd').isDirty).to.be.true);
          it(`"arrayChangeAdd" isPristine should be false`,         () => expect(form.$('arrayChangeAdd').isPristine).to.be.false);
        });

        describe('Check props state after change:', () => {
          form.$('arrayChangeDel').del(1); // change state
          it(`"arrayChangeDel" value should be equal ['a']`,          () => expect(form.$('arrayChangeDel').value).to.be.deep.equal(['a']));
          it(`"arrayChangeDel" initial should be equal ['a', 'b']`,   () => expect(form.$('arrayChangeDel').initial).to.be.deep.equal(['a', 'b']));
          it(`"arrayChangeDel" isDirty should be true`,               () => expect(form.$('arrayChangeDel').isDirty).to.be.true);
          it(`"arrayChangeDel" isPristine should be false`,           () => expect(form.$('arrayChangeDel').isPristine).to.be.false);
        });

        describe('Check props state after change:', () => {
          form.$('arrayChangeEqual').del(1); // change state
          form.$('arrayChangeEqual').add({ value: 'b' }); // change state
          it(`"arrayChangeEqual" value should be equal ['a', 'b']`,   () => expect(form.$('arrayChangeEqual').value).to.be.deep.equal(['a', 'b']));
          it(`"arrayChangeEqual" initial should be equal ['a', 'b']`, () => expect(form.$('arrayChangeEqual').initial).to.be.deep.equal(['a', 'b']));
          it(`"arrayChangeEqual" isDirty should be false`,            () => expect(form.$('arrayChangeEqual').isDirty).to.be.false);
          it(`"arrayChangeEqual" isPristine should be true`,          () => expect(form.$('arrayChangeEqual').isPristine).to.be.true);
        });

        describe('Check props state after change:', () => {
          form.$('array').del(0); // change state
          form.$('array').add([{ id: 3, name: 'max' }]); // change state
          const value = [{ id: 2, name: 'sam' }, { id: 3, name: 'max' }];
          const initial = [{ id: 1, name: 'joe' }, { id: 2, name: 'sam' }];
          // initial check
          it(`"array" value should be equal "values" const`,      () => expect(form.$('array').value).to.be.deep.equal(value));
          it(`"array" initial should be equal "initial" const`,   () => expect(form.$('array').initial).to.be.deep.equal(initial));
          it(`"array" isDirty should be true`,                    () => expect(form.$('array').isDirty).to.be.true);
          it(`"array" isPristine should be false`,                () => expect(form.$('array').isPristine).to.be.false);
          // old fields check
          it(`"array" $(1).isDirty should be false`,              () => expect(form.$('array').$(1).isDirty).to.be.false);
          it(`"array" $(1).isPristine should be true`,            () => expect(form.$('array').$(1).isPristine).to.be.true);
          it(`"array" $(1).$('id').isDirty should be false`,      () => expect(form.$('array').$(1).$('id').isDirty).to.be.false);
          it(`"array" $(1).$('id').isPristine should be true`,    () => expect(form.$('array').$(1).$('id').isPristine).to.be.true);
          // added field check
          it(`"array" $(2).isDirty should be false`,              () => expect(form.$('array').$(2).isDirty).to.be.false);
          it(`"array" $(2).isPristine should be true`,            () => expect(form.$('array').$(2).isPristine).to.be.true);
          it(`"array" $(2).$('id').isDirty should be false`,      () => expect(form.$('array').$(2).$('id').isDirty).to.be.false);
          it(`"array" $(2).$('id').isPristine should be true`,    () => expect(form.$('array').$(2).$('id').isPristine).to.be.true);
        });

        describe('Check Form props state:', () => {
          it(`"form" isDirty should be true`,             () => expect(form.isDirty).to.be.true);
          it(`"form" isPristine should be false`,         () => expect(form.isPristine).to.be.false);
        });
      },
    };
  }
}

export default new NewForm({
  fields,
  values,
  initials,
}, { name: 'Fixes-T' });
