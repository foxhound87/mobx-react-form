import { Form } from '../../../../src';

const fields = [
  // FIX: #282 (reserved keywords)
  'incident',
  'incident[].type',
  'incident[].value',
  'incident[].options',
  'arrayFieldA[]',
  'arrayFieldA[].id',
  'arrayFieldA[].name',
  'arrayFieldB[]',
  'arrayFieldB[].id',
  'arrayFieldB[].name',
  'arrayFieldB[].value',
];

class NewForm extends Form {

  hooks() {
    return {
      onInit() {
        // FIX: #282 (reserved keywords)
        this.$('incident').add();

        // FIX #324
        this.update({ arrayFieldA: [{ id: 1, name: 'name' }] });
        this.update({ arrayFieldB: [{ id: 1, name: 'name', value: 'some val' }] });
      },
    };
  }
}

export default new NewForm({ fields });
