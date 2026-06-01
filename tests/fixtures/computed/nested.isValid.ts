import { expect } from 'chai';
import { FormInterface } from "../../../src/models/FormInterface";

export default ($: Record<string, FormInterface>) => {
  describe('Nested Form isValid', () => {
    it('$A isValid should be false', () => expect($.$A.isValid).to.be.false);
    it('$R isValid should be true', () => expect($.$R.isValid).to.be.true);
    it('$S isValid should be false', () => expect($.$S.isValid).to.be.false);
    it('$U isValid should be false', () => expect($.$U.isValid).to.be.false);
  });
};
