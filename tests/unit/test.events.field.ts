import { expect, assert } from "chai";
import { Form, Field } from "../../src";

describe("Field Event Handlers", () => {
  let form: Form;
  let field: any;

  beforeEach(() => {
    form = new Form(
      {
        fields: {
          username: {
            label: "Username",
            value: "initial",
          },
          email: {
            label: "Email",
            value: "test@test.com",
          },
          terms: {
            label: "Terms",
            type: "checkbox",
            value: true,
          },
          revenue: {
            label: "Revenue",
            value: "100",
          },
        },
      },
      { name: "EventTest" },
    );
    field = form.$("username");
  });

  describe("sync()", () => {
    it("should update value from input event (target.value)", () => {
      const event = { target: { value: "new-value" } };
      field.sync(event);
      expect(field.value).to.equal("new-value");
    });

    it("should handle target.checked for checkbox inputs", () => {
      const checkboxField = form.$("terms");
      const event = { target: { checked: false } };
      checkboxField.sync(event);
      expect(checkboxField.value).to.be.false;
    });

    it("should handle direct value when no target", () => {
      field.sync("direct-value");
      expect(field.value).to.equal("direct-value");
    });

    it("should keep null when v is null and e is a direct value", () => {
      // $try(null, 'fallback-value') returns null since null !== undefined
      field.sync(null, "fallback-value");
      expect(field.value).to.be.null;
    });

    it("should use $get on v when v has target property", () => {
      field.sync(null, { target: { value: "nested-target" } });
      // isNil(null) -> true, isNil(v.target) -> false
      // v = $get(v) -> v.target.value -> 'nested-target'
      // this.value = $try(null, 'nested-target') -> null (null !== undefined)
      expect(field.value).to.be.null;
    });

    it("should handle numeric value", () => {
      field.sync(42);
      expect(field.value).to.equal(42);
    });

    it("should handle boolean value", () => {
      field.sync(false);
      expect(field.value).to.be.false;
    });
  });

  describe("onSync / onChange", () => {
    it("should call execHandler and the sync fallback", () => {
      const event = { target: { value: "sync-value" } };
      const result = field.onSync(event);
      expect(field.value).to.equal("sync-value");
      expect(result).to.be.an("array");
    });

    it("onChange should be same as onSync", () => {
      expect(field.onChange).to.equal(field.onSync);
    });

    it("should call onChange hook via autorun when value changes", () => {
      let hookCalled = false;
      const hookForm = new Form(
        {
          fields: {
            test: {
              label: "Test",
              value: "initial",
              hooks: {
                onChange: () => {
                  hookCalled = true;
                },
              },
            },
          },
        },
        { name: "HookTest" },
      );
      // The autorun in Field constructor fires onChange hook when changed is truthy
      hookForm.$("test").onChange({ target: { value: "new" } });
      expect(hookCalled).to.be.true;
    });

    it("should propagate $changed counter on sync", () => {
      const initial = field.$changed;
      field.onSync({ target: { value: "changed" } });
      expect(field.$changed).to.be.greaterThan(initial);
    });
  });

  describe("onBlur", () => {
    it("should set $focused to false on blur", () => {
      field.$focused = true;
      field.onBlur();
      expect(field.$focused).to.be.false;
    });

    it("should set $blurred to true on blur", () => {
      field.$blurred = false;
      field.onBlur();
      expect(field.$blurred).to.be.true;
    });

    it("should call execHandler with onBlur", () => {
      const result = field.onBlur({ target: {} });
      expect(result).to.be.an("array");
    });

    it("should call blur hook when provided", () => {
      let hookCalled = false;
      const hookForm = new Form(
        {
          fields: {
            test: {
              label: "Test",
              value: "initial",
              hooks: {
                onBlur: () => {
                  hookCalled = true;
                },
              },
            },
          },
        },
        { name: "BlurHookTest" },
      );
      hookForm.$("test").onBlur();
      expect(hookCalled).to.be.true;
    });
  });

  describe("onFocus", () => {
    it("should set $focused to true on focus", () => {
      field.$focused = false;
      field.onFocus({ target: {} });
      expect(field.$focused).to.be.true;
    });

    it("should set $touched to true on focus", () => {
      field.$touched = false;
      field.onFocus({ target: {} });
      expect(field.$touched).to.be.true;
    });

    it("should call focus hook when provided", () => {
      let hookCalled = false;
      const hookForm = new Form(
        {
          fields: {
            test: {
              label: "Test",
              value: "initial",
              hooks: {
                onFocus: () => {
                  hookCalled = true;
                },
              },
            },
          },
        },
        { name: "FocusHookTest" },
      );
      hookForm.$("test").onFocus();
      expect(hookCalled).to.be.true;
    });
  });

  describe("onToggle", () => {
    it("should sync the value via sync fallback", () => {
      field.onToggle({ target: { value: "toggled" } });
      expect(field.value).to.equal("toggled");
    });
  });

  describe("onKeyDown", () => {
    it("should call execHandler with onKeyDown", () => {
      const event = { key: "Enter", target: { value: "test" } };
      const result = field.onKeyDown(event);
      expect(result).to.be.an("array");
    });
  });

  describe("onKeyUp", () => {
    it("should call execHandler with onKeyUp", () => {
      const event = { key: "Escape", target: { value: "test" } };
      const result = field.onKeyUp(event);
      expect(result).to.be.an("array");
    });
  });

  describe("onDrop", () => {
    it("should handle file drop events", () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const event = {
        target: { files: [file] },
        preventDefault: () => {},
      };
      const result = field.onDrop(event);
      expect(result).to.be.an("array");
      expect(field.files).to.be.an("array");
    });

    it("should handle single file-like object directly", () => {
      const file = { name: "file1.txt", size: 100 };
      field.onDrop(file);
      expect(field.files).to.be.an("array");
      expect(field.files).to.have.lengthOf(1);
      expect(field.files[0]).to.deep.equal(file);
    });
  });

  describe("focus() and blur() actions", () => {
    let refField: any;

    beforeEach(() => {
      refField = form.$("username");
    });

    it("focus() should set $focused and $touched", () => {
      refField.$focused = false;
      refField.$touched = false;
      refField.focus();
      expect(refField.$focused).to.be.true;
      expect(refField.$touched).to.be.true;
    });

    it("blur() should set $focused to false and $blurred to true", () => {
      refField.$focused = true;
      refField.$blurred = false;
      refField.blur();
      expect(refField.$focused).to.be.false;
      expect(refField.$blurred).to.be.true;
    });

    it("focus() should call ref.focus() if ref exists", () => {
      let focusCalled = false;
      refField.$ref = {
        focus: () => {
          focusCalled = true;
        },
        blur: () => {},
      };
      refField.$focused = false;
      refField.focus();
      expect(focusCalled).to.be.true;
    });

    it("blur() should call ref.blur() if ref exists and focused", () => {
      let blurCalled = false;
      refField.$ref = {
        focus: () => {},
        blur: () => {
          blurCalled = true;
        },
      };
      refField.$focused = true;
      refField.blur();
      expect(blurCalled).to.be.true;
    });
  });

  describe("computed - focused, blurred, touched", () => {
    it("focused should reflect $focused", () => {
      field.$focused = true;
      expect(field.focused).to.be.true;
      field.$focused = false;
      expect(field.focused).to.be.false;
    });

    it("blurred should reflect $blurred", () => {
      field.$blurred = true;
      expect(field.blurred).to.be.true;
      field.$blurred = false;
      expect(field.blurred).to.be.false;
    });

    it("touched should reflect $touched", () => {
      field.$touched = true;
      expect(field.touched).to.be.true;
      field.$touched = false;
      expect(field.touched).to.be.false;
    });
  });

  describe("onSync with file type", () => {
    let fileField: any;

    beforeEach(() => {
      const fileForm = new Form(
        {
          fields: {
            avatar: {
              label: "Avatar",
              type: "file",
            },
          },
        },
        { name: "FileForm" },
      );
      fileField = fileForm.$("avatar");
    });

    it("should call onDrop for file type fields", () => {
      const files = [{ name: "photo.jpg" }];
      const result = fileField.onSync(files);
      expect(fileField.files).to.be.an("array");
      expect(result).to.be.an("array");
    });
  });

  describe("Hook args passing — execHandler forwards args to execHook", () => {
    it("should pass both field and keyboard event to onKeyDown hook", () => {
      let receivedArgs: any[] = [];
      const hookForm = new Form(
        {
          fields: {
            search: {
              value: "",
              hooks: {
                onKeyDown: (...args: any[]) => {
                  receivedArgs = args;
                },
              },
            },
          },
        },
        { name: "HookArgsTest" },
      );
      const event = { key: "Enter", target: { value: "test" } };
      hookForm.$("search").onKeyDown(event);
      expect(receivedArgs).to.have.lengthOf(2);
      expect(receivedArgs[0]).to.have.property("path", "search");
      expect(receivedArgs[1]).to.have.property("key", "Enter");
    });

    it("should pass both field and keyboard event to onKeyUp hook", () => {
      let receivedArgs: any[] = [];
      const hookForm = new Form(
        {
          fields: {
            search: {
              value: "",
              hooks: {
                onKeyUp: (...args: any[]) => {
                  receivedArgs = args;
                },
              },
            },
          },
        },
        { name: "HookArgsTest2" },
      );
      const event = { key: "Escape", target: { value: "test" } };
      hookForm.$("search").onKeyUp(event);
      expect(receivedArgs).to.have.lengthOf(2);
      expect(receivedArgs[0]).to.have.property("path", "search");
      expect(receivedArgs[1]).to.have.property("key", "Escape");
    });

    it("should pass both field and blur event to onBlur hook", () => {
      let receivedArgs: any[] = [];
      const hookForm = new Form(
        {
          fields: {
            test: {
              value: "x",
              hooks: {
                onBlur: (...args: any[]) => {
                  receivedArgs = args;
                },
              },
            },
          },
        },
        { name: "BlurArgsTest" },
      );
      const event = { target: {} };
      const field = hookForm.$("test");
      field.onBlur(event);
      expect(receivedArgs).to.have.lengthOf(2);
      expect(receivedArgs[0]).to.have.property("path", "test");
      expect(receivedArgs[1]).to.deep.equal(event);
    });

    it("should pass both field and files payload to onDrop hook", () => {
      let receivedArgs: any[] = [];
      const hookForm = new Form(
        {
          fields: {
            avatar: {
              type: "file",
              hooks: {
                onDrop: (...args: any[]) => {
                  receivedArgs = args;
                },
              },
            },
          },
        },
        { name: "DropArgsTest" },
      );
      const file = { name: "photo.jpg", size: 100 };
      hookForm.$("avatar").onDrop(file);
      expect(receivedArgs).to.have.lengthOf(2);
      expect(receivedArgs[0]).to.have.property("path", "avatar");
      expect(receivedArgs[1]).to.deep.equal(file);
    });

    it("should pass only field to onInit hook (called directly, not via execHandler)", () => {
      let receivedArgs: any[] = [];
      new Form(
        {
          fields: {
            test: {
              value: "x",
              hooks: {
                onInit: (...args: any[]) => {
                  receivedArgs = args;
                },
              },
            },
          },
        },
        { name: "InitNoArgsTest" },
      );
      expect(receivedArgs).to.have.lengthOf(1);
      expect(receivedArgs[0]).to.have.property("path", "test");
    });

    it("should pass only field to onClear hook (called directly, not via execHandler)", () => {
      let receivedArgs: any[] = [];
      const hookForm = new Form(
        {
          fields: {
            test: {
              value: "x",
              hooks: {
                onClear: (...args: any[]) => {
                  receivedArgs = args;
                },
              },
            },
          },
        },
        { name: "ClearNoArgsTest" },
      );
      hookForm.$("test").clear();
      expect(receivedArgs).to.have.lengthOf(1);
      expect(receivedArgs[0]).to.have.property("path", "test");
    });

    it("should pass multiple event args to hooks (onAdd with event + value)", () => {
      let receivedArgs: any[] = [];
      const hookForm = new Form(
        {
          fields: {
            members: {
              fields: [],
              hooks: {
                onAdd: (...args: any[]) => {
                  receivedArgs = args;
                },
              },
            },
          },
        },
        { name: "MultiArgsTest" },
      );
      const event = { preventDefault: () => {} };
      const val = { name: "John" };
      hookForm.$("members").onAdd(event, val);
      expect(receivedArgs).to.have.lengthOf(3);
      expect(receivedArgs[0]).to.have.property("path", "members");
      expect(receivedArgs[1]).to.deep.equal(event);
      expect(receivedArgs[2]).to.deep.equal(val);
    });
  });
});
