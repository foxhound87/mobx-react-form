import { expect } from "chai";
import validatorjs from "validatorjs";
import { Form } from "../../../../src";
import { FormInterface } from "../../../../src/models/FormInterface";
import { ValidationPlugins } from "../../../../src/models/ValidatorInterface";
import dvr from "../../../../src/validators/DVR";

const plugins: ValidationPlugins = {
  dvr: dvr({ package: validatorjs })
}

const schema = {
  fields: [
    "email",
    "account",
    "account.id",
    "account.name"
  ],
  input: {
    "account.id": (value) => value === null ? '' : value
  },
  output: {
    "account.id": (value) => value === null ? '' : value
  },
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

const valuesToMatch = {
  email: "myemail@apple.com",
  account: {
    id: '',
    name: "John"
  }
}


class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        describe("Check deep isDirty:", () => {
          it("form isDirty should be false", () => expect(form.isDirty).to.be.false);
          it("account isDirty should be false", () => expect(form.$('account').isDirty).to.be.false);
        });

        describe("Check deep values:", () => {
          it("form values should be equal to form initials", () => expect(form.values()).to.be.deep.equal(form.initials()));
          it("account value should be equal valuesToMatch.account", () => expect(form.$('account').value).to.be.deep.equal(valuesToMatch.account));
          it("account values() should be equal valuesToMatch.account", () => expect(form.$('account').values()).to.be.deep.equal(valuesToMatch.account));
        });
      }
    }
  }
}

export default new NewForm(schema, { name: "$585", plugins });
