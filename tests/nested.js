import { expect } from 'chai';

import $ from './data/nested'; // FORMS

$.$A.update({
  address: {
    city: 'Los Angeles',
  },
});

$.$A.update('label', {
  address: {
    city: 'Cool City',
  },
});

$.$B.$('state.city.places').set('label', 'NY Cool Places');
$.$B.$('state.city.places').$('empireStateBuilding').update(false);
$.$B.$('state.city.places.centralPark').set(false);

$.$C.$('state.city.places').set('label', 'NY Cool Places');
$.$C.$('state.city.places').$('empireStateBuilding').update(false);
$.$C.$('state.city.places.centralPark').set(false);

describe('Check $A Nested Fields', () => {
  it('$A address.street.value should be equal to "Broadway"', () =>
    expect($.$A.$('address.street').value).to.be.equal('Broadway'));

  it('$A address.city.value should be equal to "Los Angeles"', () =>
    expect($.$A.$('address.city').value).to.be.equal('Los Angeles'));

  it('$A address.city.label should be equal to "Cool City"', () =>
    expect($.$A.$('address.city').label).to.be.equal('Cool City'));
});

describe('Check $B Nested Fields', () => {
  it('$B state.city label should be equal to "City"', () =>
    expect($.$B.$('state.city').label).to.be.equal('City'));

  it('$B state.city value should be equal to "New York"', () =>
    expect($.$B.$('state.city').value).to.be.equal('New York'));

  it('$B state.city.places value should be empty', () =>
    expect($.$B.$('state.city.places').value).to.be.empty);

  it('$B state.city.places isEmpty should be true', () =>
    expect($.$B.$('state.city.places').isEmpty).to.be.true);

  it('$B state.city.places label should be equal to "NY Cool Places"', () =>
    expect($.$B.$('state.city.places').label).to.be.equal('NY Cool Places'));

  it('$B state.city.places.statueOfLiberty label should be equal to "Statue of Liberty"', () =>
    expect($.$B.$('state.city.places.statueOfLiberty').label).to.be.equal('Statue of Liberty'));

  it('$B state.city.places.statueOfLiberty value should be false', () =>
    expect($.$B.$('state.city.places.statueOfLiberty').value).to.be.false);

  it('$B state.city.places.centralPark value should be false', () =>
    expect($.$B.$('state.city.places.centralPark').value).to.be.false);

  it('$B state.city.places.empireStateBuilding value should be false', () =>
    expect($.$B.$('state.city.places.empireStateBuilding').value).to.be.false);
});

describe('Check $C Nested Fields', () => {
  it('$C state.city label should be equal to "City"', () =>
    expect($.$C.$('state.city').label).to.be.equal('City'));

  it('$C state.city value should be equal to "New York"', () =>
    expect($.$C.$('state.city').value).to.be.equal('New York'));

  it('$C state.city.places value should be empty', () =>
    expect($.$C.$('state.city.places').value).to.be.empty);

  it('$C state.city.places isEmpty should be true', () =>
    expect($.$C.$('state.city.places').isEmpty).to.be.true);

  it('$C state.city.places label should be equal to "NY Cool Places"', () =>
    expect($.$C.$('state.city.places').label).to.be.equal('NY Cool Places'));

  it('$C state.city.places.statueOfLiberty label should be equal to "Statue of Liberty"', () =>
    expect($.$C.$('state.city.places.statueOfLiberty').label).to.be.equal('Statue of Liberty'));

  it('$C state.city.places.statueOfLiberty value should be false', () =>
    expect($.$C.$('state.city.places.statueOfLiberty').value).to.be.false);

  it('$C state.city.places.centralPark value should be false', () =>
    expect($.$C.$('state.city.places.centralPark').value).to.be.false);

  it('$C state.city.places.empireStateBuilding value should be false', () =>
    expect($.$C.$('state.city.places.empireStateBuilding').value).to.be.false);
});
