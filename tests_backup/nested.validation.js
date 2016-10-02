import { expect } from 'chai';

import $ from './data/nested'; // FORMS

describe('Check Nested $E validation', () => {
  it('$E state.isValid should be false', () =>
    expect($.$E.$('state').isValid).to.be.false);

  it('$E state.city.isValid should be false', () =>
    expect($.$E.$('state.city').isValid).to.be.false);
});

describe('Check Nested $E validation', () => {
  it('$F state.isValid should be false', () =>
    expect($.$F.$('state').isValid).to.be.false);

  it('$F state.city.isValid should be false', () =>
    expect($.$F.$('state.city').isValid).to.be.false);

  it('$F state.city.places.isValid should be false', () =>
    expect($.$F.$('state.city.places').isValid).to.be.false);
});
