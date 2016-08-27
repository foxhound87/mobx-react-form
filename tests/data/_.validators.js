export function shouldBeEqualTo($target) {
  const target = $target;
  return ({ field, fields }) => {
    const current = field.label || field.name;
    const fieldsAreEquals = (fields[target].getValue() === field.getValue());
    return [fieldsAreEquals, `The ${current} should be equals to ${target}`];
  };
}

export function isEmail({ field }) {
  const current = field.label || field.name;
  const isValid = (field.value.indexOf('@') > 0);
  return [isValid, `The ${current} should be an email address.`];
}

// export function isEmail({ field, validator }) {
//   const isValid = validator.isEmail(field.value);
//   return [isValid, 'Should be an email address.'];
// }

