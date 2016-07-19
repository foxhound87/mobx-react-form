export function shouldBeEqualTo(fieldName) {
  const $fieldName = fieldName;
  return (field, fields) => {
    const fieldsAreEquals = (fields[$fieldName].getValue() === field.getValue());
    const errorMessage = `The username should be equals to ${$fieldName}`;
    return [fieldsAreEquals, errorMessage];
  };
}
