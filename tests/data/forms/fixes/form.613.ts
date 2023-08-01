import validatorjs from "validatorjs";
import { expect } from "chai";
import { Form } from "../../../../src";
import { FormInterface } from "../../../../src/models/FormInterface";
import { ValidationPlugins } from "../../../../src/models/ValidatorInterface";
import DVR from "../../../../src/validators/DVR";

const plugins: ValidationPlugins = {
  dvr: DVR(validatorjs)
}

const fields = [
  "club",
  "club.name",
  "club.city"
];

const values = {
  club: {
    name: "Yellow",
    city: "Milan",
  },
};

const rules = {
  club: {
    name: "integer",
    city: "string",
  },
}

const checkDefaultErrorState = (form: FormInterface) => {
  it("form `isValid` should be equal `true`", () => expect(form.isValid).to.be.true);
  it("form `hasError` should be equal `false`", () => expect(form.hasError).to.be.false);
  it("form `isDirty` should be equal `false`", () => expect(form.isDirty).to.be.false);
  it("form `isPristine` should be equal `true`", () => expect(form.isPristine).to.be.true);
  it("form.$('club') `isValid` should be equal `true`", () => expect(form.$('club').isValid).to.be.true);
  it("form.$('club') `hasError` should be equal `false`", () => expect(form.$('club').hasError).to.be.false);
  it("form.$('club') `isPristine` should be equal `true`", () => expect(form.$('club').isPristine).to.be.true);  it("form.$('club') `isDirty` should be equal `false`", () => expect(form.$('club').isDirty).to.be.false);
  it("form.$('club') `isPristine` should be equal `true`", () => expect(form.$('club').isPristine).to.be.true);
  it("form `values` should be equal `false`", () => expect(form.values()).to.be.deep.equal(values));
  it("form `errors` should be equal `{ club: { name: null, city: null } }`", () =>
    expect(form.errors()).to.be.deep.equal({
      club: { name: null, city: null }
    }));
}

class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        describe("Check initial error state:", () => {
          checkDefaultErrorState(form);
        });

        describe("Check error state after clear:", () => {
          form.clear();
          checkDefaultErrorState(form);
        });

        describe("Check error state after reset:", () => {
          form.reset();
          checkDefaultErrorState(form);
        });
      }
    }
  }
}

export default new NewForm({ fields, values, rules }, { name: "$613", plugins, options: {
  validateOnInit: false,
  validateOnClear: false,
  validateOnReset: false,
} });
