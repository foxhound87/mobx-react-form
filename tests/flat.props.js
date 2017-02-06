import { expect } from 'chai';

import $ from './data/_.flat'; // FORMS

describe('Check Flat $A placeholder field prop', () => {
  it('$A username placeholder should be equal to "Username Placeholder"', () =>
    expect($.$A.$('username').placeholder).to.be.equal('Username Placeholder'));

  it('$A username type should be equal to "text"', () =>
    expect($.$A.$('username').type).to.be.equal('text'));

  it('$A username bindings should be equal to "default"', () =>
    expect($.$A.$('username').bindings).to.be.equal('default'));
});

describe('Check Flat $B value field prop', () => {
  it('$B username value should be empty string', () =>
    expect($.$B.$('username').value).to.be.equal(''));
});

describe('Check Flat $R extended field prop', () => {
  it('$R email should have property newFieldProp', () =>
    expect($.$R.$('email')).to.have.property('newFieldProp'));

  it('$R email newFieldProp should be true', () =>
    expect($.$R.$('email').newFieldProp).to.be.true);
});
