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
});

describe('Check form onChange hook after reset',  () => {
    // RESET TEST
    $.$V2.reset();

    it('$V2 form changed should equal 0', () =>
        expect($.$V2.changed).to.be.equal(0));

    it('$V2 form $changed should equal 0', () =>
        expect($.$V2.$changed).to.be.equal(0));

    it('$V2 user changed should equal 0', () =>
        expect($.$V2.$('user').$changed).to.be.equal(0));

    it('$V2 user.name changed should equal 0', () =>
        expect($.$V2.$('user.name').$changed).to.be.equal(0));

    it('$V2 user changed should equal 0', () =>
        expect($.$V2.$('user').changed).to.be.equal(0));

    it('$V2 user.name changed should equal 0', () =>
        expect($.$V2.$('user.name').changed).to.be.equal(0));

    it('$V2 user.id value should be empty', () =>
        expect($.$V2.$('user.id').value).to.be.empty);

    it('$V2 user.name value should be empty', () =>
        expect($.$V2.$('user.name').value).to.be.empty);

    it('$V2 test.email value should be empty', () =>
        expect($.$V2.$('test.email').value).to.be.empty);
});