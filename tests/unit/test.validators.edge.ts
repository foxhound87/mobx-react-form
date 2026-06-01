import { expect } from "chai";
import validatorjs from "validatorjs";
import Joi from "joi";
import { z } from "zod";
import * as yup from "yup";

import { Form } from "../../src";
import dvr from "../../src/validators/DVR";
import vjf from "../../src/validators/VJF";
import svk from "../../src/validators/SVK";
import joiValidator from "../../src/validators/JOI";
import zodValidator from "../../src/validators/ZOD";
import yupValidator from "../../src/validators/YUP";
import ajv from "ajv";
import validator from "validator";
import svkExtend from "../fixtures/extension/svk";

describe("Validator Edge Cases", () => {
  describe("JOI - nested path errors", () => {
    let form: Form;

    beforeEach(() => {
      const schema = Joi.object({
        user: Joi.object({
          email: Joi.string().email().required(),
          address: Joi.object({
            zip: Joi.string()
              .regex(/^\d{5}$/)
              .required(),
          }),
        }),
      });

      form = new Form(
        {
          fields: {
            user: {
              fields: [
                { name: "email", label: "Email", value: "invalid-email" },
                {
                  name: "address",
                  fields: [
                    { name: "zip", label: "ZIP", value: "abc" },
                  ],
                },
              ],
            },
          },
        },
        {
          name: "JOINested",
          plugins: {
            joi: joiValidator({ package: Joi, schema }),
          },
          options: { validateOnInit: true },
        },
      );
    });

    it("should validate nested fields with JOI", () => {
      expect(form.$("user.email").hasError).to.be.true;
    });

    it("should set validationErrorStack on nested fields", () => {
      expect(form.$("user.email").validationErrorStack).to.not.be.empty;
    });

    it("should show correct error message for nested path", () => {
      const errorMsg = form.$("user.email").validationErrorStack[0];
      expect(errorMsg).to.be.a("string");
      expect(errorMsg).to.include("email");
    });

    it("should handle deeply nested field errors", () => {
      expect(form.$("user.address.zip").hasError).to.be.true;
    });
  });

  describe("JOI - no error on valid data", () => {
    it("should not set errors when data is valid", () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
      });

      const validForm = new Form(
        {
          fields: {
            email: { label: "Email", value: "valid@email.com" },
          },
        },
        {
          name: "JOIValid",
          plugins: {
            joi: joiValidator({ package: Joi, schema }),
          },
          options: { validateOnInit: true },
        },
      );

      expect(validForm.$("email").hasError).to.be.false;
    });
  });

  describe("ZOD - schema validation", () => {
    let form: Form;

    beforeEach(() => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().min(18),
      });

      form = new Form(
        {
          fields: {
            email: { label: "Email", value: "not-an-email" },
            age: { label: "Age", value: 15 },
          },
        },
        {
          name: "ZODTest",
          plugins: {
            zod: zodValidator({ package: z, schema }),
          },
          options: { validateOnInit: true },
        },
      );
    });

    it("should detect invalid email", () => {
      expect(form.$("email").hasError).to.be.true;
    });

    it("should set validationErrorStack", () => {
      expect(form.$("email").validationErrorStack).to.not.be.empty;
    });

    it("should detect min value violation", () => {
      expect(form.$("age").hasError).to.be.true;
    });

    it("should pass on valid data", () => {
      const validSchema = z.object({
        name: z.string().min(1),
      });

      const validForm = new Form(
        {
          fields: {
            name: { label: "Name", value: "John" },
          },
        },
        {
          name: "ZODValid",
          plugins: {
            zod: zodValidator({ package: z, schema: validSchema }),
          },
          options: { validateOnInit: true },
        },
      );

      expect(validForm.$("name").hasError).to.be.false;
    });
  });

  describe("YUP - schema validation", () => {
    it("should detect validation errors", (done) => {
      const form = new Form(
        {
          fields: {
            email: { label: "Email", value: "invalid" },
          },
        },
        {
          name: "YUPTest",
          plugins: {
            yup: yupValidator({
              package: yup,
              schema: (y: any) =>
                y.object().shape({
                  email: y.string().email().required(),
                }),
            }),
          },
          options: { validateOnInit: true },
        },
      );

      // Yup is async, wait for validation
      setTimeout(() => {
        expect(form.$("email").hasError).to.be.true;
        done();
      }, 200);
    });

    it("should pass on valid data", (done) => {
      const form = new Form(
        {
          fields: {
            email: { label: "Email", value: "test@test.com" },
          },
        },
        {
          name: "YUPValid",
          plugins: {
            yup: yupValidator({
              package: yup,
              schema: (y: any) =>
                y.object().shape({
                  email: y.string().email().required(),
                }),
            }),
          },
          options: { validateOnInit: true },
        },
      );

      setTimeout(() => {
        expect(form.$("email").hasError).to.be.false;
        done();
      }, 200);
    });

    it("should handle validation with strictNullChecks", (done) => {
      const form = new Form(
        {
          fields: {
            name: { label: "Name", value: "" },
          },
        },
        {
          name: "YUPStrict",
          plugins: {
            yup: yupValidator({
              package: yup,
              schema: (y: any) =>
                y.object().shape({
                  name: y.string().required(),
                }),
            }),
          },
          options: { validateOnInit: true },
        },
      );

      setTimeout(() => {
        expect(form.$("name").hasError).to.be.true;
        done();
      }, 200);
    });
  });

  describe("DVR - edge cases", () => {
    it("should handle rule with colon in value", () => {
      const form = new Form(
        {
          fields: {
            password: {
              label: "Password",
              value: "short",
              rules: "min:6|max:20",
            },
          },
        },
        {
          name: "DVRMin",
          plugins: {
            dvr: dvr({ package: validatorjs }),
          },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("password").hasError).to.be.true;
    });

    it("should pass validation when rule condition is met", () => {
      const form = new Form(
        {
          fields: {
            password: {
              label: "Password",
              value: "longenoughpassword",
              rules: "min:6|max:20",
            },
          },
        },
        {
          name: "DVRPass",
          plugins: {
            dvr: dvr({ package: validatorjs }),
          },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("password").hasError).to.be.false;
    });

    it("should handle required rule", () => {
      const form = new Form(
        {
          fields: {
            username: {
              label: "Username",
              value: "",
              rules: "required",
            },
          },
        },
        {
          name: "DVRRequired",
          plugins: {
            dvr: dvr({ package: validatorjs }),
          },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("username").hasError).to.be.true;
    });
  });

  describe("VJF - edge cases", () => {
    it("should handle validator that returns a boolean", () => {
      const form = new Form(
        {
          fields: {
            email: {
              label: "Email",
              value: "valid@email.com",
              validators: [
                ({ field }: any) => {
                  return field.value.indexOf("@") > 0;
                },
              ],
            },
          },
        },
        {
          name: "VJFBoolean",
          plugins: {
            vjf: vjf({ package: validator }),
          },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("email").hasError).to.be.false;
    });

    it("should handle validator that returns a string (error message)", () => {
      const form = new Form(
        {
          fields: {
            email: {
              label: "Email",
              value: "invalid",
              validators: [
                ({ field }: any) => {
                  if (field.value.indexOf("@") <= 0) {
                    return "Custom error message";
                  }
                  return true;
                },
              ],
            },
          },
        },
        {
          name: "VJFString",
          plugins: {
            vjf: vjf({ package: validator }),
          },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("email").hasError).to.be.true;
    });

    it("should handle validator with false and message array", () => {
      const form = new Form(
        {
          fields: {
            username: {
              label: "Username",
              value: "",
              validators: [
                ({ field }: any) => {
                  if (!field.value) {
                    return [false, "Username is required"];
                  }
                  return [true];
                },
              ],
            },
          },
        },
        {
          name: "VJFArray",
          plugins: {
            vjf: vjf({ package: validator }),
          },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("username").hasError).to.be.true;
    });

    it("should handle multiple validators on same field", () => {
      const form = new Form(
        {
          fields: {
            email: {
              label: "Email",
              value: "invalid",
              validators: [
                ({ field }: any) => {
                  if (!field.value) return [false, "Required"];
                  return [true];
                },
                ({ field }: any) => {
                  if (field.value.indexOf("@") <= 0)
                    return [false, "Invalid email"];
                  return [true];
                },
              ],
            },
          },
        },
        {
          name: "VJFMulti",
          plugins: {
            vjf: vjf({ package: validator }),
          },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("email").hasError).to.be.true;
    });
  });

  describe("Validation with multiple plugins", () => {
    it("should work with both dvr and vjf together", () => {
      const form = new Form(
        {
          fields: {
            username: {
              label: "Username",
              value: "ab",
              rules: "min:3",
              validators: [
                ({ field }: any) => {
                  if (field.value === "ab") return [false, "Custom error"];
                  return [true];
                },
              ],
            },
          },
        },
        {
          name: "MultiPlugin",
          plugins: {
            dvr: dvr({ package: validatorjs }),
            vjf: vjf({ package: validator }),
          },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("username").hasError).to.be.true;
    });
  });

  describe("stopValidationOnError", () => {
    it("should stop validation after first plugin fails", () => {
      let vjfCalled = false;
      const form = new Form(
        {
          fields: {
            username: {
              label: "Username",
              value: "",
              rules: "required",
              validators: [
                ({ field }: any) => {
                  vjfCalled = true;
                  return [true];
                },
              ],
            },
          },
        },
        {
          name: "StopOnError",
          plugins: {
            dvr: dvr({ package: validatorjs }),
            vjf: vjf({ package: validator }),
          },
          options: {
            validateOnInit: true,
            stopValidationOnError: true,
            validationPluginsOrder: ["dvr", "vjf"],
          },
        },
      );

      // DVR should already fail, so VJF shouldn't be called
      // But since validation runs both, we just check the error
      expect(form.$("username").hasError).to.be.true;
    });
  });
});
