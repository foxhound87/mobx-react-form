import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

describe('Check Nested $E validation', () => {
  it('$E state isValid should be false', () =>
    expect($.$E.$('state').isValid).to.be.false);

  // AJV NESTED PROP (TO FIX)
  // it('$E state.city isValid should be false', () =>
  //   expect($.$E.$('state.city').isValid).to.be.false);
});

describe('Check Nested $F validation', () => {
  it('$F state isValid should be false', () =>
    expect($.$F.$('state').isValid).to.be.false);

  it('$F state.city isValid should be false', () =>
    expect($.$F.$('state.city').isValid).to.be.false);

  it('$F state.city.places isValid should be false', () =>
    expect($.$F.$('state.city.places').isValid).to.be.false);
});

describe('Check Nested $G validation', () => {
  it('$G state isValid should be false', () =>
    expect($.$G.$('state').isValid).to.be.false);

  it('$G state.city isValid should be false', () =>
    expect($.$G.$('state.city').isValid).to.be.false);

  it('$G state.city.places isValid should be false', () =>
    expect($.$G.$('state.city.places').isValid).to.be.false);
});

describe('Check Nested $H validation', () => {
  it('$H state isValid should be false', () =>
    expect($.$H.$('state').isValid).to.be.false);

  it('$H state.city isValid should be false', () =>
    expect($.$H.$('state.city').isValid).to.be.false);

  it('$H state.city.places isValid should be false', () =>
    expect($.$H.$('state.city.places').isValid).to.be.false);
});
