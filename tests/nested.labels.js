import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

describe('Check Nested $I Separated Properties (labels)', () => {
  it('$I state.city.places.centralPark label should be equal to "Central Park"', () =>
  expect($.$I.$('state.city.places.centralPark').label).to.be.equal('Central Park'));

  it('$I state.city.places.statueOfLiberty label should be equal to "Statue of Liberty"', () =>
  expect($.$I.$('state.city.places.statueOfLiberty').label).to.be.equal('Statue of Liberty'));

  it('$I state.city.places.empireStateBuilding label should be equal to "Empire State Building"', () =>
  expect($.$I.$('state.city.places.empireStateBuilding').label).to.be.equal('Empire State Building'));

  it('$I state.city.places.brooklynBridge label should be equal to "Brooklyn Bridge"', () =>
  expect($.$I.$('state.city.places.brooklynBridge').label).to.be.equal('Brooklyn Bridge'));
});
