/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "chai";
import j from "joi";
import FormInterface from "../../../../src/models/FormInterface";
import OptionsModel from "../../../../src/models/OptionsModel";
import { Form } from "../../../../src";
import joi from "../../../../src/validators/JOI";
import { ValidationPlugins } from "../../../../src/models/ValidatorInterface";


const fields = [
	"user.username",
	"user.email",
	"user.password",
	"user.passwordConfirm",
];

const values = {
	user: {
		username: 'a',
		email: 'notAValidEmail@',
		password: 'x',
		passwordConfirm: 'mysecretpassword',
	}
}

const schema = j.object({
	user: j.object({
		username: j.string().min(3).required().label('Username'),
		email: j.string().email().required(),
		password: j.string().min(6).max(25).required(),
		passwordConfirm: j.string().min(6).max(25).valid(j.ref('password')).required().messages({
			'any.only': 'Passwords do not match',
			'any.required': 'Password confirmation is required',
		  }),
	}).required()
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
	name: "Nested-Z3",
	hooks: {
		onInit(form: FormInterface) {
			describe("Check joi validation flag", () => {
				it('user.username hasError should be true', () => expect(form.$('user.username').hasError).to.be.true);
				it('user.email hasError should be true', () => expect(form.$('user.email').hasError).to.be.true);
				it('user.password hasError should be true', () => expect(form.$('user.password').hasError).to.be.true);
				it('user.passwordConfirm hasError should be true', () => expect(form.$('user.passwordConfirm').hasError).to.be.true);
			});

			describe("Check joi validation errors", () => {
				it('user.username error should equal joi error', () => expect(form.$('user.username').error).to.be.equal('"Username" length must be at least 3 characters long'));
				it('user.email error should equal joi error', () => expect(form.$('user.email').error).to.be.equal('"user.email" must be a valid email'));
				it('user.password error should equal joi error', () => expect(form.$('user.password').error).to.be.equal('"user.password" length must be at least 6 characters long'));
				it('user.passwordConfirm error should equal joi error', () => expect(form.$('user.passwordConfirm').error).to.be.equal('Passwords do not match'));
			});

		}
	}
});
