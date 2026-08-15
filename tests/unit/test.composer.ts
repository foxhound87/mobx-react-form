import { expect } from "chai";
import Form from "../../src/Form";
import vjf from "../../src/validators/VJF";
import { composer } from "../../src/composer";

const buildForm = (name: string, value: string = "") =>
  new Form(
    {
      fields: {
        email: {
          label: "Email",
          value,
          validators: [
            ({ field }: any) =>
              field.value === "test@test.com"
                ? true
                : "Invalid Email Address",
          ],
        },
        asyncCheck: {
          label: "Async Check",
          value: true,
          validators: [
            ({ field }: any) =>
              Promise.resolve(
                field.value === true ? [true, ""] : [false, "Async Failed"]
              ),
          ],
        },
      },
    },
    {
      name,
      plugins: { vjf: vjf() },
      options: { validateOnInit: false } as any,
    }
  );

describe("Composer", () => {
  const buildWizard = () =>
    composer({
      step1: buildForm("Step1"),
      step2: buildForm("Step2"),
    });

  it("should expose instances() returning the forms map", () => {
    const wizard = buildWizard();
    const instances = wizard.instances();

    expect(Object.keys(instances)).to.have.length(2);
    expect(instances.step1).to.equal(wizard.select("step1"));
    expect(instances.step2).to.equal(wizard.select("step2"));
  });

  it("should select() an individual form", () => {
    const wizard = buildWizard();
    const step1 = wizard.select("step1");

    expect(step1).to.be.an.instanceof(Form);
    expect(step1.name).to.equal("Step1");
  });

  it("should check() a field prop across all forms", () => {
    const wizard = buildWizard();

    wizard.select("step1").$("email").value = "test@test.com";
    wizard.select("step2").$("email").value = "bad@test.com";

    return wizard
      .validate()
      .then(({ valid, error }: any) => {
        expect(valid).to.be.false;
        expect(error).to.be.true;

        const isValid = wizard.check("isValid");
        expect(isValid.step1).to.be.true;
        expect(isValid.step2).to.be.false;

        const hasError = wizard.check("hasError");
        expect(hasError.step1).to.be.false;
        expect(hasError.step2).to.be.true;
      });
  });

  it("should get() values and errors across all forms", () => {
    const wizard = buildWizard();

    wizard.select("step1").$("email").value = "test@test.com";
    wizard.select("step2").$("email").value = "bad@test.com";

    return wizard.validate().then(() => {
      const values = wizard.get("value");
      expect(values.step1.email).to.equal("test@test.com");
      expect(values.step2.email).to.equal("bad@test.com");

      const errors = wizard.get("error");
      expect(errors.step1.email).to.equal(null);
      expect(errors.step2.email).to.match(/Invalid Email Address/);
    });
  });

  it("should expose valid() and error() helpers (C1)", () => {
    const wizard = buildWizard();

    // both forms untouched value -> empty -> invalid
    return wizard.validate().then(() => {
      expect(wizard.valid()).to.be.false;
      expect(wizard.error()).to.be.true;
    });
  });

  it("should resolve valid() true and error() false when every form is valid", () => {
    const wizard = buildWizard();

    wizard.select("step1").$("email").value = "test@test.com";
    wizard.select("step2").$("email").value = "test@test.com";

    return wizard.validate().then(() => {
      expect(wizard.valid()).to.be.true;
      expect(wizard.error()).to.be.false;
    });
  });

  it("should validate() all forms and return { composer, valid, error, errors, values }", () => {
    const wizard = buildWizard();

    wizard.select("step1").$("email").value = "test@test.com";
    wizard.select("step2").$("email").value = "test@test.com";

    return wizard.validate().then((result: any) => {
      expect(result.composer).to.exist;
      expect(result.composer.instances).to.be.a("function");
      expect(result.valid).to.be.true;
      expect(result.error).to.be.false;
      expect(result.errors.step1.email).to.equal(null);
      expect(result.values.step1.email).to.equal("test@test.com");
    });
  });

  it("should submit() all forms and return { composer, valid, error, errors, values }", () => {
    const wizard = buildWizard();

    wizard.select("step1").$("email").value = "test@test.com";
    wizard.select("step2").$("email").value = "test@test.com";

    return wizard.submit().then((result: any) => {
      expect(result.composer).to.exist;
      expect(result.valid).to.be.true;
      expect(result.error).to.be.false;
      expect(result.values.step1.email).to.equal("test@test.com");

      expect(wizard.select("step1").submitted).to.equal(1);
      expect(wizard.select("step2").submitted).to.equal(1);
    });
  });

  it("should clear() all forms values", () => {
    const wizard = buildWizard();

    wizard.select("step1").$("email").value = "test@test.com";
    wizard.select("step2").$("email").value = "test@test.com";

    wizard.clear();

    expect(wizard.get("value").step1.email).to.equal("");
    expect(wizard.get("value").step2.email).to.equal("");
  });

  it("should reset() all forms to initial values", () => {
    const wizard = buildWizard();

    wizard.select("step1").$("email").value = "test@test.com";
    wizard.select("step2").$("email").value = "test@test.com";

    wizard.reset();

    expect(wizard.get("value").step1.email).to.equal("");
    expect(wizard.get("value").step2.email).to.equal("");
    expect(wizard.select("step1").isPristine).to.be.true;
    expect(wizard.select("step2").isPristine).to.be.true;
  });

  it("should accept explicit option objects for clear/reset (default-arg branches)", () => {
    const wizard = buildWizard();

    wizard.select("step1").$("email").value = "test@test.com";

    expect(() => wizard.clear({ deep: false })).to.not.throw();
    expect(() => wizard.reset({ deep: true, execHook: true })).to.not.throw();

    expect(wizard.get("value").step1.email).to.equal("");
  });

  it("should accept explicit option objects for validate/submit (default-arg branches)", () => {
    const wizard = buildWizard();

    return wizard
      .validate({ showErrors: false })
      .then(() => wizard.submit({ validate: false, execOnSubmitHook: true, execValidationHooks: true }))
      .then((result: any) => {
        expect(result.valid).to.be.false;
        expect(result.error).to.be.true;
      });
  });
});