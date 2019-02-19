import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

describe('Form performance', () => {

  it('DVR enabled', () => {
    const t0 = Date.now();

    $.$Z.submit();
    const span = Date.now() - t0;
    expect(span).lessThan(5000);
  });

});
