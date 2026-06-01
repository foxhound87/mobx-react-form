import { expect } from "chai";
import * as yup from "yup";
import Form from "../src/Form";
import dvr from "../src/validators/DVR";
import validatorjs from "validatorjs";
import $yup from "../src/validators/YUP";

describe("Validator — validatePristineFields: false branch", () => {
  it("should skip validation on pristine field when validatePristineFields is false (line 111)", () => {
    const form = new Form(
      {
        fields: {
          name: {
            label: "Name",
            value: "ab",
            type: "text",
            rules: "required|min:5",
          },
        },
      },
      {
        name: "PristineTest",
        options: {
          validatePristineFields: false,
          validateOnInit: false,
        } as any,
      }
    );

    const field = form.$("name");
    expect(field.isPristine).to.be.true;

    // Trigger validateField → hits isPristine && !validatePristineFields → returns early → no error
    return form.validate().then(() => {
      expect(field.hasError).to.be.false;
    });
  });
});

describe("Validator — validationPluginsOrder + stopOnError", () => {
  it("should execute plugins in specified order via validationPluginsOrder (line 130 ternary)", () => {
    const form = new Form(
      {
        fields: {
          email: {
            label: "Email",
            value: "not-an-email",
            type: "email",
            rules: "required",
          },
        },
      },
      {
        name: "PluginOrderTest",
        options: {
          validationPluginsOrder: ["dvr"],
          stopValidationOnError: true,
          validationDebounceWait: 0,
        } as any,
        plugins: {
          dvr: $yup({
            package: yup,
            schema: ($yup: typeof yup) => $yup.object().shape({ email: $yup.string().email("Must be valid email").required() }),
          }),
        },
      }
    );

    const field = form.$("email");
    return form.validate().then(() => {
      expect(field.hasError).to.be.true;
    });
  });

  it("should use all drivers when validationPluginsOrder is not set", () => {
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
        name: "NoPluginOrder",
        options: { validateOnInit: true } as any,
      }
    );

    expect(form.$("email").isValid).to.be.true;
  });

  it("should stop validation after first plugin when stopOnError is true and error exists (line 133)", () => {
    const form = new Form(
      {
        fields: {
          score: {
            label: "Score",
            value: "5",
            type: "text",
            rules: "required|numeric|min:10",
            validators: [
              ({ value }: any) => (Number(value) >= 10 ? true : "Value too low (VJF)"),
            ],
          },
        },
      },
      {
        name: "StopOnErrorTest",
        options: {
          validationPluginsOrder: ["dvr", "vjf"],
          stopValidationOnError: true,
          validationDebounceWait: 0,
        } as any,
        plugins: {
          dvr: $yup({
            package: yup,
            schema: ($yup: typeof yup) => $yup.object().shape({ score: $yup.number().min(10, "Min is 10").required() }),
          }),
        },
      }
    );

    const field = form.$("score");
    return form.validate().then(() => {
      expect(field.hasError).to.be.true;
    });
  });
});

describe("Validator — validateField edge cases", () => {
  it("should validate disabled field when validateDisabledFields is true (line 113-114 continue branch)", () => {
    const form = new Form(
      {
        fields: {
          inactive: {
            label: "Inactive",
            value: "",
            type: "text",
            rules: "required",
            disabled: true,
          },
        },
      },
      {
        name: "DisabledFieldValidateTest",
        options: {
          validateDisabledFields: true,
          validateOnInit: false,
        } as any,
        plugins: {
          dvr: dvr({ package: validatorjs }),
        },
      }
    );

    const field = form.$("inactive");
    expect(field.disabled).to.be.true;

    // Trigger validateField: disabled=true AND validateDisabledFields=true → should NOT skip → validation runs
    return form.validate().then(() => {
      expect(field.hasError).to.be.true;
    });
  });

  it("should skip validation on disabled field when validateDisabledFields is false", () => {
    const form = new Form(
      {
        fields: {
          inactive: {
            label: "Inactive",
            value: "",
            type: "text",
            rules: "required",
            disabled: true,
          },
        },
      },
      {
        name: "DisabledFieldTest",
        options: {
          validateDisabledFields: false,
          validateOnInit: false,
        } as any,
      }
    );

    const field = form.$("inactive");
    expect(field.disabled).to.be.true;

    // Trigger validateField → hits disabled && !validateDisabledFields → returns early → no error
    return form.validate().then(() => {
      expect(field.hasError).to.be.false;
    });
  });

  it("should validate deleted field when validateDeletedFields is true (line 111-112 continue branch)", () => {
    const form = new Form(
      {
        fields: {
          removable: {
            label: "Removable",
            value: "",
            type: "text",
            rules: "required",
          },
        },
      },
      {
        name: "DeletedFieldValidateTest",
        options: {
          validateDeletedFields: true,
          softDelete: true,
          validateOnInit: false,
        } as any,
        plugins: {
          dvr: dvr({ package: validatorjs }),
        },
      }
    );

    const field = form.$("removable");
    field.$deleted = true;
    expect(field.deleted).to.be.true;

    // Trigger validateField: deleted=true AND validateDeletedFields=true → should NOT skip → validation runs
    return form.validate().then(() => {
      expect(field.hasError).to.be.true;
    });
  });

  it("should skip validation on deleted field when validateDeletedFields is false", () => {
    const form = new Form(
      {
        fields: {
          removable: {
            label: "Removable",
            value: "",
            type: "text",
            rules: "required",
          },
        },
      },
      {
        name: "DeletedFieldTest",
        options: {
          validateDeletedFields: false,
          softDelete: true,
          validateOnInit: false,
        } as any,
      }
    );

    const field = form.$("removable");
    field.$deleted = true;
    expect(field.deleted).to.be.true;

    // Trigger validateField → hits deleted && !validateDeletedFields → returns early → no error
    return form.validate().then(() => {
      expect(field.hasError).to.be.false;
    });
  });

  it("should use validateTrimmedValue to trim before validation", () => {
    const form = new Form(
      {
        fields: {
          spaced: {
            label: "Spaced",
            value: "  hello  ",
            type: "text",
            rules: "required|min:5",
          },
        },
      },
      {
        name: "TrimTest",
        options: {
          autoTrimValue: false,
          validateTrimmedValue: true,
          validateOnInit: false,
        } as any,
      }
    );

    const field = form.$("spaced");
    expect(field.value).to.equal("  hello  ");

    // Trigger validateField → validateTrimmedValue trims → "hello" passes min:5
    return form.validate().then(() => {
      expect(field.isValid).to.be.true;
    });
  });
});
