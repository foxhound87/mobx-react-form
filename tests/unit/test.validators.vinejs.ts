import { expect } from "chai";
import { Vine } from "@vinejs/vine";

import { Form } from "../../src";
import vinejsValidator from "../../src/validators/VINEJS";
import dvr from "../../src/validators/DVR";
import validatorjs from "validatorjs";

describe("Validator Drivers — VINEJS", () => {
  describe("VINEJS - schema validation (async)", () => {
    let vine: any;
    let schema: any;

    beforeEach(() => {
      vine = new Vine();
      schema = vine.object({
        email: vine.string().email(),
        age: vine.number().min(18),
        user: vine.object({
          zip: vine.string().minLength(5),
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
          name: "VINEJSValid",
          plugins: { vinejs: vinejsValidator({ package: vine, schema }) },
          options: { validateOnInit: false },
        },
      );

      return form.validate().then(() => {
        expect(form.$("email").hasError).to.be.false;
        expect(form.$("age").hasError).to.be.false;
        expect(form.$("user.zip").hasError).to.be.false;
      });
    });

    it("should detect invalid email", () => {
      const form = new Form(
        {
          fields: {
            email: { label: "Email", value: "not-an-email" },
            age: { label: "Age", value: 30 },
            user: { fields: [{ name: "zip", label: "ZIP", value: "12345" }] },
          },
        },
        {
          name: "VINEJSInvalid",
          plugins: { vinejs: vinejsValidator({ package: vine, schema }) },
          options: { validateOnInit: false },
        },
      );

      return form.validate().then(() => {
        expect(form.$("email").hasError).to.be.true;
      });
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
          name: "VINEJSMin",
          plugins: { vinejs: vinejsValidator({ package: vine, schema }) },
          options: { validateOnInit: false },
        },
      );

      return form.validate().then(() => {
        expect(form.$("age").hasError).to.be.true;
      });
    });

    it("should handle nested field errors (per-path messages)", () => {
      const form = new Form(
        {
          fields: {
            email: { label: "Email", value: "valid@email.com" },
            age: { label: "Age", value: 30 },
            user: { fields: [{ name: "zip", label: "ZIP", value: "123" }] },
          },
        },
        {
          name: "VINEJSNested",
          plugins: { vinejs: vinejsValidator({ package: vine, schema }) },
          options: { validateOnInit: false },
        },
      );

      return form.validate().then(() => {
        expect(form.$("user.zip").hasError).to.be.true;
      });
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
          name: "VINEJSOrder",
          plugins: {
            vinejs: vinejsValidator({ package: vine, schema }),
            dvr: dvr({ package: validatorjs }),
          },
          options: {
            validateOnInit: false,
            validationPluginsOrder: ["vinejs", "dvr"],
          },
        },
      );

      return form.validate().then(() => {
        expect(form.$("email").hasError).to.be.false;
        expect(form.$("username").hasError).to.be.true;
      });
    });
  });
});