import { expect } from 'chai';

import $ from './data/_.fixes'; // FORMS

describe('Field values checks', () => {
  it('$A qwerty value should be equal to "0"', () =>
    expect($.$A.$('qwerty').value).to.be.equal(0));
});

describe('Field values checks', () => {
  it('$B inventoryLevel.value value should be equal to "2"', () =>
    expect($.$B.$('inventoryLevel.value').value).to.be.equal(2));
});

