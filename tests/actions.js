import { expect, assert } from 'chai';

import $ from './data'; // FORMS

/**
  Execute Actions (Different Forms)
*/

$.$C.invalidate('The user already exist');

$.$D.update({
  username: 'JonathanIve',
  terms: false,
  assets: 0,
  revenue: 'aaa',
  undefined: true, // this field does not exists (strictUpdate)
});

$.$I.update({ username: 'JonathanIve' });
$.$I.reset(); // to default or initial values

$.$L.clear(); // to empty values

// subsequent clear and reset (SAME FORM)
$.$M.clear(); // to empty values
$.$M.reset(); // to default or initial values

// subsequent clear and reset (SAME FORM)
$.$N.clear(); // to empty values
$.$N.reset(); // to default or initial values

$.$O.update({
  undefined: 'undefined',
  username: 'TestUser',
});

$.$O.update('label', {
  undefined: 'undefined',
  email: 'E-mail',
});

$.$P.$('username').set('label', 'UserName');

$.$P.reset();

describe('$L Form', () => {
  it('$L username.value should be empty', () =>
    expect($.$L.$('username').value).to.be.empty);

  it('$L email.value should be empty', () =>
    expect($.$L.$('email').value).to.be.empty);

  it('$L password.value should be empty', () =>
    expect($.$L.$('password').value).to.be.empty);

  it('$L password.error should be null', () =>
    expect($.$L.$('password').error).to.be.null);

  it('$L password.errorMessage should be null', () =>
    expect($.$L.$('password').errorMessage).to.be.null);
});

describe('$H Form fields', () => {
  it('$H username.getValue should be equal to "SteveJobs"', () =>
    expect($.$H.$('username').getValue()).to.be.equal('SteveJobs'));

  it('$H username.value should be equal to "SteveJobs"', () =>
    expect($.$H.$('username').value).to.be.equal('SteveJobs'));

  it('$H email.value should be equal to "s.jobs@apple.com"', () =>
    expect($.$H.$('email').value).to.be.equal('s.jobs@apple.com'));

  it('$H email.label should be equal to "Email"', () =>
    expect($.$H.$('email').label).to.be.equal('Email'));

  it('$H devSkills.value should be empty', () =>
    expect($.$H.$('devSkills').value).to.be.empty);
});

describe('$O Form fields', () => {
  it('$O username.value hould be equal to "TestUser"', () =>
    expect($.$O.$('username').value).to.be.equal('TestUser'));

  it('$O email.value hould be equal to "s.jobs@apple.com"', () =>
    expect($.$O.$('email').value).to.be.equal('s.jobs@apple.com'));

  it('$O email.label should be equal to "E-mail"', () =>
    expect($.$O.$('email').label).to.be.equal('E-mail'));

  it('$O passwordConfirm.label should be equal to "Confirm Password"', () =>
    expect($.$O.$('passwordConfirm').label).to.be.equal('Confirm Password'));

  it('$O error should be null', () =>
    expect($.$O.error).to.be.null);
});

describe('$P Form fields', () => {
  it('$P username.value hould be equal to "TestUser"', () =>
    expect($.$P.$('username').value).to.be.equal('TestUser'));

  it('$P email.value hould be equal to "s.jobs@apple.com"', () =>
    expect($.$P.$('email').value).to.be.equal('s.jobs@apple.com'));

  it('$P username.label hould be equal to "UserName"', () =>
    expect($.$P.$('username').label).to.be.equal('UserName'));


  it('$P username.isValid should be false', () =>
    expect($.$P.$('username').isValid).to.be.false);

  it('$P email.isValid should be false', () =>
    expect($.$P.$('email').isValid).to.be.false);

  it('$P terms.disabled should be true', () =>
    expect($.$P.$('terms').disabled).to.be.true);

  it('$P error should be null', () =>
    expect($.$P.error).to.be.null);
});

describe('others fields', () => {
  it('$C error should be equal to "The user already exist."', () =>
    expect($.$C.error).to.be.equal('The user already exist'));

  it('$C genericError should be equal to "The user already exist."', () =>
    expect($.$C.genericError).to.be.equal('The user already exist'));

  it('$D devSkills.isValid should be false', () =>
    expect($.$D.$('devSkills').isValid).to.be.false);

  it('$D username.value should be equal to "JonathanIve"', () =>
    expect($.$D.$('username').value).to.be.equal('JonathanIve'));

  it('$D terms.value should be false', () =>
    expect($.$D.$('terms').value).to.be.false);

  it('$D terms.hasError should be false', () =>
    expect($.$D.$('terms').hasError).to.be.false);

  it('$D revenue.hasError should be true', () =>
    expect($.$D.$('revenue').hasError).to.be.true);

  it('$D revenue.value should be equal to "aaa"', () =>
    expect($.$D.$('revenue').value).to.be.equal('aaa'));

  it('$D assets.value should be equal to "0"', () =>
    expect($.$D.$('assets').value).to.be.equal(0));

  it('$D assets.isEmpty should be false', () =>
    expect($.$D.$('assets').isEmpty).to.be.false);

  it('$D terms.label should be equal to "Accept Terms of Service"', () =>
    expect($.$D.$('terms').label).to.be.equal('Accept Terms of Service'));

  it('$I username.value should be equal to "SteveJobs"', () =>
    expect($.$I.$('username').value).to.be.equal('SteveJobs'));

  it('$M username.default should be equal to "Claudio"', () =>
    expect($.$M.$('username').default).to.be.equal('Claudio'));

  it('$M username.value should be equal to "Claudio"', () =>
    expect($.$M.$('username').value).to.be.equal('Claudio'));

  it('$M username.initial should be equal to "SteveJobs"', () =>
    expect($.$M.$('username').initial).to.be.equal('SteveJobs'));

  it('$M username.isValid should be false', () =>
    expect($.$M.$('username').isValid).to.be.false);

  it('$N email.isValid should be false', () =>
    expect($.$N.$('email').isValid).to.be.false);

  it('$N email.value should be equal to "12345"', () =>
    expect($.$N.$('email').value).to.be.equal('12345'));
});

describe('Field values type checks', () => {
  it('$A terms.value is a boolean', () =>
    assert.isBoolean($.$A.$('terms').value,
      '$A terms.value is not a boolean'));

  it('$A revenue.value is string', () =>
    assert.isString($.$A.$('revenue').value,
      '$A revenue.value is not string'));

  it('$A assets.value is a number', () =>
    assert.isNumber($.$A.$('assets').value,
      '$A assets.value is not a number'));
});
