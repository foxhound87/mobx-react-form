import { expect } from 'chai';

// test data
import $A from './data/form.a.js';
import $B from './data/form.b.js';
import $C from './data/form.c.js';
import $D from './data/form.d.js';
import $E from './data/form.e.js';
import $F from './data/form.f.js';
import $G from './data/form.g.js';
import $H from './data/form.h.js';

// do some stuff
$C.invalidate('The user already exist');
$D.update({ username: 'Jonathan Ive' });

// do tests
describe('mobx-ajv-form', () => {
  // test isValid
  it('$A isValid should be true', () => expect($A.isValid).to.be.true);
  it('$B isValid should be false', () => expect($B.isValid).to.be.false);
  it('$C isValid should be false', () => expect($C.isValid).to.be.false);
  it('$D isValid should be false', () => expect($D.isValid).to.be.false);
  it('$E isValid should be true', () => expect($E.isValid).to.be.true);
  it('$F isValid should be false', () => expect($F.isValid).to.be.false);
  it('$G isValid should be true', () => expect($G.isValid).to.be.true);
  it('$H isValid should be true', () => expect($H.isValid).to.be.true);

  // test isDirty
  it('$A isDirty should be false', () => expect($A.isDirty).to.be.false);
  it('$B isDirty should be false', () => expect($B.isDirty).to.be.false);
  it('$C isDirty should be false', () => expect($C.isDirty).to.be.false);
  it('$D isDirty should be true', () => expect($D.isDirty).to.be.true);

  // others check
  it('$A fieldKeys() should be array', () => expect($A.fieldKeys()).to.be.array);
  it('$A values() should be array', () => expect($A.values()).to.be.array);

  it('$C genericErrorMessage should be equal to "The user already exist."', () =>
    expect($C.genericErrorMessage).to.be.equal('The user already exist'));

  it('$D username should be equal to "Jonathan Ive"', () =>
    expect($D.fields.username.value).to.be.equal('Jonathan Ive'));

  it('$H username should be equal to "SteveJobs"', () =>
    expect($H.fields.username.value).to.be.equal('SteveJobs'));

  it('$H email value should be equal to "s.jobs@apple.com"', () =>
    expect($H.fields.email.value).to.be.equal('s.jobs@apple.com'));

  it('$H email label should be equal to "Email"', () =>
    expect($H.fields.email.label).to.be.equal('Email'));

  it('$H devSkills should be equal to ""', () =>
    expect($H.fields.devSkills.value).to.be.equal(''));

});
