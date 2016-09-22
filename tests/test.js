import { expect, assert } from 'chai';

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

$D.update({
  username: 'JonathanIve',
  terms: false,
  assets: 0,
  revenue: 'aaa',
  undefined: true, // this field does not exists (strictUpdate)
});

$I.update({ username: 'JonathanIve' });
$I.reset(); // to default or initial values
$L.clear(); // to empty values

// subsequent clear and reset (SAME FORM)
$M.clear(); // to empty values
$M.reset(); // to default or initial values

// subsequent clear and reset (SAME FORM)
$N.clear(); // to empty values
$N.reset(); // to default or initial values

describe('$L Form', () => {
  it('$L username.value should be empty', () =>
    expect($L.$('username').value).to.be.empty);

  it('$L email.value should be empty', () =>
    expect($L.$('email').value).to.be.empty);

  it('$L password.value should be empty', () =>
    expect($L.$('password').value).to.be.empty);

  it('$L password.error should be null', () =>
    expect($L.$('password').error).to.be.null);

  it('$L password.errorMessage should be null', () =>
    expect($L.$('password').errorMessage).to.be.null);
});

describe('Form isValid', () => {
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
  it('$M isValid should be false', () => expect($M.isValid).to.be.false);
  it('$N isValid should be false', () => expect($N.isValid).to.be.false);
});

describe('Form isDirty', () => {
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

describe('Form isEmpty', () => {
  it('$A isEmpty should be false', () => expect($A.isEmpty).to.be.false);
  it('$B isEmpty should be true', () => expect($B.isEmpty).to.be.true);
  it('$C isEmpty should be false', () => expect($C.isEmpty).to.be.false);
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

describe('Form isPristine', () => {
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

describe('$H Form fields', () => {
  it('$H username.value should be equal to "SteveJobs"', () =>
    expect($H.fields.username.value).to.be.equal('SteveJobs'));

  it('$H email.value should be equal to "s.jobs@apple.com"', () =>
    expect($H.fields.email.value).to.be.equal('s.jobs@apple.com'));

  it('$H email.label should be equal to "Email"', () =>
    expect($H.fields.email.label).to.be.equal('Email'));

  it('$H devSkills.value should be empty', () =>
    expect($H.fields.devSkills.value).to.be.empty);
});

describe('others fields', () => {
  it('$C error should be equal to "The user already exist."', () =>
    expect($C.error).to.be.equal('The user already exist'));

  it('$C genericError should be equal to "The user already exist."', () =>
    expect($C.genericError).to.be.equal('The user already exist'));

  it('$D devSkills.isValid should be false', () =>
    expect($D.fields.devSkills.isValid).to.be.false);

  it('$D username.value should be equal to "JonathanIve"', () =>
    expect($D.fields.username.value).to.be.equal('JonathanIve'));

  it('$D terms.value should be false', () =>
    expect($D.fields.terms.value).to.be.false);

  it('$D terms.hasError should be false', () =>
    expect($D.fields.terms.hasError).to.be.false);

  it('$D revenue.hasError should be true', () =>
    expect($D.fields.revenue.hasError).to.be.true);

  it('$D revenue.value should be equal to "aaa"', () =>
    expect($D.fields.revenue.value).to.be.equal('aaa'));

  it('$D assets.value should be equal to "0"', () =>
    expect($D.fields.assets.value).to.be.equal(0));

  it('$D assets.isEmpty should be false', () =>
    expect($D.fields.assets.isEmpty).to.be.false);

  it('$D terms.label should be equal to "Accept Terms of Service"', () =>
    expect($D.fields.terms.label).to.be.equal('Accept Terms of Service'));

  it('$I username.value should be equal to "SteveJobs"', () =>
    expect($I.fields.username.value).to.be.equal('SteveJobs'));

  it('$M username.default should be equal to "Claudio"', () =>
    expect($M.fields.username.default).to.be.equal('Claudio'));

  it('$M username.value should be equal to "Claudio"', () =>
    expect($M.fields.username.value).to.be.equal('Claudio'));

  it('$M username.initial should be equal to "SteveJobs"', () =>
    expect($M.fields.username.initial).to.be.equal('SteveJobs'));

  it('$M username.isValid should be false', () =>
    expect($M.fields.username.isValid).to.be.false);

  it('$N email.isValid should be false', () =>
    expect($N.fields.email.isValid).to.be.false);

  it('$N email.value should be equal to "12345"', () =>
    expect($N.fields.email.value).to.be.equal('12345'));
});

describe('Field values type checks', () => {
  it('$A.fields.terms.value is a boolean', () =>
    assert.isBoolean($A.fields.terms.value,
      '$A.fields.terms.value is not a boolean'));

  it('$A.fields.revenue.value is string', () =>
    assert.isString($A.fields.revenue.value,
      '$A.fields.revenue.value is not string'));

  it('$A.fields.assets.value is a number', () =>
    assert.isNumber($A.fields.assets.value,
      '$A.fields.assets.value is not a number'));
});
