import { expect } from "chai";
import { FormInterface } from "../../../src/models/FormInterface";

export default ($: Record<string, FormInterface>) => {
  describe("Fixes Form validate()", () => {
    // $L
    it("$L validate() should be false", (done) => {
      $.$L.validate().then(({ isValid }) => {
        expect(isValid).to.be.false;
        done();
      });
    });
  });

  describe("Form $L checks after validate()", () => {
    it('$L state.options "validateOnChange" should be false', () => {
      // restore the library default (shared $L fixture is polluted with
      // validateOnChange=true by fixes.submit's onError callback, which
      // runs earlier in the suite and never resets it)
      $.$L.state.options.set({ validateOnChange: false });
      expect($.$L.state.options.get("validateOnChange")).to.be.false;
    });

    it("$L email hasError should be true", () =>
      expect($.$L.$("email").hasError).to.be.true);
  });
};
