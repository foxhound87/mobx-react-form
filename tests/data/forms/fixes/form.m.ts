import validatorjs from "validatorjs";
import { Form } from "../../../../src";
import { OptionsModel } from "../../../../src/models/OptionsModel";
import { ValidationPlugins } from "../../../../src/models/ValidatorInterface";
import dvr from "../../../../src/validators/DVR";

const fields = [
  "jobs",
  "jobs[].jobId",
  "jobs[].companyName",
  "number",
  "people[].name",
  "array[].name",
  "items[].name",
];

const input = {
  'people[].name': (value) => value === null ? '' : value,
  "array[].name": (value) => value === null ? '' : value,
}

const values = {
  jobs: [],
  number: 1,
  people: [
    {
      name: "bob",
    },
  ],
  array: [
    {
      name: "bob",
    },
  ],
  items: [
    {
      name: "bob",
    },
  ],
};

const rules = {
  "jobs[].companyName": "required|string|between:3,75",
};

const plugins: ValidationPlugins = {
  dvr: dvr({ package: validatorjs }),
};

class NewForm extends Form {
  options(): OptionsModel {
    return {
      validateOnChange: true,
    };
  }

  hooks() {
    return {
      onInit() {
        this.$("jobs").add({
          jobId: 1,
          companyName: "x",
        });

        this.$("number").set(0);

        this.$("people").set([{ name: null }]);

        this.$("items").set("value", [{ name: 0 }]);

        this.update({
          array: [{ name: null }, { name: null }, { name: null }],
        });
      },
    };
  }
}

export default new NewForm(
  { fields, values, rules, input },
  { plugins, name: "Fixes-M" }
);
