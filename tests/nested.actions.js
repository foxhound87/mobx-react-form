import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

describe('Check $A Nested Fields', () => {
  it('$A user.email.value should be equal to "notAnEmail"', () =>
    expect($.$A.$('user.email').value).to.be.equal('notAnEmail'));

  it('$A user.emailConfirm.value should be equal to "s.jobs@apple.com"', () =>
    expect($.$A.$('user.emailConfirm').value).to.be.equal('s.jobs@apple.com'));

  it('$A user.password error should be equal to "Password Invalid"', () =>
    expect($.$A.$('user.password').error).to.be.equal('Password Invalid'));

  it('$A user.password hasError should be true', () =>
    expect($.$A.$('user.password').hasError).to.be.true);

  it('$A user.password isValid should be false', () =>
    expect($.$A.$('user.password').isValid).to.be.false);
});

describe('Check $B Nested Fields', () => {
  it('$B state.city label should be equal to "City"', () =>
    expect($.$B.$('state.city').label).to.be.equal('City'));

  it('$B state.city.places value should not be empty', () =>
    expect($.$B.$('state.city.places').value).to.not.be.empty);

  it('$B state.city.places isEmpty should be false', () =>
    expect($.$B.$('state.city.places').isEmpty).to.be.false);

  it('$B state.city.places label should be equal to "NY Cool Places"', () =>
    expect($.$B.$('state.city.places').label).to.be.equal('NY Cool Places'));

  it('$B state.city.places.statueOfLiberty label should be equal to "Statue of Liberty"', () =>
    expect($.$B.$('state.city.places.statueOfLiberty').label).to.be.equal('Statue of Liberty'));

  it('$B state.city.places.statueOfLiberty value should be false', () =>
    expect($.$B.$('state.city.places.statueOfLiberty').value).to.be.false);

  it('$B state.city.places.centralPark value should be false', () =>
    expect($.$B.$('state.city.places.centralPark').value).to.be.false);

  it('$B state.city.places.empireStateBuilding value should be false', () =>
    expect($.$B.$('state.city.places.empireStateBuilding').value).to.be.false);
});

describe('Check $C Nested Fields', () => {
  it('$C state.city label should be equal to "City"', () =>
    expect($.$C.$('state.city').label).to.be.equal('City'));

  it('$C state.city value should be be object', () =>
    expect($.$C.$('state.city').value).to.be.an('object'));

  it('$C state.city value should have prop "places"', () =>
    expect($.$C.$('state.city').value).to.have.property('places'));

  it('$C state.city.places value should be object', () =>
    expect($.$C.$('state.city.places').value).to.be.an('object'));

  it('$C state.city.places value should have prop "statueOfLiberty"', () =>
    expect($.$C.$('state.city.places').value).to.have.property('statueOfLiberty'));

  it('$C state.city.places isEmpty should be false', () =>
    expect($.$C.$('state.city.places').isEmpty).to.be.false);

  it('$C state.city.places label should be equal to "NY Cool Places"', () =>
    expect($.$C.$('state.city.places').label).to.be.equal('NY Cool Places'));

  it('$C state.city.places.statueOfLiberty label should be equal to "Statue of Liberty"', () =>
    expect($.$C.$('state.city.places.statueOfLiberty').label).to.be.equal('Statue of Liberty'));

  it('$C state.city.places.statueOfLiberty value should be false', () =>
    expect($.$C.$('state.city.places.statueOfLiberty').value).to.be.false);

  it('$C state.city.places.centralPark value should be false', () =>
    expect($.$C.$('state.city.places.centralPark').value).to.be.false);

  it('$C state.city.places.empireStateBuilding value should be false', () =>
    expect($.$C.$('state.city.places.empireStateBuilding').value).to.be.false);

  const deepPropValue = 'state.fields.city.value';
  const deepPropLabel = 'state.fields.city.label';

  it(`$C get([label, value]) ${deepPropValue} should be equal to "New York"`, () =>
    expect($.$C.get(['label', 'value']))
      .to.have.deep.property(deepPropValue)
      .that.is.an('object'));

  it(`$C get([label, value]) ${deepPropLabel} should be equal to "City"`, () =>
    expect($.$C.get(['label', 'value'])).to.have.deep.property(deepPropLabel, 'City'));
});

describe('Check form.values() for Nested Fields', () => {
  const deepProp = 'state.city.places.empireStateBuilding';

  it(`$B values() ${deepProp} should be false`, () =>
    expect($.$B.values()).to.have.deep.property(deepProp, false));

  it(`$C values() ${deepProp} should be false`, () =>
    expect($.$C.values()).to.have.deep.property(deepProp, false));

  it('$C values() places.empireStateBuilding should be false', () =>
    expect($.$C.$('state.city').values())
      .to.have.deep.property('places.empireStateBuilding', false));
});

