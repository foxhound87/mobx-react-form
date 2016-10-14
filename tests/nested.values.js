import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

describe('Check Nested $I Separated Properties (values)', () => {
  it('$I state.city.places.centralPark value should be true', () =>
    expect($.$I.$('state.city.places.centralPark').value).to.be.true);

  it('$I state.city.places.statueOfLiberty value should be false', () =>
    expect($.$I.$('state.city.places.statueOfLiberty').value).to.be.false);

  it('$I state.city.places.empireStateBuilding value should be true', () =>
    expect($.$I.$('state.city.places.empireStateBuilding').value).to.be.true);

  it('$I state.city.places.brooklynBridge value should be false', () =>
    expect($.$I.$('state.city.places.brooklynBridge').value).to.be.false);
});

describe('Check Nested $L Values', () => {
  it('$L state.city.places.centralPark value should be true', () =>
    expect($.$L.$('state.city.places.centralPark').value).to.be.true);

  it('$L state.city.places.statueOfLiberty value should be false', () =>
    expect($.$L.$('state.city.places.statueOfLiberty').value).to.be.false);

  it('$L state.city.places.empireStateBuilding value should be true', () =>
    expect($.$L.$('state.city.places.empireStateBuilding').value).to.be.true);

  it('$L state.city.places.brooklynBridge value should be false', () =>
    expect($.$L.$('state.city.places.brooklynBridge').value).to.be.false);
});

describe('Check Nested $M Values (fields prop)', () => {
  it('$M club value should be equal to "HELLO"', () =>
    expect($.$M.$('club').value).to.be.equal('HELLO'));

  it('$M members[0].firstname value should be equal to "Clint"', () =>
    expect($.$M.$('members[0].firstname').value).to.be.equal('Clint'));

  it('$M members[1].firstname value should be equal to "Charlie"', () =>
    expect($.$M.$('members[1].firstname').value).to.be.equal('Charlie'));

  it('$M members[0].hobbies[1] value should be equal to "Baseball"', () =>
    expect($.$M.$('members[0].hobbies[1]').value).to.be.equal('Baseball'));

  it('$M members[1].hobbies[0] value should be equal to "Golf"', () =>
    expect($.$M.$('members[1].hobbies[0]').value).to.be.equal('Golf'));

  it('$M members[1].hobbies[1] value should be equal to "Basket"', () =>
    expect($.$M.$('members[1].hobbies[1]').value).to.be.equal('Basket'));
});

describe('Check Nested $N Values (values prop)', () => {
  it('$N club value should be equal to "HELLO"', () =>
    expect($.$N.$('club').value).to.be.equal('HELLO'));

  it('$N members.0.firstname value should be equal to "Clint"', () =>
    expect($.$N.$('members.0.firstname').value).to.be.equal('Clint'));

  it('$N members.1.firstname value should be equal to "Charlie"', () =>
    expect($.$N.$('members.1.firstname').value).to.be.equal('Charlie'));

  it('$N members.0.hobbies.1 value should be equal to "Baseball"', () =>
    expect($.$N.$('members.0.hobbies.1').value).to.be.equal('Baseball'));

  it('$N members.1.hobbies.0 value should be equal to "Golf"', () =>
    expect($.$N.$('members.1.hobbies.0').value).to.be.equal('Golf'));

  it('$N members.1.hobbies.1 value should be equal to "Basket"', () =>
    expect($.$N.$('members.1.hobbies').$(1).value).to.be.equal('Basket'));
});

describe('Check Nested $O Values (fields prop)', () => {
  it('$O club.name value should be equal to "HELLO"', () =>
    expect($.$O.$('club.name').value).to.be.equal('HELLO'));

  it('$O members[0].firstname value should be equal to "Clint"', () =>
    expect($.$O.$('members[0].firstname').value).to.be.equal('Clint'));

  it('$O members[1].firstname value should be equal to "Charlie"', () =>
    expect($.$O.$('members[1].firstname').value).to.be.equal('Charlie'));

  it('$O members[0].hobbies[1] value should be equal to "Baseball"', () =>
    expect($.$O.$('members[0].hobbies[1]').value).to.be.equal('Baseball'));

  it('$O members[1].hobbies[0] value should be equal to "Golf"', () =>
    expect($.$O.$('members[1].hobbies[0]').value).to.be.equal('Golf'));

  it('$O members[1].hobbies[1] value should be equal to "Basket"', () =>
    expect($.$O.$('members[1].hobbies[1]').value).to.be.equal('Basket'));
});
