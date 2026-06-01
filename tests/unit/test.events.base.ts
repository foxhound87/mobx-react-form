import { expect } from "chai";
import { Form } from "../../src";

describe("Base Event Handlers", () => {
  describe("onClear", () => {
    let form: Form;

    beforeEach(() => {
      form = new Form(
        {
          fields: {
            username: {
              label: "Username",
              value: "test-user",
            },
            email: {
              label: "Email",
              value: "test@test.com",
            },
          },
        },
        { name: "ClearTest" },
      );
    });

    it("should clear field values when invoked with event", () => {
      const event = { preventDefault: () => {} };
      form.onClear(event);
      expect(form.$("username").value).to.be.empty;
      expect(form.$("email").value).to.be.empty;
    });

    it("should work without event argument", () => {
      form.onClear();
      expect(form.$("username").value).to.be.empty;
    });
  });

  describe("onReset", () => {
    let form: Form;

    beforeEach(() => {
      form = new Form(
        {
          fields: {
            username: {
              label: "Username",
              value: "initial-user",
            },
            email: {
              label: "Email",
              value: "initial@email.com",
            },
          },
        },
        { name: "ResetTest" },
      );
      form.$("username").set("changed-user");
    });

    it("should reset field values to initial", () => {
      const event = { preventDefault: () => {} };
      form.onReset(event);
      expect(form.$("username").value).to.equal("initial-user");
      expect(form.$("email").value).to.equal("initial@email.com");
    });

    it("should work without event argument", () => {
      form.$("username").set("modified");
      form.onReset();
      expect(form.$("username").value).to.equal("initial-user");
    });
  });

  describe("onSubmit", () => {
    let form: Form;

    beforeEach(() => {
      form = new Form(
        {
          fields: {
            username: {
              label: "Username",
              value: "test-user",
            },
          },
        },
        { name: "SubmitTest" },
      );
    });

    it("should call submit as part of the handler result", () => {
      const event = { preventDefault: () => {} };
      const result = form.onSubmit(event);
      expect(result).to.be.an("array");
      expect(form.submitted).to.equal(1);
    });

    it("should work without event argument", () => {
      const result = form.onSubmit();
      expect(result).to.be.an("array");
      expect(form.submitted).to.equal(1);
    });

    it("should not call default submit when custom handler is provided via form config", () => {
      const handlerForm = new Form(
        {
          fields: {
            test: { label: "Test", value: "val" },
          },
        },
        {
          name: "HandlerSubmit",
          handlers: {
            onSubmit: (f: any) => () => {},
          },
        },
      );
      const result = handlerForm.onSubmit({ preventDefault: () => {} });
      expect(result).to.be.an("array");
      expect(handlerForm.submitted).to.equal(0);
    });
  });

  describe("onAdd", () => {
    let form: Form;

    beforeEach(() => {
      form = new Form(
        {
          fields: ["items", "items[].name"],
        },
        { name: "AddTest" },
      );
    });

    it("should add a field to form when invoked on the form", () => {
      const initialSize = form.fields.size;
      const event = { preventDefault: () => {} };
      const result = form.onAdd(event, { name: "New Item" });
      expect(result).to.be.an("array");
      expect(form.fields.size).to.equal(initialSize + 1);
    });

    it("should add a field when invoked on the items field", () => {
      const initialSize = form.$("items").fields.size;
      const event = { preventDefault: () => {} };
      const result = form.$("items").onAdd(event, { name: "New Item" });
      expect(result).to.be.an("array");
      expect(form.$("items").fields.size).to.equal(initialSize + 1);
    });

    it("should add a field with null value when called on items field", () => {
      const initialSize = form.$("items").fields.size;
      const event = { preventDefault: () => {} };
      form.$("items").onAdd(event);
      expect(form.$("items").fields.size).to.equal(initialSize + 1);
    });
  });

  describe("onDel", () => {
    let form: Form;

    beforeEach(() => {
      form = new Form(
        {
          fields: ["items", "items[].name"],
          values: {
            items: [{ name: "Item 1" }, { name: "Item 2" }],
          },
        },
        { name: "DelTest" },
      );
    });

    it("should delete a field when invoked with event and path", () => {
      const initialSize = form.$("items").fields.size;
      const event = { preventDefault: () => {} };
      form.onDel(event, "items.0");
      expect(form.$("items").fields.size).to.equal(initialSize - 1);
    });

    it("should delete using instance path when event is passed as path", () => {
      const itemField = form.$("items.0");
      const initialSize = form.$("items").fields.size;
      const event = { preventDefault: () => {} };
      itemField.onDel(event);
      expect(form.$("items").fields.size).to.equal(initialSize - 1);
    });
  });

  describe("Event handler return values", () => {
    let form: Form;

    beforeEach(() => {
      form = new Form(
        { fields: { test: { label: "Test", value: "val" } } },
        { name: "ReturnTest" },
      );
    });

    it("onClear should return an array", () => {
      const result = form.onClear({ preventDefault: () => {} });
      expect(result).to.be.an("array");
    });

    it("onReset should return an array", () => {
      const result = form.onReset({ preventDefault: () => {} });
      expect(result).to.be.an("array");
    });

    it("onSubmit should return an array", () => {
      const result = form.onSubmit({ preventDefault: () => {} });
      expect(result).to.be.an("array");
    });

    it("onAdd should return an array", () => {
      const result = form.onAdd({ preventDefault: () => {} }, {});
      expect(result).to.be.an("array");
    });

    it("onDel should return an array", () => {
      const delForm = new Form(
        {
          fields: ["items", "items[].name"],
          values: { items: [{ name: "test" }] },
        },
        { name: "DelReturn" },
      );
      const result = delForm.onDel({ preventDefault: () => {} }, "items.0");
      expect(result).to.be.an("array");
    });
  });

  describe("Form hooks integration", () => {
    it("should call onInit hook on form creation", () => {
      let initCalled = false;
      const hookForm = new Form(
        {
          fields: {
            test: { label: "Test", value: "val" },
          },
        },
        {
          name: "HookInit",
          hooks: {
            onInit: () => {
              initCalled = true;
            },
          },
        },
      );
      expect(initCalled).to.be.true;
    });

    it("should call onReset hook via onReset event handler", () => {
      let resetHookCalled = false;
      const hookForm = new Form(
        {
          fields: {
            test: { label: "Test", value: "val" },
          },
        },
        {
          name: "HookReset",
          hooks: {
            onReset: () => {
              resetHookCalled = true;
            },
          },
        },
      );
      hookForm.onReset({ preventDefault: () => {} });
      expect(resetHookCalled).to.be.true;
    });

    it("should call onClear hook via onClear event handler", () => {
      let clearHookCalled = false;
      const hookForm = new Form(
        {
          fields: {
            test: { label: "Test", value: "val" },
          },
        },
        {
          name: "HookClear",
          hooks: {
            onClear: () => {
              clearHookCalled = true;
            },
          },
        },
      );
      hookForm.onClear({ preventDefault: () => {} });
      expect(clearHookCalled).to.be.true;
    });
  });
});
