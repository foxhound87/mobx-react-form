import { expect } from "chai";
import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";

export default new Form(
  {
    fields: ["custom"],
    values: {
      custom: null,
    },
    initials: {
      custom: null,
    },
    defaults: {
      custom: null,
    },
    types: {
      custom: "custom",
    },
  },
  {
    name: "Fixes-A1",
    hooks: {
      onInit(form: FormInterface) {
        describe("Check initial values state:", () => {
          // test form
          it("form $A1 isDirty should be false", () => expect(form.isDirty).to.be.false);
          it("form $A1 isPristine should be false", () => expect(form.isPristine).to.be.true);

          // test field
          it("form $A1 custom isDirty should be false", () => expect(form.$("custom").isDirty).to.be.false);
          it("form $A1 custom isPristine should be false", () => expect(form.$("custom").isPristine).to.be.true);
          it("form $A1 custom value should be null", () => expect(form.$("custom").value).to.be.null);
        });

        describe("Check custom field value change:", () => {
          before(() => form.$("custom").set(""));

          // test form
          it("form $A1 isDirty should be true", () => expect(form.isDirty).to.be.true);
          it("form $A1 isPristine should be false", () => expect(form.isPristine).to.be.false);

          // test field
          it("form $A1 custom isDirty should be true", () => expect(form.$("custom").isDirty).to.be.true);
          it("form $A1 custom isPristine should be false", () => expect(form.$("custom").isPristine).to.be.false);
          it("form $A1 custom value should be empty", () => expect(form.$("custom").value).to.eq(""));
        });

        describe("Check manually setting null value:", () => {
          before(() => form.$("custom").set(null));

          // test form
          it("form $A1 isDirty should be false", () => expect(form.isDirty).to.be.false);
          it("form $A1 isPristine should be false", () => expect(form.isPristine).to.be.true);

          // test field
          it("form $A1 custom isDirty should be false", () => expect(form.$("custom").isDirty).to.be.false);
          it("form $A1 custom isPristine should be false", () => expect(form.$("custom").isPristine).to.be.true);
          it("form $A1 custom value should be null", () => expect(form.$("custom").value).to.be.null);
        });

        describe("Check clearing form:", () => {
          before(() => {
            form.$("custom").set("test"); // set value to test clear working properly
            expect(form.$("custom").value).to.eq("test");

            form.clear();
          });

          // test form
          it("form $A1 isDirty should be false", () => expect(form.isDirty).to.be.false);
          it("form $A1 isPristine should be false", () => expect(form.isPristine).to.be.true);

          // test field
          it("form $A1 custom isDirty should be false", () => expect(form.$("custom").isDirty).to.be.false);
          it("form $A1 custom isPristine should be false", () => expect(form.$("custom").isPristine).to.be.true);
          it("form $A1 custom value should be null", () => expect(form.$("custom").value).to.be.undefined);
        });

        describe("Check resetting form:", () => {
          before(() => {
            form.$("custom").set("test"); // set value to test clear working properly
            expect(form.$("custom").value).to.eq("test");

            form.reset();
          })

          // test form
          it("form $A1 isDirty should be false", () => expect(form.isDirty).to.be.false);
          it("form $A1 isPristine should be false", () => expect(form.isPristine).to.be.true);

          // test field
          it("form $A1 custom isDirty should be false", () => expect(form.$("custom").isDirty).to.be.false);
          it("form $A1 custom isPristine should be false", () => expect(form.$("custom").isPristine).to.be.true);
          it("form $A1 custom value should be null", () => expect(form.$("custom").value).to.be.null);
        });

        describe("Check explicitly setting value:", () => {
          before(() => {
            form.$("custom").set("value", "test");
          })

          // test form
          it("form $A1 isDirty should be true", () => expect(form.isDirty).to.be.true);
          it("form $A1 isPristine should be false", () => expect(form.isPristine).to.be.false);

          // test field
          it("form $A1 custom isDirty should be true", () => expect(form.$("custom").isDirty).to.be.true);
          it("form $A1 custom isPristine should be false", () => expect(form.$("custom").isPristine).to.be.false);
          it("form $A1 custom value should be `test`", () => expect(form.$("custom").value).to.be.eq("test"));
        });

        describe("Check explicity setting value to null:", () => {
          before(() => {
            form.$("custom").set("value", null);
          })
          
          // test form
          it("form $A1 isDirty should be false", () => expect(form.isDirty).to.be.false);
          it("form $A1 isPristine should be true", () => expect(form.isPristine).to.be.true);

          // test field
          it("form $A1 custom isDirty should be false", () => expect(form.$("custom").isDirty).to.be.false);
          it("form $A1 custom isPristine should be true", () => expect(form.$("custom").isPristine).to.be.true);
          it("form $A1 custom value should be null", () => expect(form.$("custom").value).to.be.null);
        })
      },
    },
  }
);
