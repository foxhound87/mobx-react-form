import { expect } from "chai";
import validatorjs from "validatorjs";
import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";
import { ValidationPlugins } from "../../../../src/models/ValidatorInterface";
import dvr from "../../../../src/validators/DVR";

const plugins: ValidationPlugins = {
  dvr: dvr(validatorjs)
}

// const struct = [
//   'suitability',
//   'suitability.project_completion',
//   'suitability.answers',
//   'suitability.answers.q1',
// ];

const fields = [{
  name: 'suitability',
  label: 'Suitability',
  value: 'hello',
  fields: [{
    name: 'project_completion',
    label: 'Project Completion',
  }, {
    name: 'answers',
    labels: 'Answers',
    fields: [{
      name: 'q1',
      label: 'Question 1',
      rules: 'required'
    }]
  }]
}];


class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        describe("Check deep validation:", () => {
          it("form isValid should be false", () =>
            expect(form.isValid).to.be.false);
        });

        describe("Check deep label:", () => {
          it("field `suitability` label should be `Question 1`", () =>
            expect(form.$('suitability').label).to.be.equal('Suitability'));

          it("field `suitability.project_completion` label should be `Question 1`", () =>
            expect(form.$('suitability.project_completion').label).to.be.equal('Project Completion'));

          it("field `suitability.project_completion.q1` label should be `Question 1`", () =>
            expect(form.$('suitability.answers.q1').label).to.be.equal('Question 1'));

          it("field `suitability.project_completion.q1` isValid should be `false`", () =>
            expect(form.$('suitability.answers.q1').isValid).to.be.false);

          it("field `suitability.project_completion.q1` error should be `Question 1 is required`", () =>
            expect(form.$('suitability.answers.q1').error).to.be.equal('The Question 1 field is required.'));
        });

        describe("Check deep values():", () => {
          it("form values() should be equal to...", () =>
            expect(form.values()).to.be.deep.equal({
              suitability: {
                project_completion: '',
                answers: {
                  q1: ''
                }
              }
            }));
        });
      }
    }
  }
}

export default new NewForm({ fields }, { name: "$376", plugins, options: {
  showErrorsOnInit: true
} });
