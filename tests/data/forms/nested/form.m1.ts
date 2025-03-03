import { ValidationPlugins } from "./../../../../src/models/ValidatorInterface";
import * as yup from "yup";
import { Form } from "../../../../src";
import $yup from "../../../../src/validators/YUP";
import { OptionsModel } from "../../../../src/models/OptionsModel";

const fields = {
  club: null,
  members: [
    {
      firstname: null,
      lastname: "Eastwood",
      yearOfBirth: 1930,
      hobbies: ["Soccer", "Baseball"],
    },
    {
      firstname: "Charlie",
      lastname: "Chaplin",
      yearOfBirth: null,
      hobbies: ["Golf", null],
    },
  ],
};

const input = {
  "club": (value) => (value === null ? "" : value),
  "memebers[].firstname": (value) => (value === null ? "" : value),
  "memebers[].yearOfBirth": (value) => (value === null ? "" : value),
  "memebers[].hobbies[]": (value) => (value === null ? "" : value),
}

const labels = {
  club: "The Club",
  "members[]": "The Members",
  "members[].firstname": "The First Name",
  "members[].lastname": "The Last Name",
  "members[].yearOfBirth": "The Year of Birth",
  "members[].hobbies[]": "The Hobbie",
};

const schema = (y) =>
  y.object().shape({
    club: y.string().required().nullable(),
    members: y.array().of(
      y.object().shape({
        firstname: y.string().required().nullable(),
        lastname: y.string().required(),
        yearOfBirth: y.number().required().positive().integer().nullable(),
        hobbies: y.array().of(y.string().required().nullable()),
      })
    ),
  });

const plugins: ValidationPlugins = {
  yup: $yup({
    package: yup,
    schema,
  }),
};

const options: OptionsModel = {
  showErrorsOnInit: true,
};

export default new Form(
  { fields, labels, input },
  { plugins, options, name: "Nested-M1" }
);
