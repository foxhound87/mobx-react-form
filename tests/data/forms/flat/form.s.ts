import { ValidationPlugins } from "./../../../../src/models/ValidatorInterface";
import validatorjs from "validatorjs";
import MobxReactForm from "../../../../src";
import dvr from "../../../../src/validators/DVR";
import { OptionsModel } from "../../../../src/models/OptionsModel";

const fields = {
  email: {
    label: "Email",
    value: "",
    rules: "required|email",
  },
};

class NewForm extends MobxReactForm {
  options(): OptionsModel {
    return {
      validateOnInit: true,
      showErrorsOnInit: true,
    };
  }

  plugins(): ValidationPlugins {
    return {
      dvr: dvr({ package: validatorjs }),
    };
  }
}

export default new NewForm({ fields }, { name: "Flat-S" });
