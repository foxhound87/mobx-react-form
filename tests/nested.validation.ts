import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

// $A
describe('$A.validate()', () => {
  it('$A.validate()', (done) => {
    $.$A.validate()
      .then((form) => {
        expect(form.validated).to.equal(1);
        expect(form.isValid).to.be.false;
        done();
      });
  });
});

describe('Check Nested $A validation', () => {
  it('$A user.emailConfirm isValid should be false', () =>
    expect($.$A.$('user.emailConfirm').isValid).to.be.false);

  it('$A user.emailConfirm error should be null', () =>
    expect($.$A.$('user.emailConfirm').error).to.be.null);
});

describe('Check Nested $U validation', () => {
  it('$U user.email value should be false', () =>
    expect($.$U.$('user.email').value).to.be.equal('notAnEmail'));

  it('$U user.emailConfirm isValid should be false', () =>
    expect($.$U.$('user.emailConfirm').isValid).to.be.false);

  it('$U user.emailConfirm error should be null', () =>
    expect($.$U.$('user.emailConfirm').error).to.be.null);
});

describe('Check Nested $E validation', () => {
  it('$E state isValid should be false', () =>
    expect($.$E.$('state').isValid).to.be.false);

  it('$E state.city isValid should be false', () =>
    expect($.$E.$('state.city').isValid).to.be.false);
});

describe('Check Nested $F validation', () => {
  it('$F state isValid should be false', () =>
    expect($.$F.$('state').isValid).to.be.false);

  it('$F state.city isValid should be false', () =>
    expect($.$F.$('state.city').isValid).to.be.false);

  it('$F state.city.places isValid should be false', () =>
    expect($.$F.$('state.city.places').isValid).to.be.false);
});

describe('Check Nested $G validation', () => {
  it('$G state isValid should be false', () =>
    expect($.$G.$('state').isValid).to.be.false);

  it('$G state.city isValid should be false', () =>
    expect($.$G.$('state.city').isValid).to.be.false);

  it('$G state.city.places isValid should be false', () =>
    expect($.$G.$('state.city.places').isValid).to.be.false);
});

describe('Check Nested $H validation', () => {
  it('$H state isValid should be false', () =>
    expect($.$H.$('state').isValid).to.be.false);

  it('$H state.city isValid should be false', () =>
    expect($.$H.$('state.city').isValid).to.be.false);

  it('$H state.city.places isValid should be false', () =>
    expect($.$H.$('state.city.places').isValid).to.be.false);
});

describe('Check Nested $M1 validation', () => {
  it('$M1 club isValid should be false', () => // F
    expect($.$M1.$('club').isValid).to.be.false);

  it('$M1 club error should be equal to', () => // ERR
    expect($.$M1.$('club').error)
      .to.be.equal('The Club is a required field'));

  it('$M1 members[0].firstname isValid should be false', () => // F
    expect($.$M1.$('members[0].firstname').isValid).to.be.false);

  it('$M1 members.0.firstname error should be equal to', () => // ERR
    expect($.$M1.$('members.0.firstname').error)
      .to.be.equal('The First Name is a required field'));

  it('$M1 members[0].lastname isValid should be true', () =>
    expect($.$M1.$('members[0].lastname').isValid).to.be.true);

  it('$M1 members[0].yearOfBirth isValid should be true', () =>
    expect($.$M1.$('members[0].yearOfBirth').isValid).to.be.true);

  it('$M1 members[1].yearOfBirth isValid should be false', () => // F
    expect($.$M1.$('members[1].yearOfBirth').isValid).to.be.false);

  it('$M1 members[1].yearOfBirth error should be equal to', () => // ERR
    expect($.$M1.$('members[1].yearOfBirth').error)
      .to.be.equal('The Year of Birth is a required field'));

  it('$M1 members[1].hobbies[0] isValid should be true', () =>
    expect($.$M1.$('members[1].hobbies[0]').isValid).to.be.true);

  it('$M1 members[1].hobbies[1] isValid should be false', () => // F
    expect($.$M1.$('members[1].hobbies[1]').isValid).to.be.false);

  it('$M1 members[1].hobbies[1] error should be equal to', () => // ERR
    expect($.$M1.$('members[1].hobbies[1]').error)
      .to.be.equal('The Hobbie is a required field'));
});

describe('Check Nested $R validation', () => {
  it('$R email isValid should be true', () =>
    expect($.$R.$('email').isValid).to.be.true);

  it('$R club.name isValid should be true', () =>
    expect($.$R.$('club.name').isValid).to.be.true);

  it('$R club.city isValid should be true', () =>
    expect($.$R.$('club.city').isValid).to.be.true);

  it('$R members[1].firstname isValid should be true', () =>
    expect($.$R.$('members[1].firstname').isValid).to.be.true);

  it('$R members[1].lastname isValid should be true', () =>
    expect($.$R.$('members[1].lastname').isValid).to.be.true);

  it('$R members[1].hobbies[0] isValid should be true', () =>
    expect($.$R.$('members[1].hobbies[1]').isValid).to.be.true);

  it('$R members[1].hobbies[1] isValid should be true', () =>
    expect($.$R.$('members[1].hobbies[1]').isValid).to.be.true);
});

describe('Check Nested $S validation', () => {
  it('$S club.name isValid should be false', () =>
    expect($.$S.$('club.name').isValid).to.be.false);

  it('$S club.city isValid should be false', () =>
    expect($.$S.$('club.city').isValid).to.be.false);

  it('$S members[1].firstname isValid should be false', () =>
    expect($.$S.$('members[1].firstname').isValid).to.be.false);

  it('$S members[1].lastname isValid should be false', () =>
    expect($.$S.$('members[1].lastname').isValid).to.be.false);

  it('$S members[1].hobbies[0] isValid should be false', () =>
    expect($.$S.$('members[1].hobbies[1]').isValid).to.be.false);

  it('$S members[1].hobbies[1] isValid should be false', () =>
    expect($.$S.$('members[1].hobbies[1]').isValid).to.be.false);
});
