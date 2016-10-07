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

describe('Check Nested $L Separated Properties', () => {
  it('$L state.city.places.centralPark value should be true', () =>
  expect($.$L.$('state.city.places.centralPark').value).to.be.true);

  it('$L state.city.places.statueOfLiberty value should be false', () =>
  expect($.$L.$('state.city.places.statueOfLiberty').value).to.be.false);

  it('$L state.city.places.empireStateBuilding value should be true', () =>
  expect($.$L.$('state.city.places.empireStateBuilding').value).to.be.true);

  it('$L state.city.places.brooklynBridge value should be false', () =>
  expect($.$L.$('state.city.places.brooklynBridge').value).to.be.false);
});

describe('Check Nested $M Separated Properties', () => {
  it('$M clubname value should be equal to "HELLO"', () =>
  expect($.$M.$('clubname').value).to.be.equal('HELLO'));

  it('$M members.0.firstname value should be equal to "Clint"', () =>
  expect($.$M.$('members.0.firstname').value).to.be.equal('Clint'));

  it('$M members.1.firstname value should be equal to "Charlie"', () =>
  expect($.$M.$('members.1.firstname').value).to.be.equal('Charlie'));

  it('$M members.0.hobbies.1 value should be equal to "Baseball"', () =>
  expect($.$M.$('members.0.hobbies.1').value).to.be.equal('Baseball'));

  it('$M members.1.hobbies.0 value should be equal to "Golf"', () =>
  expect($.$M.$('members.1.hobbies.0').value).to.be.equal('Golf'));

  it('$M members.1.hobbies.1 value should be equal to "Basket"', () =>
  expect($.$M.$('members.1.hobbies.1').value).to.be.equal('Basket'));
});

