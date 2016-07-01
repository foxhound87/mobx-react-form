import { expect } from 'chai';

// test data
import aForm from './data/a.form.js';
import bForm from './data/b.form.js';
import cForm from './data/c.form.js';
import dForm from './data/d.form.js';

// do some stuff
cForm.invalidate('The user already exist');
dForm.update({ username: 'Jonathan Ive' });

// do tests
describe('mobx-ajv-form', () => {
  // test isValid
  it('aForm isValid should be true', () => expect(aForm.isValid).to.be.true);
  it('bForm isValid should be false', () => expect(bForm.isValid).to.be.false);
  it('cForm isValid should be false', () => expect(cForm.isValid).to.be.false);
  it('dForm isValid should be false', () => expect(dForm.isValid).to.be.false);

  // test isDirty
  it('aForm isDirty should be false', () => expect(aForm.isDirty).to.be.false);
  it('bForm isDirty should be false', () => expect(bForm.isDirty).to.be.false);
  it('cForm isDirty should be false', () => expect(cForm.isDirty).to.be.false);
  it('dForm isDirty should be true', () => expect(dForm.isDirty).to.be.true);

  // others check
  it('aForm fieldKeys() should be array', () => expect(aForm.fieldKeys()).to.be.array);
  it('aForm values() should be array', () => expect(aForm.values()).to.be.array);

  it('cForm username should be equal to "The user already exist."', () =>
    expect(cForm.genericErrorMessage).to.be.equal('The user already exist'));

  it('dForm username should be equal to "Jonathan Ive"', () =>
    expect(dForm.fields.username.value).to.be.equal('Jonathan Ive'));
});
