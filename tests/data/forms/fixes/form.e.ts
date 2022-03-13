import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";

const fields = ["places[]"];

const extra = {
  places: ["a", "b", "c"],
};

const values = {
  places: ["NY", "NJ"],
};

class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        form.$("places").clear();
      },
    };
  }
}

export default new NewForm({ fields, values, extra }, { name: "Fixes-E" });
