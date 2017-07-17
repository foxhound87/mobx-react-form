import { expect } from 'chai';

export default ($) => {
  describe('Form validate()', () => {
    // $L
    it('$L validate() should be false', (done) => {
      $.$L.validate().then(({ isValid }) => {
        expect(isValid).to.be.false; // eslint-disable-line
        done();
      });
    });

    // $M
    it('$M validate() should be false', (done) => {
      $.$M.validate().then(({ isValid }) => {
        expect(isValid).to.be.false; // eslint-disable-line
        done();
      });
    });

    // $N
    it('$N validate() should be false', (done) => {
      $.$N.validate().then(({ isValid }) => {
        expect(isValid).to.be.false; // eslint-disable-line
        done();
      });
    });

    it('$L validate(changeState = false) should be false and not change state', (done) => {
      $.$L.validate().then(() => {
        const keys = ['username', 'email', 'password'];
        const oldValues = {};
        keys.forEach((k) => { oldValues[k] = $.$L.$(k).isValid; });

        $.$L.$('username').sync('validusername');
        $.$L.$('email').sync('hello@world.com');
        $.$L.$('password').sync('validPassword');

        $.$L.validate({ changeState: false }).then(({ isValid }) => {
          expect(isValid).to.be.false; // eslint-disable-line

          keys.forEach((k) => {
            const newValue = $.$L.$(k).isValid;
            const oldValue = oldValues[k];
            expect(newValue).to.equal(oldValue);
          });

          done();
        });
      });
    });
  });
};
