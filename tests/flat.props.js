import { expect } from 'chai';

import $ from './data/_.flat'; // FORMS


describe('Check Flat $R extended field prop', () => {
  it('$R email should have property newFieldProp', () =>
    expect($.$R.$('email')).to.have.property('newFieldProp'));

  it('$R email newFieldProp should be true', () =>
    expect($.$R.$('email').newFieldProp).to.be.true);
});
