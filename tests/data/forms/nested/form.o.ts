import { Form } from "../../../../src";
import { FormInterface } from "../../../../src/models/FormInterface";

const fields = [
  "club.name",
  "club.city",
  "members",
  "members[].firstname",
  "members[].lastname",
  "members[].hobbies",
  "members[].hobbies[]",
];

const labels = {
  club: "Label Club",
  "club.name": "Label Club Name",
  "club.city": "Label Club City",
  members: "Label Members",
  "members[].firstname": "Label Member FirstName",
  "members[].lastname": "Label Member LastName",
  "members[].hobbies": "Label Member Hobby",
};

const input = {
  "club.name": (value) => value === null ? '' : value,
  "members[].firstname": (value) => value === null ? '' : value,
}

class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        form.update({
          club: {
            name: null,
            city: "New York",
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
      },
    };
  }
}

export default new NewForm({ fields, labels, input }, { name: "Nested-O" });
