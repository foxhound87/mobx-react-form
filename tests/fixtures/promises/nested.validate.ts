import { expect } from 'chai';
import { FormInterface } from "../../../src/models/FormInterface";

export default ($: Record<string, FormInterface>) => {
  describe('Nested Form validate()', () => {
    // $R
    it('$R validate() should be true', (done) => {
      $.$R.validate({ showErrors: true }).then(({ isValid, hasError }) => {
        expect(isValid).to.be.true; // eslint-disable-line
        expect(hasError).to.be.false; // eslint-disable-line
        expect($.$R.isValid).to.be.true; // eslint-disable-line
        expect($.$R.hasError).to.be.false; // eslint-disable-line
        expect($.$R.errors().email).to.be.null; // eslint-disable-line
        expect($.$R.$('email').errors()).to.be.null; // eslint-disable-line
        done();
      });
    });

    // $S
    it('$S validate() should be false', (done) => {
      $.$S.validate().then(({ isValid }) => {
        expect(isValid).to.be.false; // eslint-disable-line
        done();
      });
    });
  });
};
