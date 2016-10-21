import { expect } from 'chai';

import $ from './data/_.fixes'; // FORMS

describe('Field values checks', () => {
  it('$A options().loadingMessage should be equal to "Custom Loading Message..."', () =>
    expect($.$A.options().loadingMessage).to.be.equal('Custom Loading Message...'));

  it('$A options(loadingMessage) should be equal to "Custom Loading Message..."', () =>
    expect($.$A.options('loadingMessage')).to.be.equal('Custom Loading Message...'));
});
