import { expect } from "chai";
import { Form } from "../../../src";
import { FormInterface } from "../../../src/models/FormInterface";

interface Club {
  name: string;
  city: string;
}

interface Member {
  firstname: string;
  lastname: string;
  hobbies: string[];
}

interface TestSchema {
  username: string;
  email: string;
  club: Club;
  members: Member[];
  final: string;
}

const assertPath = <T extends string>(_form: FormInterface, _path: T): void => {};

export default new Form<TestSchema>(
  {
    fields: [
      "username",
      "email",
      "club.name",
      "club.city",
      "members[].firstname",
      "members[].lastname",
      "members[].hobbies",
      "final",
    ],
  },
  {
    name: "PathsOf-W",
    options: {
      strictSelect: false,
    },
    hooks: {
      onInit(form: FormInterface) {
        describe("PathsOf - typed $() path resolution", () => {
          describe("top-level keys", () => {
            it("$('username') should resolve to the username field", () => {
              const field = form.$("username");
              field.set("john");
              expect(field.value).to.equal("john");
              expect(field.path).to.equal("username");
            });

            it("$('email') should resolve to the email field", () => {
              const field = form.$("email");
              field.set("john@test.com");
              expect(field.value).to.equal("john@test.com");
            });

            it("$('club') should resolve to the club fieldset", () => {
              const field = form.$("club");
              expect(field.path).to.equal("club");
              expect(field.fields.has("name")).to.be.true;
              expect(field.fields.has("city")).to.be.true;
            });

            it("$('final') should resolve and set value", () => {
              form.$("final").set("done");
              expect(form.$("final").value).to.equal("done");
            });
          });

          describe("nested object paths", () => {
            it("$('club.name') should resolve to the club.name field", () => {
              const field = form.$("club.name");
              field.set("FC");
              expect(field.value).to.equal("FC");
              expect(field.path).to.equal("club.name");
            });

            it("$('club.city') should resolve to the club.city field", () => {
              const field = form.$("club.city");
              field.set("Milan");
              expect(field.value).to.equal("Milan");
              expect(field.path).to.equal("club.city");
            });

            it("nested club fields should have correct values", () => {
              expect(form.$("club.name").value).to.equal("FC");
              expect(form.$("club.city").value).to.equal("Milan");
            });
          });

          describe("array member paths", () => {
            it("$('members') should resolve to the members fieldset", () => {
              const field = form.$("members");
              expect(field.path).to.equal("members");
            });

            it("$('members[0].firstname') should resolve and set after add", () => {
              form.$("members").add();
              form.$("members[0].firstname").set("Alice");
              expect(form.$("members[0].firstname").value).to.equal("Alice");
            });

            it("$('members[0].lastname') should resolve correctly", () => {
              form.$("members[0].lastname").set("Smith");
              expect(form.$("members[0].lastname").value).to.equal("Smith");
            });

            it("$('members[0].hobbies') should resolve to array field", () => {
              form.$("members[0].hobbies").set(["reading", "coding"]);
              expect(form.$("members[0].hobbies").value).to.deep.equal(["reading", "coding"]);
            });
          });

          describe("PathsOf type verification", () => {
            it("should compile with valid paths", () => {
              assertPath(form, "username");
              assertPath(form, "club.name");
              assertPath(form, "members[].firstname");
              assertPath(form, "members[].hobbies");
            });
          });

          describe("$().value type narrowing", () => {
            it("$('username') value should be string", () => {
              const val: string = form.$("username").value;
              expect(val).to.be.a("string");
            });

            it("$('final') should be accessible via single key", () => {
              form.$("final").set("complete");
              expect(form.$("final").value).to.equal("complete");
            });
          });
        });
      },
    },
  },
);
