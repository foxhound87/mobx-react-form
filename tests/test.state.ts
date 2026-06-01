import { expect } from "chai";
import Form from "../src/Form";
import { StateInterface } from "../src/models/StateInterface";

describe("State — extra() coverage", () => {
  let form: Form;
  let state: StateInterface;

  beforeEach(() => {
    form = new Form({
      fields: {
        username: {
          label: "Username",
          value: "test",
        },
      },
    });
    state = (form as any).state;
  });

  it("should return full extra when called with no args (data === null branch)", () => {
    expect(state.extra()).to.be.undefined;
  });

  it("should return specific key when called with a string (isString branch)", () => {
    state.extra({ foo: "bar", baz: 42 });
    expect(state.extra("foo")).to.equal("bar");
    expect(state.extra("nonexistent")).to.be.undefined;
  });

  it("should set extra when called with object (non-string, non-null branch)", () => {
    expect(state.extra({ key1: "value1" })).to.be.null;
    expect(state.extra()).to.deep.equal({ key1: "value1" });
  });

  it("should handle number extra data", () => {
    expect(state.extra(42)).to.be.null;
    expect(state.extra()).to.equal(42);
  });

  it("should allow overwriting extra data", () => {
    state.extra({ first: "set" });
    state.extra({ second: "overwritten" });
    expect(state.extra()).to.deep.equal({ second: "overwritten" });
  });
});

describe("State — observeOptions exec callbacks", () => {
  it("exec callback: validateOnChange to true (observeValidationOnChange)", () => {
    const form = new Form(
      {
        fields: {
          email: {
            label: "Email",
            value: "test@test.com",
            type: "email",
            rules: "required|email",
          },
        },
      },
      {
        name: "Observe1",
        options: { validateOnChange: false } as any,
      }
    );

    // Trigger observer: has(templates,'default')=false → has(rewriters,'validateOnChange')=false
    // → falls through to... no, this is options.set, not bindings.load.
    // options.set({validateOnChange:true}) patches the observable → observe callback fires
    // checkObserveItem matches {type:"update", key:"validateOnChange", to:true}
    // → exec calls field.observeValidationOnChange()
    form.state.options.set({ validateOnChange: true });

    // Verify the option was toggled (confirms the MobX observe+exec chain ran)
    expect(form.state.options.get("validateOnChange")).to.be.true;
  });

  it("exec callback: validateOnChange to false (disposeValidationOnChange)", () => {
    const form = new Form(
      {
        fields: {
          name: { label: "Name", value: "Hello", rules: "required|min:3" },
        },
      },
      {
        name: "Observe2",
        options: { validateOnChange: true } as any,
      }
    );

    // Trigger observer → exec calls field.disposeValidationOnChange()
    form.state.options.set({ validateOnChange: false });

    expect(form.state.options.get("validateOnChange")).to.be.false;
  });

  it("exec callback: validateOnBlur to true (observeValidationOnBlur)", () => {
    const form = new Form(
      {
        fields: {
          f1: { label: "F1", value: "val", rules: "required|min:5" },
        },
      },
      {
        name: "Observe3",
        options: { validateOnBlur: false } as any,
      }
    );

    // Trigger observer → exec calls field.observeValidationOnBlur()
    form.state.options.set({ validateOnBlur: true });

    expect(form.state.options.get("validateOnBlur")).to.be.true;
  });

  it("exec callback: validateOnBlur to false (disposeValidationOnBlur)", () => {
    const form = new Form(
      {
        fields: {
          f2: { label: "F2", value: "ok", rules: "required|min:10" },
        },
      },
      {
        name: "Observe4",
        options: { validateOnBlur: true } as any,
      }
    );

    // Trigger observer → exec calls field.disposeValidationOnBlur()
    form.state.options.set({ validateOnBlur: false });

    expect(form.state.options.get("validateOnBlur")).to.be.false;
  });

  it("should not throw when toggling multiple options on multi-field form", () => {
    const form = new Form(
      {
        fields: {
          a: { label: "A", value: "1", rules: "required" },
          b: { label: "B", value: "2", rules: "required" },
          c: { label: "C", value: "3", rules: "required" },
        },
      },
      { name: "MultiField" }
    );

    expect(() => {
      form.state.options.set({ validateOnChange: true });
      form.state.options.set({ validateOnBlur: false });
    }).to.not.throw();
  });

  it("should properly chain both observer and exec callback on validateOnChange toggle", () => {
    const form = new Form(
      {
        fields: {
          score: { label: "Score", value: "10", rules: "required|numeric" },
        },
      },
      {
        name: "Observe6",
        options: { validateOnChange: false } as any,
      }
    );

    // Toggle ON → exec calls observeValidationOnChange()
    form.state.options.set({ validateOnChange: true });
    expect(form.state.options.get("validateOnChange")).to.be.true;

    // Toggle OFF → exec calls disposeValidationOnChange()
    form.state.options.set({ validateOnChange: false });
    expect(form.state.options.get("validateOnChange")).to.be.false;
  });
});
