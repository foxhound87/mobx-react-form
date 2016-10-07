import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

describe('Check Nested $I Separated Properties', () => {
  it('$I state.city.places.centralPark value should be true', () =>
  expect($.$I.$('state.city.places.centralPark').value).to.be.true);

  it('$I state.city.places.statueOfLiberty value should be false', () =>
  expect($.$I.$('state.city.places.statueOfLiberty').value).to.be.false);

  it('$I state.city.places.empireStateBuilding value should be true', () =>
  expect($.$I.$('state.city.places.empireStateBuilding').value).to.be.true);

  it('$I state.city.places.brooklynBridge value should be false', () =>
  expect($.$I.$('state.city.places.brooklynBridge').value).to.be.false);
});

