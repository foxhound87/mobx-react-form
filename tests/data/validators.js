export function shouldBeEqualTo(fieldName) {
  const $fieldName = fieldName;
  return (field, fields) => {
    const fieldsAreEquals = (fields[$fieldName].getValue() === field.getValue());
    return [fieldsAreEquals, `The username should be equals to ${$fieldName}`];
  };
}

export function isEmail(field) {
  const email = field.value;
  const isValid = (email.indexOf('@') > 0);
  return [isValid, 'Should be an email address.'];
}
