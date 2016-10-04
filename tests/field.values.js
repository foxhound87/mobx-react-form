import { expect } from 'chai';

import $ from './data'; // FORMS


describe('Field values checks', () => {
  it('$R qwerty.value should be equal to "0"', () =>
    expect($.$R.$('qwerty').value).to.be.equal(0));
});
