
import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";

const generateNewPiece = () => ({
    length: Math.floor(Math.random() * 10),
    width: Math.floor(Math.random() * 10),
    height: Math.floor(Math.random() * 10)
});

export default new Form(
    {
      fields: [
        "pieces[]",
        "pieces[].length",
        "pieces[].width",
        "pieces[].height"
      ],
      values: { pieces: [{ length: 1, width: 2, height: 3 }] }
    },
    {
      options: {
        // preserveDeletedFieldsValues: true
      },
      hooks: {
        onInit(form: FormInterface) {
            form.$("pieces").add({
                fields: generateNewPiece(),
                // values: generateNewPiece(), // EQUIVALENT
            });
        }
      }
    }
  );