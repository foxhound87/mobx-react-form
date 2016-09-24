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

describe('Check Nested Fields', () => {
  it('$A address.street.value should be equal to "Broadway"', () =>
    expect($.$A.$('address.street').value).to.be.equal('Broadway'));

  it('$A address.city.value should be equal to "Los Angeles"', () =>
    expect($.$A.$('address.city').value).to.be.equal('Los Angeles'));

  it('$A address.city.label should be equal to "Cool City"', () =>
    expect($.$A.$('address.city').label).to.be.equal('Cool City'));
});
