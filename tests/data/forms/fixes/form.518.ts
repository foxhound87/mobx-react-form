import { expect } from "chai";
import validatorjs from "validatorjs";
import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";
import { ValidationPlugins } from "../../../../src/models/ValidatorInterface";
import dvr from "../../../../src/validators/DVR";

const plugins: ValidationPlugins = {
  dvr: dvr(validatorjs)
}

const struct = [
  'any.type',
  'any.other'
];

const labels = {
  any: {
    type: 'Type',
    other: 'Other',
  },
}

const values = {
  any: {
    type: 'x',
    other: 'y',
  },
};

const disabled = {
  any: {
    type: false,
    other: true,
  }
}

const rules = {
  any: {
    type: 'integer',
    other: 'integer',
  }
}

const errorMessageForAnyTypeField = 'The Type must be an integer.';

class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        describe("Check initial values state:", () => {
          it("form isValid should be false", () => expect(form.isValid).to.be.equal(false));
          it("form hasError should be false", () => expect(form.hasError).to.be.equal(true));

          it("form `$('any.other').isValid` should be true", () => expect(form.$('any.other').isValid).to.be.equal(true));
          it("form `$('any.type').isValid` should be false", () => expect(form.$('any.type').isValid).to.be.equal(false));

          it("form `$('any.type').value` should be `x`", () => expect(form.$('any.type').value).to.be.equal('x'));
          it("form `$('any.other').value` should be `y`", () => expect(form.$('any.other').value).to.be.equal('y'));

          it("form `$('any.other')` should be disabled", () => expect(form.$('any.other').disabled).to.be.equal(true));
          it("form `$('any.type')` should be disabled", () => expect(form.$('any.type').disabled).to.be.equal(false));

          it("form `$('any.other').error` should be true", () => expect(form.$('any.other').error).to.be.equal(null));
          it("form `$('any.type').error` should be false", () => expect(form.$('any.type').error).to.be.equal(errorMessageForAnyTypeField));

          it("form `values()` should not have disabled field `other`", () => expect(form.values()).to.be.deep.equal({
            any: {
              type: 'x'
              // other: 'y, // should be unfedined
            }
          }));

          it("form `errors()` should not have disabled field `other`", () => expect(form.errors()).to.be.deep.equal({
            any: {
              type: errorMessageForAnyTypeField,
              // other: null, // should be unfedined
            }
          }));
        });
      }
    }
  }
}

export default new NewForm({ struct, values, rules, disabled, labels }, { name: "$518", plugins, options: {
  showErrorsOnInit: true,
  retrieveOnlyEnabledFieldsValues: true,
  retrieveOnlyEnabledFieldsErrors: true,
  validateDisabledFields: false,
  validateDeletedFields: false,
} });
