import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as yup from 'yup';
import Form from '../../../../src';
import $yup from "../../../../src/validators/YUP";

const plugins = {
  dvr: $yup({
    package: yup,
    schema: (y: any) =>
      y.object().shape({
        password: y.string().required('Password is required'),
        passwordConfirm: y
          .string()
          .required('Confirm password is required')
          .oneOf([y.ref('password')], 'Passwords must match'),
      }),
  }),
};

const fields = [
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter password',
  },
  {
    name: 'passwordConfirm',
    label: 'Confirm Password',
    placeholder: 'Confirm password',
  },
];

export const form626a = new Form({ fields }, { plugins });


describe('Yup plugin with yup.ref()', () => {
  it('should invalidate passwordConfirm when different from password', async () => {
    form626a.reset()
    form626a.$('password').set('123456');
    form626a.$('passwordConfirm').set('654321');

    await form626a.validate();

    expect(form626a.isValid).to.be.false;
    expect(form626a.$('passwordConfirm').hasError).to.be.true;
    expect(form626a.$('passwordConfirm').error).to.equal('Passwords must match');
  });

  it('should validate when password and passwordConfirm match', async () => {
    form626a.reset()
    form626a.$('password').set('123456');
    form626a.$('passwordConfirm').set('123456');

    await form626a.validate();

    expect(form626a.isValid).to.be.true;
    expect(form626a.$('passwordConfirm').hasError).to.be.false;
  });
});