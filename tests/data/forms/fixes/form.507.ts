import { Form } from "../../../../src";

const fields = ["people", "people[]", "people[].name", "people[].birthday"];

const types = {
  "people[].birthday": "date",
};

const values = {
  people: [
    {
      name: "adam",
      birthday: null,
    },
  ],
};

class NewForm extends Form {}

export default new NewForm({ fields, types, values }, { name: "$507" });
