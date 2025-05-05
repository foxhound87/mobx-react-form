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
        subscribe: y.boolean(),
        email: y.string().when('subscribe', {
          is: true,
          then: (schema: any) => schema.required('Email is required if subscribed'),
          otherwise: (schema: any) => schema.notRequired(),
        }),
      }),
  }),
};

const fields = [
  {
    name: 'subscribe',
    label: 'Subscribe',
    type: 'checkbox',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
  },
];

export const form626b = new Form({ fields }, { plugins });


describe('Yup plugin with yup.when()', () => {
  it('should require email when subscribe is true', async () => {
    form626b.reset();
    form626b.$('subscribe').set(true);
    form626b.$('email').set('');

    await form626b.validate();

    expect(form626b.isValid).to.be.false;
    expect(form626b.$('email').hasError).to.be.true;
    expect(form626b.$('email').error).to.equal('Email is required if subscribed');
  });

  it('should not require email when subscribe is false', async () => {
    form626b.reset();
    form626b.$('subscribe').set(false);
    form626b.$('email').set('');

    await form626b.validate();

    expect(form626b.isValid).to.be.true;
    expect(form626b.$('email').hasError).to.be.false;
  });

  it('should pass validation if email is set when subscribe is true', async () => {
    form626b.reset();
    form626b.$('subscribe').set(true);
    form626b.$('email').set('test@example.com');

    await form626b.validate();

    expect(form626b.isValid).to.be.true;
    expect(form626b.$('email').hasError).to.be.false;
  });
});