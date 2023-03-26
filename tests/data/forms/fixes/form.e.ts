import { expect } from "chai";
import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";

const fields = [
  "places[]",
  "test",
];

const extra = {
  places: ["a", "b", "c"],
  test: {
    testExtraProp: 'test',
    testExtraFunction: () => ({
     test: 'test',
    })
  }
};

const values = {
  places: ["NY", "NJ"],
};

const hooks = {
  places: {
    onClear(fieldset) {
      it('Fixes-E $(places).clear() should call onClear() hook on fieldset',  () => {
        expect(fieldset.values()).to.deep.equal([]);
      })
    }
  }
}

class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        form.$("places").clear();

        describe("Check extra data and function:", () => {
          it("$('test') extra prop should be defined and equal 'test'", () => expect(form.$('test').extra.testExtraProp).to.be.equal('test'));
          it("$('test') extra function should not be undefined", () => expect(form.$('test').extra.testExtraFunction).to.not.be.undefined);
          it("$('test') extra function should return 'test'", () => expect(form.$('test').extra.testExtraFunction()).to.be.deep.equal({
            test: 'test'
          }));
        });
      },
    };
  }
}

export default new NewForm({ fields, values, extra, hooks }, { options: {
  removeNullishValuesInArrays: true,
}, name: "Fixes-E" });
