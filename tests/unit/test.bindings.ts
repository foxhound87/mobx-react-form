import { expect } from "chai";
import Bindings from "../../src/Bindings";
import { Form } from "../../src";
import { FieldPropsEnum } from "../../src/models/FieldProps";

describe("Bindings", () => {
  let bindings: Bindings;

  beforeEach(() => {
    bindings = new Bindings();
  });

  describe("initial state", () => {
    it("should have empty templates by default", () => {
      expect(bindings.templates).to.be.an("object").that.is.empty;
    });

    it("should have a default rewriter with all standard fields", () => {
      expect(bindings.rewriters).to.have.property("default");
      expect(bindings.rewriters.default).to.include({
        id: FieldPropsEnum.id,
        name: FieldPropsEnum.name,
        type: FieldPropsEnum.type,
        value: FieldPropsEnum.value,
        checked: FieldPropsEnum.checked,
        label: FieldPropsEnum.label,
        placeholder: FieldPropsEnum.placeholder,
        disabled: FieldPropsEnum.disabled,
        onChange: FieldPropsEnum.onChange,
        onBlur: FieldPropsEnum.onBlur,
        onFocus: FieldPropsEnum.onFocus,
      });
    });
  });

  describe("register()", () => {
    it("should register a template function", () => {
      const template = ({ field }: any) => ({ id: field.id });
      bindings.register({ customTemplate: template } as any);
      expect((bindings.templates as any).customTemplate).to.equal(template);
    });

    it("should register a rewriter object", () => {
      const rewriter: any = { customField: "custom_field" };
      bindings.register({ customRewriter: rewriter } as any);
      expect((bindings.rewriters as any).customRewriter).to.exist;
    });

    it("should register both templates and rewriters simultaneously", () => {
      const template = ({ field }: any) => ({ id: field.id });
      const rewriter: any = { customField: "custom_field" };
      bindings.register({
        myTemplate: template,
        myRewriter: rewriter,
      } as any);
      expect((bindings.templates as any).myTemplate).to.equal(template);
      expect((bindings.rewriters as any).myRewriter).to.exist;
    });

    it("should return this for chaining", () => {
      const result = bindings.register({} as any);
      expect(result).to.equal(bindings);
    });

    it("should not register non-function/non-plain values", () => {
      bindings.register({ invalid: "string" } as any);
      expect(bindings.templates).to.not.have.property("invalid");
      expect(bindings.rewriters).to.not.have.property("invalid");
    });
  });

  describe("load() with default rewriter", () => {
    let field: any;

    beforeEach(() => {
      field = {
        id: "field-1",
        name: "username",
        type: "text",
        value: "test-user",
        label: "Username",
        placeholder: "Enter username",
        disabled: false,
        autoComplete: "username",
        onChange: () => {},
        onBlur: () => {},
        onFocus: () => {},
        autoFocus: false,
        inputMode: "text",
        onKeyUp: () => {},
        onKeyDown: () => {},
        checked: undefined,
        state: {
          form: {},
        },
      };
    });

    it("should return an object with mapped field props", () => {
      const result = bindings.load(field, FieldPropsEnum.default, {});
      expect(result).to.have.property("id", "field-1");
      expect(result).to.have.property("name", "username");
      expect(result).to.have.property("type", "text");
      expect(result).to.have.property("value", "test-user");
      expect(result).to.have.property("label", "Username");
      expect(result).to.have.property("placeholder", "Enter username");
      expect(result).to.have.property("disabled", false);
      expect(result).to.have.property("onChange");
      expect(result).to.have.property("onBlur");
      expect(result).to.have.property("onFocus");
    });

    it("should override field props with provided props", () => {
      const result = bindings.load(field, FieldPropsEnum.default, {
        value: "overridden-value",
        label: "Overridden Label",
      });
      expect(result).to.have.property("value", "overridden-value");
      expect(result).to.have.property("label", "Overridden Label");
    });

    it("should fall back to field value when prop is undefined", () => {
      const result = bindings.load(field, FieldPropsEnum.default, {
        value: undefined,
      });
      expect(result).to.have.property("value", "test-user");
    });

    it("should include autoComplete when provided", () => {
      const result = bindings.load(field, FieldPropsEnum.default, {});
      expect(result).to.have.property("autoComplete", "username");
    });

    it("should set autoComplete to undefined when not on field", () => {
      delete field.autoComplete;
      const result = bindings.load(field, FieldPropsEnum.default, {});
      expect(result).to.have.property("autoComplete", undefined);
    });

    it("should return checked when field has checked property", () => {
      field.checked = true;
      const result = bindings.load(field, FieldPropsEnum.default, {});
      expect(result).to.have.property("checked", true);
    });
  });

  describe("load() with custom template", () => {
    let field: any;

    beforeEach(() => {
      field = {
        id: "field-1",
        name: "email",
        type: "email",
        value: "test@test.com",
        label: "Email",
        state: { form: {} },
      };

      bindings.register({
        materialTemplate: ({
          field: f,
          props,
          $try,
        }: {
          field: any;
          props: any;
          $try: Function;
        }) => ({
          type: $try(props.type, f.type),
          value: $try(props.value, f.value),
          floatingLabelText: $try(props.label, f.label),
        }),
      } as any);
    });

    it("should use custom template to generate bindings", () => {
      const result = bindings.load(field, "materialTemplate", {});
      expect(result).to.have.property("type", "email");
      expect(result).to.have.property("value", "test@test.com");
      expect(result).to.have.property("floatingLabelText", "Email");
    });

    it("should allow props to override template values", () => {
      const result = bindings.load(field, "materialTemplate", {
        value: "override@test.com",
      });
      expect(result).to.have.property("value", "override@test.com");
    });

    it("should work when $try receives undefined props", () => {
      const result = bindings.load(field, "materialTemplate", {
        type: undefined,
      });
      expect(result).to.have.property("type", "email");
    });
  });

  describe("load() with custom rewriter", () => {
    let field: any;

    beforeEach(() => {
      field = {
        id: "field-1",
        name: "username",
        value: "test",
        label: "Username",
        state: { form: {} },
      };

      bindings.register({
        customRewriter: {
          id: "custom_id",
          value: "custom_value",
          label: "custom_label",
        },
      } as any);
    });

    it("should use custom rewriter keys to map field props", () => {
      const result = bindings.load(field, "customRewriter", {});
      expect(result).to.have.property("custom_id", "field-1");
      expect(result).to.have.property("custom_value", "test");
      expect(result).to.have.property("custom_label", "Username");
    });

    it("should allow props to override mapped values", () => {
      const result = bindings.load(field, "customRewriter", {
        value: "overridden",
      });
      expect(result).to.have.property("custom_value", "overridden");
    });
  });

  describe("load() with MaterialTextField bindings integration", () => {
    let field: any;
    let form: Form;

    beforeEach(() => {
      form = new Form({ fields: ["testField"] }, { name: "BindTest" });
      field = form.$("testField");
      field.$label = "Test Label";
      field.$placeholder = "Test Placeholder";

      bindings.register({
        MaterialTextFieldTemplate: ({
          field: f,
          props,
          $try,
        }: {
          field: any;
          props: any;
          $try: Function;
        }) => ({
          type: $try(props.type, f.type),
          id: $try(props.id, f.id),
          name: $try(props.name, f.name),
          value: $try(props.value, f.value),
          floatingLabelText: $try(props.label, f.label),
          hintText: $try(props.placeholder, f.placeholder),
          errorText: $try(props.error, f.error),
          disabled: $try(props.disabled, f.disabled),
          onChange: $try(props.onChange, f.onChange),
          onFocus: $try(props.onFocus, f.onFocus),
          onBlur: $try(props.onBlur, f.onBlur),
        }),
      } as any);
    });

    it("should generate Material-like bindings", () => {
      const result = bindings.load(field, "MaterialTextFieldTemplate", {});
      expect(result).to.have.property("type", "text");
      expect(result).to.have.property("floatingLabelText", "Test Label");
      expect(result).to.have.property("hintText", "Test Placeholder");
      expect(result).to.have.property("onChange");
      expect(result).to.have.property("onBlur");
      expect(result).to.have.property("onFocus");
    });

    it("should support errorText prop", () => {
      field.errorSync = "Error message";
      field.showError = true;
      const result = bindings.load(field, "MaterialTextFieldTemplate", {});
      expect(result).to.have.property("errorText", "Error message");
    });

    it("should handle disabled state", () => {
      field.$disabled = true;
      const result = bindings.load(field, "MaterialTextFieldTemplate", {});
      expect(result).to.have.property("disabled", true);
    });
  });

  describe("load() fallback behavior", () => {
    let field: any;

    beforeEach(() => {
      field = {
        id: "test-id",
        name: "test",
        value: "val",
        state: { form: {} },
      };
    });

    it("should return default rewriter when name is 'default'", () => {
      const result = bindings.load(field, "default", {});
      expect(result).to.have.property("id", "test-id");
    });

    it("should throw when template does not exist", () => {
      expect(() => bindings.load(field, "nonExistent" as any, {})).to.throw();
    });
  });

  describe("load() with default template (covers has(templates, 'default') = true branch)", () => {
    let field: any;

    beforeEach(() => {
      field = {
        id: "field-dt",
        name: "defaultTemplateField",
        value: "default-val",
        label: "Default Template Field",
        state: { form: {} },
      };

      // Register a template named 'default' → triggers has(templates, 'default') = true
      bindings.register({
        default: ({ field: f, props, $try }: { field: any; props: any; $try: Function }) => ({
          id: $try(props.id, f.id),
          value: $try(props.value, f.value),
          label: $try(props.label, f.label),
          customMapping: "from_default_template",
        }),
      } as any);
    });

    it("should use the default template when it exists and name is 'default'", () => {
      const result = bindings.load(field, "default", {});
      // Values come from the default template function
      expect(result).to.have.property("id", "field-dt");
      expect(result).to.have.property("value", "default-val");
      expect(result).to.have.property("label", "Default Template Field");
      // Custom field from template should be present
      expect(result).to.have.property("customMapping", "from_default_template");
    });

    it("should allow props to override default template values", () => {
      const result = bindings.load(field, "default", { value: "overridden" });
      expect(result).to.have.property("value", "overridden");
      expect(result).to.have.property("customMapping", "from_default_template");
    });

    it("should work with a named template alongside a default template", () => {
      // Add another template alongside the default one
      bindings.register({
        secondaryTemplate: ({ field: f, props, $try }: { field: any; props: any; $try: Function }) => ({
          id: $try(props.id, f.id),
          secondaryValue: $try(props.value, f.value),
        }),
      } as any);

      // has(templates, 'default') = true → enters the if, then get(templates, 'secondaryTemplate')
      const result = bindings.load(field, "secondaryTemplate", {});
      expect(result).to.have.property("id", "field-dt");
      expect(result).to.have.property("secondaryValue", "default-val");
    });

    it("should throw when default template exists but requested name does not match any template", () => {
      expect(() => bindings.load(field, "nonExistentName" as any, {})).to.throw();
    });
  });

  describe("register() edge cases for branch coverage", () => {
    it("should handle values that are neither function nor plain object via each iteration", () => {
      const bindings = new Bindings();
      // Register with mixed types to exercise both branches in the each callback
      bindings.register({
        fnTemplate: () => ({ key: "val" }),
        objRewriter: { key: "prop" },
        stringVal: "just_a_string",
        numVal: 42,
        arrVal: [1, 2, 3],
      } as any);

      // Function should be registered as template
      expect((bindings.templates as any).fnTemplate).to.be.a("function");
      // Object should be registered as rewriter
      expect((bindings.rewriters as any).objRewriter).to.deep.equal({ key: "prop" });
      // Non-function, non-object values should NOT be registered anywhere
      expect(bindings.templates).to.not.have.property("stringVal");
      expect(bindings.templates).to.not.have.property("numVal");
      expect(bindings.templates).to.not.have.property("arrVal");
      expect(bindings.rewriters).to.not.have.property("stringVal");
      expect(bindings.rewriters).to.not.have.property("numVal");
      expect(bindings.rewriters).to.not.have.property("arrVal");
    });
  });

  describe("field.bind() integration", () => {
    let form: Form;
    let field: any;

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
        { name: "BindIntegration" },
      );
      field = form.$("username");
    });

    it("should return bindings with ref callback", () => {
      const result = field.bind();
      expect(result).to.have.property("id");
      expect(result).to.have.property("name", "username");
      expect(result).to.have.property("type", "text");
      expect(result).to.have.property("value", "test-user");
      expect(result).to.have.property("label", "Username");
    });

    it("should include all event handlers", () => {
      const result = field.bind();
      expect(result).to.have.property("onChange").that.is.a("function");
      expect(result).to.have.property("onBlur").that.is.a("function");
      expect(result).to.have.property("onFocus").that.is.a("function");
    });

    it("should include ref callback", () => {
      const result = field.bind();
      expect(result).to.have.property("ref").that.is.a("function");
    });

    it("should override props when provided", () => {
      const result = field.bind({ value: "overridden" });
      expect(result).to.have.property("value", "overridden");
    });

    it("should return checked for checkbox fields", () => {
      const checkboxForm = new Form(
        {
          fields: {
            agree: {
              type: "checkbox",
              value: true,
            },
          },
        },
        { name: "CheckboxForm" },
      );
      const result = checkboxForm.$("agree").bind();
      expect(result).to.have.property("checked", true);
    });

    it("should set ref when ref callback is called", () => {
      const mockRef = { focus: () => {}, blur: () => {} };
      const result = field.bind();
      result.ref(mockRef);
      expect(field.$ref).to.equal(mockRef);
    });
  });
});
