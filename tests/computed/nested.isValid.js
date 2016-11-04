import { expect } from 'chai';

export default ($) => {
  describe('Nested Form isValid', () => {
    it('$R isValid should be true', () => expect($.$R.isValid).to.be.true);
    it('$S isValid should be false', () => expect($.$S.isValid).to.be.false);
  });
};
