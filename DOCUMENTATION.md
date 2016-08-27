# Index

- [Form Constructor](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#form-constructor)
- [Form Options](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#form-options)
- [Form API](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#form-api)
- [Fields API](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#fields-api)
- [Custom Validation Keywords (extend AJV)](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#custom-validation-keywords-extend-ajv)
- [Custom Validation Functions (without AJV)](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#custom-validation-functions-without-ajv)
- [Remove AJV Warnings from webpack](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#remove-ajv-warnings-from-webpack)

# FORM

## Form Constructor

**Usage:** `new Form({ fields, options, schema, extend });`

|   |   |
|---|---|
| **fields**    | Object which represents the fields: name, label, value. |
| **options**   | Additional options of the form or the AJV validator. See [form options](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#form-options) or [ajv options](https://github.com/epoberezkin/ajv#options) |
| **schema**    | The json-schema for the validation. See [json schema](http://json-schema.org) |
| **extend**    | Add custom validation keyword for using in the json-schema. See [extend ajv](https://github.com/foxhound87/mobx-ajv-form/blob/master/DOCUMENTATION.md#custom-validation-keywords-extend-ajv) |


## Form API

###### Form Options

| Option | Type | Info |
|---|---|---|
| **allowRequired** | boolean | The json-schema `required` property can work only if the object does not contain the field key/value pair, `allowRequired` can remove it when needed to make `required` work properly. Be careful because enabling it will make `minLength` uneffective when the `string` is `empty`. |

###### Form Properties

| Property | Type | MobX Type | Info |
|---|---|---|---|
| **fields** | object | computed | All defined form fields. |
| **isValid** | boolean | computed | Check if the form is valid. |
| **isDirty** | boolean | computed | Check if the form is dirty. |
| **isPristine** | boolean | computed | Check if the form is in pristine state. |
| **isDefault** | boolean | computed | Check if the form is to default state. |
| **isEmpty** | boolean | computed | Check if the form is empty. |
| **hasEmpty** | boolean | computed | Check if the form has errors. |
| **genericError** | string | observable | Generic error message (not related to fields). |
| **genericErrorMessage** | string | observable | Alias of `genericError`. |

###### Form Methods

| Method | Input | Output | Info |
|---|---|---|---|
| **$(key)** | string | object | Field selector shortcut. |
| **syncValue()** | - | - | Synchronizes the value of the field `onChange` event. You must define the `name` of the field to use this method. |
| **fieldKeys()** | - | array | Get an array with all fields keys/names. |
| **update(obj)** | object | - | Pass an object to update the form with new values. |
| **values()** | - | object | Get an object with all fields values. |
| **clear()** | - | - | Clear the form to empty values. |
| **reset()** | - | - | Reset the form to default or initials values. |
| **validate()** | - | boolean | Check if the form is valid. |
| **invalidate(err)** | string | - | Invalidate the form passing a generic error message. |


## Fields API

###### Fields Properties

| Property | Type | MobX Type | Info |
|---|---|---|---|
| **key** | string | - | Field key (set on form constructor) |
| **name** | string | - | Field name or key (set on form constructor) |
| **label** | string | - | Field label name (set on form constructor) |
| **value** | string, array, object, boolean | computed | Computed value of the field. |
| **default** | boolean | - | The default/initial value of the field. |
| **disabled** | boolean | - | The disabled state of the field. |
| **isValid** | boolean | computed | Check if the field is valid. |
| **isDirty** | boolean | computed | Check if the field is dirty. |
| **isPristine** | boolean | computed | Check if the field is pristine. |
| **isDefault** | boolean | computed | Check if the field is to default value. |
| **isEmpty** | boolean | computed | Check if the field is empty. |
| **hasError** | boolean | computed | Check if the field has errors. |
| **error** | string | observable | Field error message. |
| **errorMessage** | string | observable | Alias of `error`. |

###### Fields Methods

| Property | Input | Output | Info |
|---|---|---|---|
| **getValue()** | - | string, array, object, boolean | Get the field value. |
| **setValue(val)** | string, array, object, boolean | - | Set the field value to the given value. |
| **update(val)** | string, array, object, boolean | - | Alias of setValue(). |
| **clear()** | - | - | Clear the field to empty value. |
| **reset()** | - | - | Reset the field to initial value. |
| **setValid()** | - | - | Set the field as valid. |
| **setInvalid(showErrors = true)** | boolean | - | Set the field as invalid. If true is passed, no errors are shown. |


---

# Custom Validation Keywords (extend AJV)

```javascript
// define an 'extend' object with the custom keyword

const extend = {
  range: {
    type: 'number',
    compile: (sch, parentSchema) => {
      const min = sch[0];
      const max = sch[1];

      return parentSchema.exclusiveRange === true
              ? (data) => (data > min && data < max)
              : (data) => (data >= min && data <= max);
    },
  },
};

// then use it the schema

var schema = {
  type: 'object',
  properties: {
    fieldname: {
      "range": [2, 4],
      "exclusiveRange": true,
    },
  },
};

// pass all to the form constructor

new Form({ fields, schema, extend });

```

---

# Custom Validation Functions (without AJV)

```javascript
// define custom functions,
// they must return an array with: [boolean, string];

function shouldBeEqualTo($target) {
  const target = $target;
  return ({ field, fields }) => {
    const current = field.label || field.name;
    const fieldsAreEquals = (fields[target].getValue() === field.getValue());
    return [fieldsAreEquals, `The ${current} should be equals to ${target}`];
  };
}

function isEmail({ field }) {
  const current = field.label || field.name;
  const isValid = (field.value.indexOf('@') > 0);
  return [isValid, `The ${current} should be an email address.`];
}

// pass them to the field's `validate` property
// as function or as an array of functions
// and set `related` fields to be validated at the same time

const fields = {
  username: {
    label: 'Username',
    value: 's.jobs@apple.com',
    validate: [isEmail, shouldBeEqualTo('email')],
    related: ['email'],
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
    validate: isEmail,
    related: ['username'],
  },
  ...
};
```

---

## Remove AJV Warnings from webpack

Add this line to your webpack config in the `plugins` array:

```javascript
new webpack.IgnorePlugin(/regenerator|nodent|js\-beautify/, /ajv/)
```
