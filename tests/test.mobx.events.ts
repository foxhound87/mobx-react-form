import { expect } from "chai";
import { Form } from "../src";

describe("MOBX Events (observe/intercept/dispose)", () => {
  describe("observe", () => {
    let form: Form;
    let field: any;

    beforeEach(() => {
      form = new Form(
        { fields: { test: { label: "Test", value: "initial" } } },
        { name: "ObserveTest" },
      );
      field = form.$("test");
    });

    it("should register an observer on value changes", () => {
      let observed = false;
      field.observe(() => {
        observed = true;
      });

      field.set("changed");
      expect(observed).to.be.true;
    });

    it("should receive change object with newValue", () => {
      let newVal: any;
      field.observe(({ change }: any) => {
        newVal = change.newValue;
      });

      field.set("new-value");
      expect(newVal).to.equal("new-value");
    });

    it("should pass form reference in callback", () => {
      let ref: any;
      field.observe(({ form: f }: any) => {
        ref = f;
      });

      field.set("changed");
      expect(ref).to.equal(form);
    });

    it("should accept function directly as callback", () => {
      let called = false;
      field.observe(() => {
        called = true;
      });

      field.set("changed");
      expect(called).to.be.true;
    });

    it("should observe $value changes specifically", () => {
      let observed = false;
      field.MOBXEvent({
        type: "observer",
        prop: "value",
        call: () => {
          observed = true;
        },
      });

      field.set("changed");
      expect(observed).to.be.true;
    });
  });

  describe("intercept", () => {
    let form: Form;
    let field: any;

    beforeEach(() => {
      form = new Form(
        { fields: { test: { label: "Test", value: "initial" } } },
        { name: "InterceptTest" },
      );
      field = form.$("test");
    });

    it("should intercept value changes", () => {
      let intercepted = false;
      field.intercept(() => {
        intercepted = true;
        return null; // Intercept handlers should return nothing or a change object
      });

      field.set("changed");
      expect(intercepted).to.be.true;
    });

    it("should accept function directly as callback", () => {
      let called = false;
      field.intercept(() => {
        called = true;
        return null;
      });

      field.set("blocked");
      expect(called).to.be.true;
    });

    it("should pass form reference in callback", () => {
      let ref: any;
      field.intercept(() => {
        ref = form;
        return null;
      });

      field.set("changed");
      expect(ref).to.equal(form);
    });

    it("should intercept via MOBXEvent with prop", () => {
      let intercepted = false;
      field.MOBXEvent({
        type: "interceptor",
        prop: "value",
        call: () => {
          intercepted = true;
          return null;
        },
      });

      field.set("new-value");
      expect(intercepted).to.be.true;
    });
  });

  describe("dispose", () => {
    let form: Form;

    beforeEach(() => {
      form = new Form(
        { fields: { test: { label: "Test", value: "initial" } } },
        { name: "DisposeTest" },
      );
    });

    it("disposeAll should clean all disposers", () => {
      form.$("test").MOBXEvent({
        type: "observer",
        call: () => {},
      });
      form.$("test").MOBXEvent({
        type: "interceptor",
        call: () => null,
      });

      expect(Object.keys(form.state.disposers.observer).length).to.be.greaterThan(0);
      expect(Object.keys(form.state.disposers.interceptor).length).to.be.greaterThan(0);

      form.dispose();

      expect(Object.keys(form.state.disposers.observer).length).to.equal(0);
      expect(Object.keys(form.state.disposers.interceptor).length).to.equal(0);
    });

    it("interceptors key uses $value prefix for observable props", () => {
      form.$("test").MOBXEvent({
        type: "interceptor",
        prop: "value",
        call: () => null,
      });

      // For interceptors on observable props, key format is $value@path
      const key = "$value@" + form.$("test").path;
      expect(form.state.disposers.interceptor).to.have.property(key);
    });

    it("observer key uses value prefix without $", () => {
      form.$("test").MOBXEvent({
        type: "observer",
        prop: "value",
        call: () => {},
      });

      // For observers on value, key format is value@path (no $ prefix)
      const key = "value@" + form.$("test").path;
      expect(form.state.disposers.observer).to.have.property(key);
    });

    it("observer and interceptor state should be separate", () => {
      form.$("test").MOBXEvent({
        type: "observer",
        call: () => {},
      });
      form.$("test").MOBXEvent({
        type: "interceptor",
        call: () => null,
      });

      expect(form.state.disposers).to.have.property("observer");
      expect(form.state.disposers).to.have.property("interceptor");
    });

    it("should handle disposing with a path", () => {
      const nestedForm = new Form(
        {
          fields: {
            test: {
              label: "Test",
              value: "initial",
            },
          },
        },
        { name: "NestedDispose" },
      );

      nestedForm.$("test").MOBXEvent({
        type: "observer",
        prop: "value",
        call: () => {},
      });

      const key = "value@" + nestedForm.$("test").path;
      expect(nestedForm.state.disposers.observer).to.have.property(key);
    });
  });

  describe("MOBXEvent", () => {
    let form: Form;
    let field: any;

    beforeEach(() => {
      form = new Form(
        { fields: { test: { label: "Test", value: "initial" } } },
        { name: "MOBXEventTest" },
      );
      field = form.$("test");
    });

    it("should register an observer for value changes", () => {
      let observed = false;
      field.MOBXEvent({
        type: "observer",
        prop: "value",
        call: () => {
          observed = true;
        },
      });

      field.set("changed");
      expect(observed).to.be.true;
    });

    it("should register an interceptor for value changes", () => {
      let intercepted = false;
      field.MOBXEvent({
        type: "interceptor",
        prop: "value",
        call: () => {
          intercepted = true;
          return null;
        },
      });

      field.set("changed");
      expect(intercepted).to.be.true;
    });

    it("should pass field reference in callback", () => {
      let passedField: any;
      field.MOBXEvent({
        type: "observer",
        prop: "value",
        call: ({ field: f }: any) => {
          passedField = f;
        },
      });

      field.set("changed");
      expect(passedField).to.exist;
    });

    it("should have valid disposer structure", () => {
      field.MOBXEvent({
        type: "observer",
        prop: "value",
        call: () => {},
      });

      expect(field.state.disposers).to.have.property("observer");
      expect(Object.keys(field.state.disposers.observer)).to.have.length.greaterThan(0);
    });
  });

  describe("execHandler", () => {
    it("should call custom handler when provided on field", () => {
      let handlerCalled = false;
      const handlerField = new Form(
        {
          fields: {
            test: {
              label: "Test",
              value: "val",
              handlers: {
                onBlur: (f: any) => {
                  handlerCalled = true;
                  return () => {};
                },
              },
            },
          },
        },
        { name: "HandlerFieldTest" },
      );

      handlerField.$("test").onBlur({ target: {} });
      expect(handlerCalled).to.be.true;
    });

    it("should call the hook when handler executes", () => {
      let hookCalled = false;
      const testForm = new Form(
        {
          fields: {
            test: {
              label: "Test",
              value: "val",
              hooks: {
                onBlur: () => {
                  hookCalled = true;
                },
              },
              handlers: {
                onBlur: (f: any) => () => {
                  // custom handler
                },
              },
            },
          },
        },
        { name: "HandlerHook" },
      );

      testForm.$("test").onBlur({ target: {} });
      expect(hookCalled).to.be.true;
    });

    it("should pass event arguments to the handler", () => {
      let passedArgs: any;
      const testForm = new Form(
        {
          fields: {
            test: {
              label: "Test",
              value: "val",
              handlers: {
                onBlur: (field: any) => (...args: any) => {
                  passedArgs = args;
                  return args;
                },
              },
            },
          },
        },
        { name: "ArgsHandler" },
      );

      const event = { target: {} };
      testForm.$("test").onBlur(event, "extra-arg");
      expect(passedArgs).to.include(event);
    });
  });
});
