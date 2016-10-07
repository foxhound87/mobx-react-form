import { expect } from 'chai';

import $ from './data/_.fixes'; // FORMS

describe('Field values checks', () => {
  it('$A qwerty.value should be equal to "0"', () =>
    expect($.$A.$('qwerty').value).to.be.equal(0));
});
