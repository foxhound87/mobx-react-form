import { expect } from "chai";
import { Form } from "../../../../src";

const form = new Form(
  {
    fields: ["time"],
    values: {
      time: null,
    },
    initials: {
      time: null,
    },
    defaults: {
      time: null,
    },
    nullable: {
      time: true,
    },
  },
  {
    name: "Fixes-A1",
  }
);


export default form;

describe("Check initial values state:", () => {
  it("form $A1 isDirty should be false", () =>
    expect(form.isDirty).to.be.false);
  it("form $A1 isPristine should be true", () =>
    expect(form.isPristine).to.be.true);
  it("form $A1 time isDirty should be false", () =>
    expect(form.$("time").isDirty).to.be.false);
  it("form $A1 time isPristine should be true", () =>
    expect(form.$("time").isPristine).to.be.true);
  it("form $A1 time value should be null", () =>
    expect(form.$("time").value).to.be.null);
  it("form $A1 time initial should be null", () =>
    expect(form.$("time").initial).to.be.null);
  it("form $A1 time nullable should be true", () =>
    expect(form.$("time").nullable).to.be.true);
});

describe("Check after set empty:", () => {
  before(() => form.$("time").set(""));

  it("form $A1 isDirty should be true", () =>
    expect(form.isDirty).to.be.true);
  it("form $A1 isPristine should be false", () =>
    expect(form.isPristine).to.be.false);
  it("form $A1 time changed should be 1", () =>
    expect(form.$("time").changed).to.be.equal(1));
  it("form $A1 time isDirty should be true", () =>
    expect(form.$("time").isDirty).to.be.true);
  it("form $A1 time isPristine should be false", () =>
    expect(form.$("time").isPristine).to.be.false);
  it("form $A1 time initial should be null", () =>
    expect(form.$("time").initial).to.be.null);
  it("form $A1 time value should be empty", () =>
    expect(form.$("time").value).to.be.empty);
  it("form $A1 custom value should be empty", () =>
    expect(form.$("time").value).to.eq(""));
});

describe("Check after set null:", () => {
  before(() => form.$("time").set(null));

  it("form $A1 isDirty should be false", () =>
    expect(form.isDirty).to.be.false);
  it("form $A1 time changed should be 2", () =>
    expect(form.$("time").changed).to.be.equal(2));
  it("form $A1 time isDirty should be false", () =>
    expect(form.$("time").isDirty).to.be.false);
  it("form $A1 time isPristine should be true", () =>
    expect(form.$("time").isPristine).to.be.true);
  it("form $A1 time value should be null", () =>
    expect(form.$("time").value).to.be.null);
});

describe("Check after clear:", () => {
  before(() => {
    form.$("time").set("test"); // set value to test clear working properly
    expect(form.$("time").value).to.eq("test");
    form.clear();
  });

  // test form
  it("form $A1 isDirty should be false", () => expect(form.isDirty).to.be.false);
  it("form $A1 isPristine should be false", () => expect(form.isPristine).to.be.true);

  // test field
  it("form $A1 time isDirty should be false", () => expect(form.$("time").isDirty).to.be.false);
  it("form $A1 time isPristine should be false", () => expect(form.$("time").isPristine).to.be.true);
  it("form $A1 time value should be null", () => expect(form.$("time").value).to.be.null);
});

describe("Check after reset:", () => {
  before(() => {
    form.$("time").set("test"); // set value to test clear working properly
    expect(form.$("time").value).to.eq("test");
    form.reset();
  });

  // test form
  it("form $A1 isDirty should be false", () => expect(form.isDirty).to.be.false);
  it("form $A1 isPristine should be false", () => expect(form.isPristine).to.be.true);

  // test field
  it("form $A1 time isDirty should be false", () => expect(form.$("time").isDirty).to.be.false);
  it("form $A1 time isPristine should be false", () => expect(form.$("time").isPristine).to.be.true);
  it("form $A1 time value should be null", () => expect(form.$("time").value).to.be.null);
});

describe("Check explicitly setting value:", () => {
  before(() => {
    form.$("time").set("value", "test");
  })

  // test form
  it("form $A1 isDirty should be true", () => expect(form.isDirty).to.be.true);
  it("form $A1 isPristine should be false", () => expect(form.isPristine).to.be.false);

  // test field
  it("form $A1 time isDirty should be true", () => expect(form.$("time").isDirty).to.be.true);
  it("form $A1 time isPristine should be false", () => expect(form.$("time").isPristine).to.be.false);
  it("form $A1 time value should be `test`", () => expect(form.$("time").value).to.be.eq("test"));
});

describe("Check explicity setting value to null:", () => {
  before(() => {
    form.$("time").set("value", null);
  })

  // test form
  it("form $A1 isDirty should be false", () => expect(form.isDirty).to.be.false);
  it("form $A1 isPristine should be true", () => expect(form.isPristine).to.be.true);

  // test field
  it("form $A1 time isDirty should be false", () => expect(form.$("time").isDirty).to.be.false);
  it("form $A1 time isPristine should be true", () => expect(form.$("time").isPristine).to.be.true);
  it("form $A1 time value should be null", () => expect(form.$("time").value).to.be.null);
})