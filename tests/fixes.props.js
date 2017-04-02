import { expect } from 'chai';

import $ from './data/_.fixes'; // FORMS


describe('Check Fixes $E props check', () => {
  it('$E places options should be array', () =>
    expect($.$E.$('places').options).to.be.instanceof(Array));

  it('$E places options should have length of 3', () =>
    expect($.$E.$('places').options).to.have.lengthOf(3));
});

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

describe('Check Fixes $H props check', () => {
  it('$H items[0].name related should not be empty array', () =>
    expect($.$H.select('items[0].name').related).to.not.be.empty);

  it('$H items[0].name related should be array', () =>
    expect($.$H.select('items[0].name').related).to.be.instanceof(Array));

  it('$H items[0].name validators should be array', () =>
    expect($.$H.select('items[0].name').validators).to.be.instanceof(Array));

  it('$H items[0].name options should be array', () =>
    expect($.$H.select('items[0].name').options).to.be.instanceof(Array));
});


describe('Check Fixes $I rules check', () => {
  it('$I layout.column1[0].title rules should be a equal to "string|required"', () =>
    expect($.$I.$('layout.column1[0].title').rules).to.be.equal('string|required'));

  it('$I deep.nested.column2[0].title rules should be a equal to "string|required"', () =>
    expect($.$I.$('deep.nested.column2[0].title').rules).to.be.equal('string|required'));

  it('$I deep.nested.column3[0].title rules should be a equal to "string|required"', () =>
    expect($.$I.$('deep.nested.column3[0].title').rules).to.be.equal('string|required'));

  it('$I users[0].settings[0].name default should be a equal to "Default Name"', () =>
    expect($.$I.$('users[0].settings[0].name').default).to.be.equal('Default Name'));

  it('$I users[0].settings[0].active default should be true', () =>
    expect($.$I.$('users[0].settings[0].active').default).to.be.true);

  it('$I users[0].settings[0].name initial should be a equal to "Initial Name"', () =>
    expect($.$I.$('users[0].settings[0].name').initial).to.be.equal('Initial Name'));

  it('$I users[0].settings[0].active initial should be true', () =>
    expect($.$I.$('users[0].settings[0].active').initial).to.be.true);

  it('$I users[0].settings[0].active value should be false', () =>
    expect($.$I.$('users[0].settings[0].active').value).to.be.false);

  it('$I users[0].settings[0].bool initial should be false', () =>
    expect($.$I.$('users[0].settings[0].bool').initial).to.be.false);

  it('$I users[0].settings[0].bool value should be false', () =>
    expect($.$I.$('users[0].settings[0].bool').value).to.be.false);

  it('$I users[0].settings[0].anotherBool value should be false', () =>
    expect($.$I.$('users[0].settings[0].anotherBool').value).to.be.false);
});

