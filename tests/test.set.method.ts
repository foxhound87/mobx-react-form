import { expect } from "chai";
import $methods from "./data/_.methods"; // FORMS


describe("after field set() method checks", () => {
    it('disable prop should be true', () => expect($methods.$set.$('test').disabled).to.be.true);
    it('deleted prop should be true', () => expect($methods.$set.$('test').deleted).to.be.true);
    it('type prop should be true', () => expect($methods.$set.$('test').type).to.be.equal("number"));
    it('initial prop should be equal "test"', () => expect($methods.$set.$('test').initial).to.be.equal("test"));
    it('default prop should be equal "test"', () => expect($methods.$set.$('test').default).to.be.equal("test"));
    it('label prop should be equal "test"', () => expect($methods.$set.$('test').label).to.be.equal("test"));
    it('placeholder prop should be equal "test"', () => expect($methods.$set.$('test').placeholder).to.be.equal("test"));
    it('related prop should be equal array with "test"', () => expect($methods.$set.$('test').related).to.be.deep.equal(["test"]));
  });