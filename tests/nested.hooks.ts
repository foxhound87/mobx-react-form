import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

describe('Check form onChange hook', () => {
    it('$V form changed should equal form $changed', () =>
        expect($.$V.changed).to.be.equal($.$V.$changed));

    it('$V form changed should equal 3', () =>
        expect($.$V.changed).to.be.equal(4));

    it('$V user changed should equal 3', () =>
        expect($.$V.$('user').changed).to.be.equal(3));

    it('$V user.name changed should equal 2', () =>
        expect($.$V.$('user.name').changed).to.be.equal(2));

    it('$V test changed should equal 1', () =>
        expect($.$V.$('test').changed).to.be.equal(1));

    it('$V test.email changed should equal 1', () =>
        expect($.$V.$('test.email').changed).to.be.equal(1));

    it('$V user.id value should equal "user-id"', () =>
        expect($.$V.$('user.id').value).to.be.equal('user-id'));

    it('$V user.name value should be equal "user-changed"', () =>
      expect($.$V.$('user.name').value).to.be.equal('user-changed'));

    it('$V test.email value should be equal "test@email"', () =>
        expect($.$V.$('test.email').value).to.be.equal('test@email'));

    it('$V user.name disabled should be true', () =>
        expect($.$V.$('user.name').disabled).to.be.true);

    it('$V user.name ref should be equal "ref"', () =>
        expect($.$V.$('user.name').ref).to.be.equal("ref"));
});

describe('Check form onChange hook after reset',  () => {
    // RESET TEST
    $.$V2.reset();

    it('$V2 form changed should equal 0', () =>
        expect($.$V2.changed).to.be.equal(0));

    it('$V2 form $changed should equal 0', () =>
        expect($.$V2.$changed).to.be.equal(0));

    it('$V2 user $changed should equal 0', () =>
        expect($.$V2.$('user').$changed).to.be.equal(0));

    it('$V2 user changed should equal 0', () =>
        expect($.$V2.$('user').changed).to.be.equal(0));

    it('$V2 user.name $changed should equal 0', () =>
        expect($.$V2.$('user.name').$changed).to.be.equal(0));

    it('$V2 user.name changed should equal 0', () =>
        expect($.$V2.$('user.name').changed).to.be.equal(0));

    it('$V2 user.id value should be empty', () =>
        expect($.$V2.$('user.id').value).to.be.empty);

    it('$V2 user.name value should be empty', () =>
        expect($.$V2.$('user.name').value).to.be.empty);

    it('$V2 test.email value should be empty', () =>
        expect($.$V2.$('test.email').value).to.be.empty);
});

describe('Check form onAdd hook after add/del',  () => {
    it('$V3 form changed should equal form $changed', () =>
        expect($.$V3.changed).to.be.equal($.$V3.$changed));

    it('$V3 form changed should equal 7', () =>
        expect($.$V3.changed).to.be.equal(8));

    it('$V3 form $changed should equal 7', () =>
        expect($.$V3.$changed).to.be.equal(8));

    it('$V3 user $changed should equal 1', () =>
        expect($.$V3.$('user').$changed).to.be.equal(1)); //

    it('$V3 user changed should equal 1', () =>
        expect($.$V3.$('user').changed).to.be.equal(2)); //

    it('$V3 user[0].name $changed should equal 1', () =>
        expect($.$V3.$('user[0].name').$changed).to.be.equal(1));

    it('$V3 user[0].name changed should equal 1', () =>
        expect($.$V3.$('user[0].name').changed).to.be.equal(1));

    it('$V3 user[0].name value should equal "user-changed"', () =>
        expect($.$V3.$('user[0].name').value).to.be.equal('user-changed'));

    it('$V3 account[0].id value should equal "account-id"', () =>
        expect($.$V3.$('account[0].id').value).to.be.equal('account-id'));

    it('$V3 account size should equal 1', () =>
        expect($.$V3.$('account').size).to.be.equal(1));

    it('$V3 test should be undefined', () =>
        expect(() => $.$V3.$('test')).to.throw(Error));

    it('$V3 final value should equal "final-value"', () =>
        expect($.$V3.$('final').value).to.be.equal('final-value'));

});

describe('Check onChange hook after updating nested field',  () => {
    it('$V4 form changed should equal form $changed', () =>
        expect($.$V4.changed).to.be.equal($.$V4.$changed));

    it('$V4 form changed should equal 2', () =>
        expect($.$V4.changed).to.be.equal(2));

    it('$V4 form $changed should equal 2', () =>
        expect($.$V4.$changed).to.be.equal(2));

    it('$V4 user changed should equal 2', () =>
        expect($.$V4.$('user').changed).to.be.equal(2));

    it('$V4 user.email changed should equal 1', () =>
        expect($.$V4.$('user.email').changed).to.be.equal(1));

    it('$V4 user.id changed should equal 1', () =>
        expect($.$V4.$('user.id').changed).to.be.equal(1));

    it('$V4 user.id value should equal 1', () =>
        expect($.$V4.$('user.id').value).to.be.equal(1));

    it('$V4 user.email value should equal "user@email"', () =>
        expect($.$V4.$('user.email').value).to.be.equal("user@email"));
});