import { ValidationPlugins } from "./../../../../src/models/ValidatorInterface";
import validatorjs from "validatorjs";
import { Form } from "../../../../src";
import dvrExtend from "../../extension/dvr";
import { shouldBeEqualTo } from "../../extension/vjf";

import dvr from "../../../../src/validators/DVR";
import vjf from "../../../../src/validators/VJF";
import FormInterface from "../../../../src/models/FormInterface";
import OptionsModel from "../../../../src/models/OptionsModel";

const fields = ["username", "email", "password", "passwordConfirm", "terms"];

const values = {
  username: "SteveJobs",
  email: "s.jobs@apple.com",
  terms: true,
};

const defaults = {
  username: "TestUser",
};

const labels = {
  passwordConfirm: "Confirm Password",
};

const validators = {
  email: shouldBeEqualTo("username"), // should fail
};

const rules = {
  username: "email", // should fail
};

const disabled = {
  terms: true,
};

const options: OptionsModel = {
  validateOnReset: true,
  validateOnClear: true,
};

class NewForm extends Form {
  plugins(): ValidationPlugins {
    return {
      vjf: vjf(),
      dvr: dvr({
        package: validatorjs,
        extend: dvrExtend,
      }),
    };
  }

  hooks() {
    return {
      onInit(form: FormInterface) {
        form.$("username").set("label", "UserName");
        form.reset();
      },
    };
  }
}

export default new NewForm(
  {
    fields,
    values,
    defaults,
    labels,
    disabled,
    validators,
    rules,
  },
  { options, name: "Flat-P" }
);
