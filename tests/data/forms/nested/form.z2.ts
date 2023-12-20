/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "chai";
import z from "zod";
import FormInterface from "../../../../src/models/FormInterface";
import OptionsModel from "../../../../src/models/OptionsModel";
import { Form } from "../../../../src";
import zod from "../../../../src/validators/ZOD";
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

const schema = z.object({
	products: z.array(
		z.object({
			name: z.string().min(3),
			qty: z.number().min(0),
			amount: z.number().min(0),
		}))
		.optional(),
})

const plugins: ValidationPlugins = {
	zod: zod({
		package: z,
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
}, {
	plugins,
	options,
	name: "Nested-Z2",
	hooks: {
		onInit(form: FormInterface) {
			describe("Check zod validation flag", () => {
				it('products[0].name hasError should be true', () => expect(form.$('products[0].name').hasError).to.be.true);
				it('products[0].qty hasError should be true', () => expect(form.$('products[0].qty').hasError).to.be.true);
				it('products[0].amount hasError should be true', () => expect(form.$('products[0].amount').hasError).to.be.true);
			});

			describe("Check zod validation errors", () => {
				it('products[0].name error should equal zod error', () => expect(form.$('products[0].name').error).to.be.equal('String must contain at least 3 character(s)'));
				it('products[0].qty error should equal zod error', () => expect(form.$('products[0].qty').error).to.be.equal('Number must be greater than or equal to 0'));
				it('products[0].amount error should equal zod error', () => expect(form.$('products[0].amount').error).to.be.equal('Number must be greater than or equal to 0'));
			});

		}
	}
});
