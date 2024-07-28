/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "chai";
import j from "joi";
import FormInterface from "../../../../src/models/FormInterface";
import OptionsModel from "../../../../src/models/OptionsModel";
import { Form } from "../../../../src";
import joi from "../../../../src/validators/JOI";
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

// const schema = z.object({
// 	products: z.array(
// 		z.object({
// 			name: z.string().min(3),
// 			qty: z.number().min(0),
// 			amount: z.number().min(0),
// 		}))
// 		.optional(),
// })

const schema = j.object({
	products: j.array().items(
	  j.object({
		name: j.string().min(3).required(),
		qty: j.number().integer().min(0).required(),
		amount: j.number().min(0).required(),
	  }).optional()
	)
  });

const plugins: ValidationPlugins = {
	joi: joi({
		package: j,
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
	name: "Nested-Z4",
	hooks: {
		onInit(form: FormInterface) {
			describe("Check joi validation flag", () => {
				it('products[0].name hasError should be true', () => expect(form.$('products[0].name').hasError).to.be.true);
				it('products[0].qty hasError should be true', () => expect(form.$('products[0].qty').hasError).to.be.true);
				it('products[0].amount hasError should be true', () => expect(form.$('products[0].amount').hasError).to.be.true);
			});

			describe("Check joi validation errors", () => {
				it('products[0].name error should equal joi error', () => expect(form.$('products[0].name').error).to.be.equal('"products[0].name" length must be at least 3 characters long'));
				it('products[0].qty error should equal joi error', () => expect(form.$('products[0].qty').error).to.be.equal('"products[0].qty" must be greater than or equal to 0'));
				it('products[0].amount error should equal joi error', () => expect(form.$('products[0].amount').error).to.be.equal('"products[0].amount" must be greater than or equal to 0'));
			});

		}
	}
});
