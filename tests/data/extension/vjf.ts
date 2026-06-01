import { FieldInterface } from "../../../src/models/FieldInterface";
import { FormInterface } from "../../../src/models/FormInterface";
import simulateAsyncFindUserCall from "./_.async";

export function checkUser({ field }: { field: FieldInterface }) {
  const msg = `Hey! The username ${field.value} is already taken.`;
  // show error if the call does not returns entries
  return simulateAsyncFindUserCall({ user: field.value }).then((items: any) => [
    items.length === 0,
    msg,
  ]);
}

export function shouldBeEqualTo(target: string) {
  return ({ field, form }: { field: FieldInterface; form: FormInterface }) => {
    const fieldsAreEquals = form.select(target).value === field.value;
    return [
      fieldsAreEquals,
      `The ${field.label} should be equals to ${form.select(target).label}`,
    ] as [boolean, string];
  };
}

export function isEmailByValidator({ field, validator }: { field: FieldInterface; validator: any }) {
  const isValid = validator.isEmail(field.value);
  return [isValid, `The ${field.label} should be an email address.`] as [boolean, string];
}

export function isEmail({ field }: { field: FieldInterface }) {
  const isValid = field.value.indexOf("@") > 0;
  return [isValid, `The ${field.label} should be an email address.`] as [boolean, string];
}

export function isInt({ field }: { field: FieldInterface }) {
  const isValid = Number.isInteger(field.value);
  return [isValid, `The ${field.label} should be an Integer.`] as [boolean, string];
}
