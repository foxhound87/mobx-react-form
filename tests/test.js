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
import $I from './data/form.i.js';
import $L from './data/form.l.js';
import $M from './data/form.m.js';

// do some stuff (DIFFERENT FORMS)
$C.invalidate('The user already exist');
$D.update({ username: 'JonathanIve' });
$I.update({ username: 'JonathanIve' });
$I.reset(); // to original values
$L.clear(); // to empty values

// subsequent clear and reset (SAME FORM)
$M.clear(); // to empty values
$M.reset(); // to original values

describe('isValid', () => {
  it('$A isValid should be true', () => expect($A.isValid).to.be.true);
  it('$B isValid should be false', () => expect($B.isValid).to.be.false);
  it('$C isValid should be false', () => expect($C.isValid).to.be.false);
  it('$D isValid should be false', () => expect($D.isValid).to.be.false);
  it('$E isValid should be true', () => expect($E.isValid).to.be.true);
  it('$F isValid should be false', () => expect($F.isValid).to.be.false);
  it('$G isValid should be true', () => expect($G.isValid).to.be.true);
  it('$H isValid should be true', () => expect($H.isValid).to.be.true);
  it('$I isValid should be true', () => expect($I.isValid).to.be.true);
  it('$L isValid should be false', () => expect($L.isValid).to.be.false);
  it('$M isValid should be true', () => expect($M.isValid).to.be.true);
});

describe('isDirty', () => {
  it('$A isDirty should be true', () => expect($A.isDirty).to.be.true);
  it('$B isDirty should be false', () => expect($B.isDirty).to.be.false);
  it('$C isDirty should be false', () => expect($C.isDirty).to.be.false);
  it('$D isDirty should be true', () => expect($D.isDirty).to.be.true);
  it('$E isDirty should be true', () => expect($E.isDirty).to.be.true);
  it('$F isDirty should be true', () => expect($F.isDirty).to.be.true);
  it('$G isDirty should be false', () => expect($G.isDirty).to.be.false);
  it('$H isDirty should be true', () => expect($H.isDirty).to.be.true);
  it('$I isDirty should be true', () => expect($I.isDirty).to.be.true);
  it('$L isDirty should be false', () => expect($L.isDirty).to.be.false);
  it('$M isDirty should be true', () => expect($M.isDirty).to.be.true);
});

describe('validate()', () => {
  it('$A validate() should return true', () => expect($A.validate()).to.be.true);
  it('$B validate() should return false', () => expect($B.validate()).to.be.false);
  it('$D validate() should return false', () => expect($D.validate()).to.be.false);
  it('$E validate() should return true', () => expect($E.validate()).to.be.true);
  it('$F validate() should return false', () => expect($F.validate()).to.be.false);
  it('$G validate() should return true', () => expect($G.validate()).to.be.true);
  it('$H validate() should return true', () => expect($H.validate()).to.be.true);
  it('$I validate() should return true', () => expect($I.validate()).to.be.true);
  it('$L validate() should return false', () => expect($L.validate()).to.be.false);
  it('$M validate() should return true', () => expect($M.validate()).to.be.true);
});

describe('fieldKeys()', () => {
  it('$A fieldKeys() should be array', () => expect($A.fieldKeys()).to.be.array);
  it('$B fieldKeys() should be array', () => expect($B.fieldKeys()).to.be.array);
  it('$C fieldKeys() should be array', () => expect($C.fieldKeys()).to.be.array);
  it('$D fieldKeys() should be array', () => expect($D.fieldKeys()).to.be.array);
});

describe('values()', () => {
  it('$A values() should be array', () => expect($A.values()).to.be.array);
  it('$B values() should be array', () => expect($B.values()).to.be.array);
  it('$C values() should be array', () => expect($C.values()).to.be.array);
  it('$D values() should be array', () => expect($D.values()).to.be.array);
});

describe('$L Form', () => {
  it('$L username should be equal to ""', () =>
    expect($L.fields.username.value).to.be.equal(''));

  it('$L email should be equal to ""', () =>
    expect($L.fields.email.value).to.be.equal(''));

  it('$L password should be equal to ""', () =>
    expect($L.fields.password.value).to.be.equal(''));
});

describe('$H Form', () => {
  it('$H username should be equal to "SteveJobs"', () =>
    expect($H.fields.username.value).to.be.equal('SteveJobs'));

  it('$H email value should be equal to "s.jobs@apple.com"', () =>
    expect($H.fields.email.value).to.be.equal('s.jobs@apple.com'));

  it('$H email label should be equal to "Email"', () =>
    expect($H.fields.email.label).to.be.equal('Email'));

  it('$H devSkills should be equal to ""', () =>
    expect($H.fields.devSkills.value).to.be.equal(''));
});


describe('others', () => {
  it('$C genericErrorMessage should be equal to "The user already exist."', () =>
    expect($C.genericErrorMessage).to.be.equal('The user already exist'));

  it('$D fields.devSkills.$valid should be false', () =>
    expect($D.fields.devSkills.$valid).to.be.false);

  it('$D username should be equal to "JonathanIve"', () =>
    expect($D.fields.username.value).to.be.equal('JonathanIve'));

  it('$I username should be equal to "SteveJobs"', () =>
    expect($I.fields.username.value).to.be.equal('SteveJobs'));
});
