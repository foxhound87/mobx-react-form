import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

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

  const deepPropValue = 'state.fields.city.value';
  const deepPropLabel = 'state.fields.city.label';

  it(`$C get([label, value]) ${deepPropValue} should be equal to "New York"`, () =>
    expect($.$C.get(['label', 'value'])).to.have.deep.property(deepPropValue, 'New York'));

  it(`$C get([label, value]) ${deepPropLabel} should be equal to "City"`, () =>
    expect($.$C.get(['label', 'value'])).to.have.deep.property(deepPropLabel, 'City'));
});

describe('Check form.values() for Nested Fields', () => {
  const deepProp = 'state.city.places.empireStateBuilding';

  it(`$B values() ${deepProp} should be false`, () =>
    expect($.$B.values()).to.have.deep.property(deepProp, false));

  it(`$C values() ${deepProp} should be false`, () =>
    expect($.$C.values()).to.have.deep.property(deepProp, false));

  it('$C values() places.empireStateBuilding should be false', () =>
    expect($.$C.$('state.city').values())
      .to.have.deep.property('places.empireStateBuilding', false));
});

describe('Check Nested Fields path property', () => {
  const path = {
    a: 'address.city',
    b: 'state.city.places',
    c: 'state.city.places.statueOfLiberty',
  };

  it(`$A ${path.a} path path should be equal to ${path.a}`, () =>
    expect($.$A.$(path.a).path).to.be.equal(path.a));

  it(`$B ${path.b} path path should be equal to ${path.b}`, () =>
    expect($.$B.$(path.b).path).to.be.equal(path.b));

  it(`$C ${path.c} path path should be equal to ${path.c}`, () =>
    expect($.$C.$(path.c).path).to.be.equal(path.c));
});

describe('Check Nested $C Fields computed deep check()', () => {
  it('$C check(isEmpty, deep=true) should be false', () =>
    expect($.$C.check('isEmpty', true)).to.be.false);

  it('$C check(isDirty, deep=true) should be true', () =>
    expect($.$C.check('isDirty', true)).to.be.true);

  it('$C check(isPristine, deep=true) should be false', () =>
    expect($.$C.check('isPristine', true)).to.be.false);

  it('$C check(isDefault, deep=true) should be false', () =>
    expect($.$C.check('isDefault', true)).to.be.false);

  it('$C check(hasError, deep=true) should be false', () =>
    expect($.$C.check('hasError', true)).to.be.false);
});

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
