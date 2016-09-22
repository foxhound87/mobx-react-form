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

$.$O.update({ username: 'TestUser' });

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
    expect($.$H.fields.username.getValue()).to.be.equal('SteveJobs'));

  it('$H username.value should be equal to "SteveJobs"', () =>
    expect($.$H.fields.username.value).to.be.equal('SteveJobs'));

  it('$H email.value should be equal to "s.jobs@apple.com"', () =>
    expect($.$H.fields.email.value).to.be.equal('s.jobs@apple.com'));

  it('$H email.label should be equal to "Email"', () =>
    expect($.$H.fields.email.label).to.be.equal('Email'));

  it('$H devSkills.value should be empty', () =>
    expect($.$H.fields.devSkills.value).to.be.empty);
});

describe('$O Form fields', () => {
  it('$O username.getValue should be equal to "TestUser"', () =>
    expect($.$O.fields.username.getValue()).to.be.equal('TestUser'));

  it('$O error should be null', () =>
    expect($.$O.error).to.be.null);
});

describe('others fields', () => {
  it('$C error should be equal to "The user already exist."', () =>
    expect($.$C.error).to.be.equal('The user already exist'));

  it('$C genericError should be equal to "The user already exist."', () =>
    expect($.$C.genericError).to.be.equal('The user already exist'));

  it('$D devSkills.isValid should be false', () =>
    expect($.$D.fields.devSkills.isValid).to.be.false);

  it('$D username.value should be equal to "JonathanIve"', () =>
    expect($.$D.fields.username.value).to.be.equal('JonathanIve'));

  it('$D terms.value should be false', () =>
    expect($.$D.fields.terms.value).to.be.false);

  it('$D terms.hasError should be false', () =>
    expect($.$D.fields.terms.hasError).to.be.false);

  it('$D revenue.hasError should be true', () =>
    expect($.$D.fields.revenue.hasError).to.be.true);

  it('$D revenue.value should be equal to "aaa"', () =>
    expect($.$D.fields.revenue.value).to.be.equal('aaa'));

  it('$D assets.value should be equal to "0"', () =>
    expect($.$D.fields.assets.value).to.be.equal(0));

  it('$D assets.isEmpty should be false', () =>
    expect($.$D.fields.assets.isEmpty).to.be.false);

  it('$D terms.label should be equal to "Accept Terms of Service"', () =>
    expect($.$D.fields.terms.label).to.be.equal('Accept Terms of Service'));

  it('$I username.value should be equal to "SteveJobs"', () =>
    expect($.$I.fields.username.value).to.be.equal('SteveJobs'));

  it('$M username.default should be equal to "Claudio"', () =>
    expect($.$M.fields.username.default).to.be.equal('Claudio'));

  it('$M username.value should be equal to "Claudio"', () =>
    expect($.$M.fields.username.value).to.be.equal('Claudio'));

  it('$M username.initial should be equal to "SteveJobs"', () =>
    expect($.$M.fields.username.initial).to.be.equal('SteveJobs'));

  it('$M username.isValid should be false', () =>
    expect($.$M.fields.username.isValid).to.be.false);

  it('$N email.isValid should be false', () =>
    expect($.$N.fields.email.isValid).to.be.false);

  it('$N email.value should be equal to "12345"', () =>
    expect($.$N.fields.email.value).to.be.equal('12345'));
});

describe('Field values type checks', () => {
  it('$A.fields.terms.value is a boolean', () =>
    assert.isBoolean($.$A.fields.terms.value,
      '$A.fields.terms.value is not a boolean'));

  it('$A.fields.revenue.value is string', () =>
    assert.isString($.$A.fields.revenue.value,
      '$A.fields.revenue.value is not string'));

  it('$A.fields.assets.value is a number', () =>
    assert.isNumber($.$A.fields.assets.value,
      '$A.fields.assets.value is not a number'));
});
