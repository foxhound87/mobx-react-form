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
import $N from './data/form.n.js';

// do some stuff (DIFFERENT FORMS)
$C.invalidate('The user already exist');
$D.update({ username: 'JonathanIve' });
$I.update({ username: 'JonathanIve' });
$I.reset(); // to original values
$L.clear(); // to empty values

// subsequent clear and reset (SAME FORM)
$M.clear(); // to empty values
$M.reset(); // to original values

// subsequent clear and reset (SAME FORM)
$N.clear(); // to empty values
$N.reset(); // to original values

describe('$L Form', () => {
  it('$L username value should be equal to "" (empty string)', () =>
    expect($L.fields.username.value).to.be.equal(''));

  it('$L email value should be equal to "" (empty string)', () =>
    expect($L.fields.email.value).to.be.equal(''));

  it('$L password value should be equal to "" (empty string)', () =>
    expect($L.fields.password.value).to.be.equal(''));

  it('$L password errorMessage should be null', () =>
    expect($L.fields.password.errorMessage).to.be.null);
});

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
  it('$N isValid should be false', () => expect($N.isValid).to.be.false);
});

describe('isDirty', () => {
  it('$A isDirty should be false', () => expect($A.isDirty).to.be.false);
  it('$B isDirty should be false', () => expect($B.isDirty).to.be.false);
  it('$C isDirty should be false', () => expect($C.isDirty).to.be.false);
  it('$D isDirty should be true', () => expect($D.isDirty).to.be.true);
  it('$E isDirty should be false', () => expect($E.isDirty).to.be.false);
  it('$F isDirty should be false', () => expect($F.isDirty).to.be.false);
  it('$G isDirty should be false', () => expect($G.isDirty).to.be.false);
  it('$H isDirty should be false', () => expect($H.isDirty).to.be.false);
  it('$I isDirty should be false', () => expect($I.isDirty).to.be.false);
  it('$L isDirty should be true', () => expect($L.isDirty).to.be.true);
  it('$M isDirty should be false', () => expect($M.isDirty).to.be.false);
  it('$N isDirty should be false', () => expect($N.isDirty).to.be.false);
});

describe('isEmpty', () => {
  it('$A isEmpty should be false', () => expect($A.isEmpty).to.be.false);
  it('$B isEmpty should be true', () => expect($B.isEmpty).to.be.true);
  it('$C isEmpty should be true', () => expect($C.isEmpty).to.be.true);
  it('$D isEmpty should be false', () => expect($D.isEmpty).to.be.false);
  it('$E isEmpty should be false', () => expect($E.isEmpty).to.be.false);
  it('$F isEmpty should be false', () => expect($F.isEmpty).to.be.false);
  it('$G isEmpty should be true', () => expect($G.isEmpty).to.be.true);
  it('$H isEmpty should be false', () => expect($H.isEmpty).to.be.false);
  it('$I isEmpty should be false', () => expect($I.isEmpty).to.be.false);
  it('$L isEmpty should be true', () => expect($L.isEmpty).to.be.true);
  it('$M isEmpty should be false', () => expect($M.isEmpty).to.be.false);
  it('$N isEmpty should be false', () => expect($N.isEmpty).to.be.false);
});

describe('isPristine', () => {
  it('$A isPristine should be true', () => expect($A.isPristine).to.be.true);
  it('$B isPristine should be true', () => expect($B.isPristine).to.be.true);
  it('$C isPristine should be true', () => expect($C.isPristine).to.be.true);
  it('$D isPristine should be false', () => expect($D.isPristine).to.be.false);
  it('$E isPristine should be true', () => expect($E.isPristine).to.be.true);
  it('$F isPristine should be true', () => expect($F.isPristine).to.be.true);
  it('$G isPristine should be true', () => expect($G.isPristine).to.be.true);
  it('$H isPristine should be true', () => expect($H.isPristine).to.be.true);
  it('$I isPristine should be true', () => expect($I.isPristine).to.be.true);
  it('$L isPristine should be false', () => expect($L.isPristine).to.be.false);
  it('$M isPristine should be true', () => expect($M.isPristine).to.be.true);
  it('$N isPristine should be true', () => expect($N.isPristine).to.be.true);
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
  it('$N validate() should return false', () => expect($N.validate()).to.be.false);
});

describe('$H Form', () => {
  it('$H username value should be equal to "SteveJobs"', () =>
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

  it('$C genericError should be equal to "The user already exist."', () =>
    expect($C.genericError).to.be.equal('The user already exist'));

  it('$D devSkills.$valid should be false', () =>
    expect($D.fields.devSkills.$valid).to.be.false);

  it('$D username should be equal to "JonathanIve"', () =>
    expect($D.fields.username.value).to.be.equal('JonathanIve'));

  it('$I username should be equal to "SteveJobs"', () =>
    expect($I.fields.username.value).to.be.equal('SteveJobs'));

  it('$N email.$valid should be false', () =>
    expect($N.fields.email.$valid).to.be.false);

  it('$N email should be equal to "12345" (empty string)', () =>
    expect($N.fields.email.value).to.be.equal('12345'));
});
