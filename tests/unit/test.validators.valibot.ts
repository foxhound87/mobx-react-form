import { expect } from "chai";
import * as v from "valibot";

import { Form } from "../../src";
import valibotValidator from "../../src/validators/VALIBOT";
import dvr from "../../src/validators/DVR";
import validatorjs from "validatorjs";

describe("Validator Drivers — VALIBOT", () => {
  describe("VALIBOT - schema validation (sync)", () => {
    let schema: any;

    beforeEach(() => {
      schema = v.object({
        email: v.pipe(v.string(), v.email()),
        age: v.pipe(v.number(), v.minValue(18)),
        user: v.object({
          zip: v.pipe(v.string(), v.minLength(5)),
        }),
      });
    });

    it("should pass on valid data", () => {
      const form = new Form(
        {
          fields: {
            email: { label: "Email", value: "valid@email.com" },
            age: { label: "Age", value: 30 },
            user: { fields: [{ name: "zip", label: "ZIP", value: "12345" }] },
          },
        },
        {
          name: "VALIBOTValid",
          plugins: { valibot: valibotValidator({ schema }) },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("email").hasError).to.be.false;
      expect(form.$("age").hasError).to.be.false;
      expect(form.$("user.zip").hasError).to.be.false;
    });

    it("should detect invalid email and set validationErrorStack", () => {
      const form = new Form(
        {
          fields: {
            email: { label: "Email", value: "not-an-email" },
            age: { label: "Age", value: 30 },
            user: { fields: [{ name: "zip", label: "ZIP", value: "12345" }] },
          },
        },
        {
          name: "VALIBOTInvalid",
          plugins: { valibot: valibotValidator({ schema }) },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("email").hasError).to.be.true;
      expect(form.$("email").validationErrorStack).to.not.be.empty;
    });

    it("should detect min value violation", () => {
      const form = new Form(
        {
          fields: {
            email: { label: "Email", value: "valid@email.com" },
            age: { label: "Age", value: 15 },
            user: { fields: [{ name: "zip", label: "ZIP", value: "12345" }] },
          },
        },
        {
          name: "VALIBOTMin",
          plugins: { valibot: valibotValidator({ schema }) },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("age").hasError).to.be.true;
    });

    it("should handle nested field errors (path)", () => {
      const form = new Form(
        {
          fields: {
            email: { label: "Email", value: "valid@email.com" },
            age: { label: "Age", value: 30 },
            user: { fields: [{ name: "zip", label: "ZIP", value: "123" }] },
          },
        },
        {
          name: "VALIBOTNested",
          plugins: { valibot: valibotValidator({ schema }) },
          options: { validateOnInit: true },
        },
      );

      expect(form.$("user.zip").hasError).to.be.true;
    });

    it("should support validationPluginsOrder with other plugins", () => {
      const form = new Form(
        {
          fields: {
            username: {
              label: "Username",
              value: "ab",
              rules: "min:5|max:20",
            },
            email: { label: "Email", value: "valid@email.com" },
            age: { label: "Age", value: 30 },
            user: { fields: [{ name: "zip", label: "ZIP", value: "12345" }] },
          },
        },
        {
          name: "VALIBOTOrder",
          plugins: {
            valibot: valibotValidator({ schema }),
            dvr: dvr({ package: validatorjs }),
          },
          options: {
            validateOnInit: true,
            validationPluginsOrder: ["valibot", "dvr"],
          },
        },
      );

      expect(form.$("email").hasError).to.be.false;
      expect(form.$("username").hasError).to.be.true;
    });
  });
});