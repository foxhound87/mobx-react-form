/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "chai";
import z from "zod";
import FormInterface from "../../../../src/models/FormInterface";
import OptionsModel from "../../../../src/models/OptionsModel";
import { Form } from "../../../../src";
import zod from "../../../../src/validators/ZOD";
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

const schema = z.object({
	user: z.object({
		username: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(6).max(25),
		passwordConfirm: z.string().min(6).max(25),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords do not match",
		path: ["passwordConfirm"], // path of error
	})
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
	name: "Nested-Z1",
	hooks: {
		onInit(form: FormInterface) {
			describe("Check zod validation flag", () => {
				it('user.username hasError should be true', () => expect(form.$('user.username').hasError).to.be.true);
				it('user.email hasError should be true', () => expect(form.$('user.email').hasError).to.be.true);
				it('user.password hasError should be true', () => expect(form.$('user.password').hasError).to.be.true);
				it('user.passwordConfirm hasError should be true', () => expect(form.$('user.passwordConfirm').hasError).to.be.true);
			});

			describe("Check zod validation errors", () => {
				it('user.username error should equal zod error', () => expect(form.$('user.username').error).to.be.equal('String must contain at least 3 character(s)'));
				it('user.email error should equal zod error', () => expect(form.$('user.email').error).to.be.equal('Invalid email'));
				it('user.password error should equal zod error', () => expect(form.$('user.password').error).to.be.equal('String must contain at least 6 character(s)'));
				it('user.passwordConfirm error should equal zod error', () => expect(form.$('user.passwordConfirm').error).to.be.equal('Passwords do not match'));
			});

		}
	}
});
