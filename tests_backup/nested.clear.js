import { expect } from 'chai';

import $ from './data/nested'; // FORMS

$.$D.$('state.city').clear(true);

describe('Check Nested $D props after state clear()', () => {
  it('$D state isEmpty should be false', () =>
  expect($.$D.$('state').isEmpty).to.be.false);

  it('$D state.city isEmpty should be true', () =>
  expect($.$D.$('state.city').isEmpty).to.be.true);

  it('$D state.city.places isEmpty should be true', () =>
    expect($.$D.$('state.city.places').isEmpty).to.be.true);

  it('$D state.city.places.brooklynBridge isEmpty should be true', () =>
    expect($.$D.$('state.city.places.brooklynBridge').isEmpty).to.be.true);
});

