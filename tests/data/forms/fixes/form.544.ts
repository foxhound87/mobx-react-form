import { expect } from "chai";
import { Form } from "../../../../src";
import { FormInterface } from "../../../../src/models/FormInterface";


const fields = {
  test: ['', '', 'x']
}

class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        describe("Check initial values:", () => {
          it("`values()` should be equal `['', '', 'x']`", () =>
            expect(form.values()).to.be.deep.equal({
              test: ['', '', 'x']
            }));

          it("`test.value` should be equal `['', '', 'x']`", () =>
            expect(form.$('test').value).to.be.deep.equal(['', '', 'x']));
        });
      }
    }
  }
}

export default new NewForm({ fields }, { name: "$544", options: {
  removeNullishValuesInArrays: false
} });
