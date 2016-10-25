import { expect } from 'chai';

import $ from './data/_.fixes'; // FORMS

describe('$A Field values checks', () => {
  it('$A qwerty value should be equal to "0"', () =>
    expect($.$A.$('qwerty').value).to.be.equal(0));
});

describe('$B Field values checks', () => {
  it('$B inventoryLevel.value value should be equal to "2"', () =>
    expect($.$B.$('inventoryLevel.value').value).to.be.equal(2));
});

describe('$C Field values checks', () => {
  it('$C itineraryItems[0].hotel.name value value should be equal to "The Plaza"', () =>
    expect($.$C.$('itineraryItems[0].hotel.name').value).to.be.equal('The Plaza'));

  it('$C itineraryItems[1].hotel.name value value should be equal to "Beverly Hills Hotel"', () =>
    expect($.$C.$('itineraryItems[1].hotel.name').value).to.be.equal('Beverly Hills Hotel'));

  it('$C itineraryItems[2].hotel.name value value should be equal to "Trump Hotel"', () =>
    expect($.$C.$('itineraryItems[2].hotel.name').value).to.be.equal('Trump Hotel'));
});

describe('$D Field values checks', () => {
  it('$D itineraryItems[0].hotel.name value value should be equal to "New Test Name"', () =>
    expect($.$D.$('itineraryItems[0].hotel.name').value).to.be.equal('New Test Name'));

  it('$D itineraryItems[1].hotel.name value value should be equal to "New Test Name"', () =>
    expect($.$D.$('itineraryItems[1].hotel.name').value).to.be.equal('New Test Name'));

  it('$D itineraryItems[2].hotel.name value value should be equal to "New Test Name"', () =>
    expect($.$D.$('itineraryItems[2].hotel.name').value).to.be.equal('New Test Name'));
});

describe('$C Form values() method checks', () => {
  const prop = {
    0: 'itineraryItems[0].hotel.name',
    1: 'itineraryItems[1].hotel.name',
    2: 'itineraryItems[2].hotel.name',
  };

  it(`$C values() ${prop[0]} should be equal to "The Plaza"`, () =>
    expect($.$C.values()).to.have.deep.property(prop[0], 'The Plaza'));

  it(`$C values() ${prop[1]} should be equal to "Beverly Hills Hotel"`, () =>
    expect($.$C.values()).to.have.deep.property(prop[1], 'Beverly Hills Hotel'));

  it(`$C values() ${prop[2]} should be equal to "Trump Hotel"`, () =>
    expect($.$C.values()).to.have.deep.property(prop[2], 'Trump Hotel'));
});

describe('$D Form values() method checks', () => {
  const prop = {
    0: '[0].hotel.name',
    1: '[1].hotel.name',
    2: '[2].hotel.name',
  };

  it(`$D values() ${prop[0]} should be equal to "New Test Name"`, () =>
    expect($.$D.$('itineraryItems').values()).to.have.deep.property(prop[0], 'New Test Name'));

  it(`$D values() ${prop[1]} should be equal to "New Test Name"`, () =>
    expect($.$D.$('itineraryItems').values()).to.have.deep.property(prop[1], 'New Test Name'));

  it(`$D values() ${prop[2]} should be equal to "New Test Name"`, () =>
    expect($.$D.$('itineraryItems').values()).to.have.deep.property(prop[2], 'New Test Name'));
});