describe('Check Nested Fields path property', () => {
  const path = {
    a: 'user.email',
    b: 'state.city.places',
    c: 'state.city.places.statueOfLiberty',
  };

  it(`$A ${path.a} path path should be equal to ${path.a}`, () =>
    expect($.$A.$(path.a).path).to.be.equal(path.a));

  it(`$B ${path.b} path path should be equal to ${path.b}`, () =>
    expect($.$B.$(path.b).path).to.be.equal(path.b));

  it(`$C ${path.c} path path should be equal to ${path.c}`, () =>
    expect($.$C.$(path.c).path).to.be.equal(path.c));
});

describe('Check Nested $C Fields computed deep check()', () => {
  it('$C check(isEmpty, deep=true) should be false', () =>
    expect($.$C.check('isEmpty', true)).to.be.false);

  it('$C check(isDirty, deep=true) should be true', () =>
    expect($.$C.check('isDirty', true)).to.be.true);

  it('$C check(isPristine, deep=true) should be false', () =>
    expect($.$C.check('isPristine', true)).to.be.false);

  it('$C check(isDefault, deep=true) should be false', () =>
    expect($.$C.check('isDefault', true)).to.be.false);

  it('$C check(hasError, deep=true) should be false', () =>
    expect($.$C.check('hasError', true)).to.be.false);
});

describe('Check Nested $D props after state clear()', () => {
  it('$D state isEmpty should be false', () =>
  expect($.$D.$('state').isEmpty).to.be.false);

  it('$D state.city isEmpty should be false', () =>
  expect($.$D.$('state.city').isEmpty).to.be.false);

  it('$D state.city.places isEmpty should be false', () =>
    expect($.$D.$('state.city.places').isEmpty).to.be.false);
});

describe('Check Nested $T add() and del()', () => {
  it('$T hobbies fields.size should be equal to 3', () =>
    expect($.$T.$('hobbies').fields.size).to.equal(3));

  it('$T member.hobbies fields.size should be equal to 3', () =>
    expect($.$T.$('member.hobbies').fields.size).to.equal(3));
});

describe('Check Nested $T value on add()', () => {
  it('$T member.hobbies value should be array', () =>
    expect($.$T.$('member.hobbies').value).to.be.instanceof(Array));

  it('$T member.hobbies value should have length of 3', () =>
    expect($.$T.$('member.hobbies').value).to.have.lengthOf(3));

  it('$T member.hobbies[1] initial should be equal to "AAA"', () =>
    expect($.$T.$('member.hobbies[1]').initial).to.equal('AAA'));

  it('$T member.hobbies[1] default should be equal to "AAA"', () =>
    expect($.$T.$('member.hobbies[1]').default).to.equal('AAA'));

  it('$T member.info[1] default should be an object', () =>
    expect($.$T.$('member.info[1]').default).to.be.an('object'));

  it('$T member.info[1] initial should be an object', () =>
    expect($.$T.$('member.info[1]').initial).to.be.an('object'));

  it('$T member.info[1].firstname value should be equal to "AAA"', () =>
    expect($.$T.$('member.info[1].firstname').value).to.equal('AAA'));

  it('$T member.info[1].lastname value should be equal to "BBB"', () =>
    expect($.$T.$('member.info[1].lastname').value).to.equal('BBB'));

  it('$T notIncrementalFields fields.get(notIncrementalKey) should be an object', () =>
    expect($.$T.$('notIncrementalFields').fields.get('notIncrementalKey')).to.be.an('object'));

  it('$T notIncrementalFields[notIncrementalKey] value should be equal to "XXX"', () =>
    expect($.$T.$('notIncrementalFields[notIncrementalKey]').value).to.equal('XXX'));

  it('$T notIncrementalFields add() return value should be equal to "anotherKey"', () =>
    expect($.$T.$('notIncrementalFields').add('YYY', { key: 'anotherKey' })).to.equal('anotherKey'));
});

describe('Check $U Nested Fields', () => {
  it('$U user.email value should be equal to "notAnEmail"', () =>
    expect($.$U.$('user.email').value).to.be.equal('notAnEmail'));

  it('$U user.emailConfirm value should be equal to "s.jobs@apple.com"', () =>
    expect($.$U.$('user.emailConfirm').value).to.be.equal('s.jobs@apple.com'));
});
