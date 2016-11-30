import { expect } from 'chai';

import $ from './data/_.fixes'; // FORMS

describe('Check Fixes $G props check', () => {
  it('$G items[0] label should be equal to "ItemLabel"', () =>
    expect($.$G.$('items[0]').label).to.be.equal('ItemLabel'));

  it('$G items[9] label should be equal to "ItemLabel"', () =>
    expect($.$G.$('items[9]').label).to.be.equal('ItemLabel'));

  it('$G items[10] label should be equal to "ItemLabel"', () =>
    expect($.$G.$('items[10]').label).to.be.equal('ItemLabel'));

  it('$G items[20] label should be equal to "ItemLabel"', () =>
    expect($.$G.$('items[20]').label).to.be.equal('ItemLabel'));

  it('$G items[0].name label should be equal to "ItemsNameLabel"', () =>
    expect($.$G.$('items[0].name').label).to.be.equal('ItemsNameLabel'));

  it('$G items[9].name label should be equal to "ItemsNameLabel"', () =>
    expect($.$G.$('items[9].name').label).to.be.equal('ItemsNameLabel'));

  it('$G items[10].name label should be equal to "ItemsNameLabel"', () =>
    expect($.$G.$('items[10].name').label).to.be.equal('ItemsNameLabel'));

  it('$G items[20].name label should be equal to "ItemsNameLabel"', () =>
    expect($.$G.$('items[20].name').label).to.be.equal('ItemsNameLabel'));
});

describe('Check Fixes $H value computed check', () => {
  it('$H items[0].alternateName label should be equal to "Alternate Name Label"', () =>
    expect($.$H.select('items[0].alternateName').label).to.be.equal('Alternate Name Label'));

  it('$H items[2].alternateName label should be equal to "Alternate Name Label"', () =>
    expect($.$H.select('items[2].alternateName').label).to.be.equal('Alternate Name Label'));
});

