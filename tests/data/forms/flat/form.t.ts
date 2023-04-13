import { Form } from "../../../../src";

const fields = ["username", "email", "country"];

const values = {
  username: "",
  email: "",
  country: "",
};

const defaults = {
  username: "TestUser",
  email: "s.jobs@apple.com",
  country: "USA",
};

const labels = {
  username: "User name",
  email: "Email",
  country: "Country",
};

class NewForm extends Form {
}

export default new NewForm(
  {
    fields,
    values,
    defaults,
    labels,
  },
  { name: "Flat-T" }
);
