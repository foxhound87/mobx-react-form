/**
  METHODS
*/
import { FormInterface } from "../../src/models/FormInterface";
import $set from "./methods/form.set";

const forms: Record<string, FormInterface> = {
  $set,
};

export default forms;
