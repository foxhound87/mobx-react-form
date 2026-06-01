import { expect } from 'chai';

import { FormInterface } from "../../src/models/FormInterface";
import $ from '../fixtures/_.fixes'; // FORMS
 // FORMS


describe('$L Field types checks', () => {
  it('$L email type should be equal to "email"', () =>
    expect($.$L.$('email').type).to.be.equal('email')); // #415
});
