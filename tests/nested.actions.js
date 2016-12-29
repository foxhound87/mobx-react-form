import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

describe('Form error test', () => {
  it('$A select() should throw error', () =>
    expect(() => $.$A.select('some.test')).to.throw(Error));

  it('$T del() should throw error', () =>
    expect(() => $.$T.$('notIncrementalFields').del(99)).to.throw(Error));
});
