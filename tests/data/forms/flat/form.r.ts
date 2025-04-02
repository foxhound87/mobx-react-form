import { ValidationPlugins } from "./../../../../src/models/ValidatorInterface";
import { FieldConstructor } from "./../../../../src/models/FieldInterface";
import MobxReactForm, { Field } from "../../../../src";
import { isEmail, shouldBeEqualTo } from "../../extension/vjf";
import vjf from "../../../../src/validators/VJF";
import { FormInterface } from "../../../../src/models/FormInterface";
import { OptionsModel } from "../../../../src/models/OptionsModel";

const fields = {
  email: {
    label: "Username",
    value: "s.jobs@apple.com",
    validators: [isEmail],
    related: ["emailConfirm"],
    autoComplete: "on",
  },
  emailConfirm: {
    label: "Email",
    value: "s.jobs@apple.com",
    validators: [isEmail, shouldBeEqualTo("email")],
  },
};

class NewField extends Field {
  newFieldProp = false;

  constructor(data: FieldConstructor) {
    super(data);

    this.newFieldProp = true;
  }
}

class NewForm extends MobxReactForm {
  makeField(data: FieldConstructor) {
    return new NewField(data);
  }

  options(): OptionsModel {
    return {
      validateOnChange: true,
    };
  }

  plugins(): ValidationPlugins {
    return {
      xyz: vjf(), // custom xyz plugin
    };
  }

  hooks() {
    return {
      onInit(form: FormInterface) {
        form.update({
          email: "invalid",
        });
      },
    };
  }
}

export default new NewForm({ fields }, { name: "Flat-R" });
