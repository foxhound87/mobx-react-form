import { expect } from "chai";
import validatorjs from "validatorjs";
import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";
import { ValidationPlugins } from "../../../../src/models/ValidatorInterface";
import dvr from "../../../../src/validators/DVR";

const plugins: ValidationPlugins = {
  dvr: dvr(validatorjs)
}

const schema = {
  fields: ["email"],
  labels: { email: "Email" },
  rules: { email: "required|email|string|between:5,25" },
  values: {
    email: "myemail@apple.com",
    account: {
      id: null,
      name: "John"
    }
  }
};


class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        describe("Check deep isDirty:", () => {
          it("form isDirty should be false", () => expect(form.isDirty).to.be.false);
          it("account isDirty should be false", () => expect(form.$('account').isDirty).to.be.false);
          it("account value should be equal schema.values.account", () => expect(form.$('account').value).to.be.deep.equal(schema.values.account));
          it("account values() should be equal schema.values.account", () => expect(form.$('account').values()).to.be.deep.equal(schema.values.account));
        });
      }
    }
  }
}

export default new NewForm(schema, { name: "$585", plugins });
