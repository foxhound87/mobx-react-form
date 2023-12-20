/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "chai";
import ajv from "ajv";
import FormInterface from "../../../../src/models/FormInterface";
import OptionsModel from "../../../../src/models/OptionsModel";
import { Form } from "../../../../src";
import svk from "../../../../src/validators/SVK";
import { ValidationPlugins } from "../../../../src/models/ValidatorInterface";


const fields = [
	"products[].name",
	"products[].qty",
	"products[].amount",
];

const values = {
	products: [{
		name: 'a',
		qty: -1,
		amount: -1,
	}]
}

const labels = {
  'products[].qty': 'Quantity',
  'products[].amount': 'Amount',
};

const schema = {
  type: "object",
  properties: {
    products: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          qty: {
            type: "integer",
            minimum: 0,
          },
          amount: {
            type: "number",
            minimum: 0,
          },
        },
      }
    },
  },
};

const plugins: ValidationPlugins = {
	svk: svk({
		package: ajv,
		schema,
	}),
};

const options: OptionsModel = {
	validateOnInit: true,
	showErrorsOnInit: true,
};

export default new Form({
	fields,
	values,
  labels,
}, {
	plugins,
	options,
	name: "Nested-E2",
	hooks: {
		onInit(form: FormInterface) {
			describe("Check ajv validation flag", () => {
				it('products[0].qty hasError should be true', () => expect(form.$('products[0].qty').hasError).to.be.true);
				it('products[0].amount hasError should be true', () => expect(form.$('products[0].amount').hasError).to.be.true);
			});

			describe("Check ajv validation errors", () => {
				it('products[0].qty error should equal zod error', () => expect(form.$('products[0].qty').error).to.be.equal('Quantity should be >= 0'));
				it('products[0].amount error should equal zod error', () => expect(form.$('products[0].amount').error).to.be.equal('Amount should be >= 0'));
			});

		}
	}
});
