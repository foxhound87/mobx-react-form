import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";

const fields = [
  "club.name",
  "club.city",
  "members",
  "members[].firstname",
  "members[].lastname",
  "members[].hobbies",
  "members[].hobbies[]",
];

class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        form.update({
          club: {
            name: "HELLO",
            city: "NY",
          },
          members: [
            {
              firstname: "Clint",
              lastname: "Eastwood",
              hobbies: ["Soccer", "Baseball"],
            },
            {
              firstname: null,
              lastname: "Chaplin",
              hobbies: ["Golf", "Basket"],
            },
          ],
        });

        form.reset();
      },
    };
  }
}

export default new NewForm({ fields }, { name: "Nested-P" });
