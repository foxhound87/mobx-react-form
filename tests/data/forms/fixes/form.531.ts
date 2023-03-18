import { expect } from "chai";
import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";

const fields = [
  'name',
  'conditions[]',
  'conditions[].action',
  'conditions[].action.applyBy',
  'conditions[].action.amount',
]

const labels = {
  name: 'Rule Name',
  'conditions[].action.applyBy': 'Apply By',
  'conditions[].action.amount': 'Discount Amount',
}

const types = {
  'conditions[].action.amount': 'number',
}

const values = {
  name: 'someone',
  conditions: [{
    action: {
      applyBy: null,
      amount: null,
    },
  }]
}

const valuesToMatch = {
  name: 'someone',
  conditions: [{
    action: {
      applyBy: '',
      amount: 0,
    },
  }]
}


class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        describe("Check deep isDirty:", () => {
          it("form isDirty should be false", () => expect(form.isDirty).to.be.false);
          it("conditions isDirty should be false", () => expect(form.$('conditions').isDirty).to.be.false);
          it("conditions[0].action isDirty should be false", () => expect(form.$('conditions[0].action').isDirty).to.be.false);
        });

        describe("Check deep values:", () => {
          it("form values should be equal to form initials", () => expect(form.values()).to.be.deep.equal(form.initials()));
          it("conditions value should be equal values", () => expect(form.$('conditions').value).to.be.deep.equal(valuesToMatch.conditions));
          it("conditions values() should be equal values", () => expect(form.$('conditions').values()).to.be.deep.equal(valuesToMatch.conditions));
        });
      }
    }
  }
}

export default new NewForm({ fields, labels, types, values }, { name: "$531" });
