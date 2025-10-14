import { expect } from "chai";
import MobxReactForm from "../../../src";
import FormInterface, {
  FieldsDefinitions,
  FormConfig,
} from "../../../src/models/FormInterface";

class FormExtra extends MobxReactForm {
  constructor(props: FieldsDefinitions, config: FormConfig) {
    super(props, config);
  }

  setup(form: FormInterface): void {
    describe("Form.extra", () => {
      it("should be an object", () => {
        expect(form.extra).to.be.an("object");
        expect(form.extra.foo).to.be.equal("bar");
        expect(form.extra.fn()).to.be.true;
      });
    });
  }

  options(form: FormInterface): void {
    describe("Form.extra", () => {
      it("should be an object", () => {
        expect(form.extra).to.be.an("object");
        expect(form.extra.foo).to.be.equal("bar");
        expect(form.extra.fn()).to.be.true;
      });
    });
  }

  plugins(form: FormInterface): void {
    describe("Form.extra", () => {
      it("should be an object", () => {
        expect(form.extra).to.be.an("object");
        expect(form.extra.foo).to.be.equal("bar");
        expect(form.extra.fn()).to.be.true;
      });
    });
  }

  bindings(form: FormInterface): void {
    describe("Form.extra", () => {
      it("should be an object", () => {
        expect(form.extra).to.be.an("object");
        expect(form.extra.foo).to.be.equal("bar");
        expect(form.extra.fn()).to.be.true;
      });
    });
  }
}

export default new FormExtra({}, { extra: { foo: "bar", fn: () => true } });
