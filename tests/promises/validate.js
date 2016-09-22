import { expect } from 'chai';

// ⁄it('$N isValid should be false', () => expect($.$N.isValid).to.be.false);

export default ($) => {
  describe('Form validate()', () => {
    // $L
    it('$L validate() should be false', (done) => {
      $.$L.validate().then((isValid) => {
        expect(isValid).to.be.false; // eslint-disable-line
        done();
      });
    });

    // $M
    it('$M validate() should be false', (done) => {
      $.$M.validate().then((isValid) => {
        expect(isValid).to.be.false; // eslint-disable-line
        done();
      });
    });

    // $N
    it('$N validate() should be false', (done) => {
      $.$N.validate().then((isValid) => {
        expect(isValid).to.be.false; // eslint-disable-line
        done();
      });
    });
  });
};
