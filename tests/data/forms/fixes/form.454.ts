import { expect } from "chai";
import { Form } from "../../../../src";
import { FormInterface } from "../../../../src/models/FormInterface";

const fields = [
  'any.type',
  'any.other'
];

const values = {
  any: {
    type: 'a',
    other: 'b',
  },
};

class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        describe("Check initial values state:", () => {
          it("form `values()` should be equal `true`", () => expect(form.values()).to.be.deep.equal(values));
          it("form any `value` should be equal `a`", () => expect(form.$('any').value).to.be.deep.equal(values.any));
          it("form any.type `value` should be equal `a`", () => expect(form.$('any.type').value).to.be.equal(values.any.type));
          it("form any.other `value` should be equal `b`", () => expect(form.$('any.other').value).to.be.equal(values.any.other));
        });

      }
    }
  }
}

export default new NewForm({ fields, values }, { name: "$454" });
