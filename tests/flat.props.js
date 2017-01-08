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

describe('Check Flat $B error prop', () => {
  it('$B state.options.defaultGenericError should be equal to "Custom Generic Error"', () =>
    expect($.$B.options('defaultGenericError')).to.be.equal('Custom Generic Error'));

  it('$B error should be equal to "Custom Generic Error"', () =>
    expect($.$B.error).to.be.equal('Custom Generic Error'));
});

describe('Check Flat $R extended field prop', () => {
  it('$R email should have property newFieldProp', () =>
    expect($.$R.$('email')).to.have.property('newFieldProp'));

  it('$R email newFieldProp should be true', () =>
    expect($.$R.$('email').newFieldProp).to.be.true);
});
