# FORM

## Form Constructor

new Form({ fields, schema, options, extend });

* **fields**: represents the fields: name, label, value.

* **schema**: the json-schema for the validation.
See [json-schema.org](http://json-schema.org)

* **options**: the additional options for ajv.
See [github.com/epoberezkin/ajv#options](https://github.com/epoberezkin/ajv#options)

* **extend**: add custom validation keyword for using in the json-schema

## Form API

#### syncValue()
Synchronizes the value of the field `onChange` event.

You must define the name of the field to use this method.

#### isValid()
Check if the form is valid (boolean).

#### isDirty()
Check if the form is dirty (boolean).

#### fieldKeys()
Get an array with all fields names.

#### values()
Get an object with all fields values.

#### clear()
Clear the form to empty values.

#### reset()
Reset the form to initials values.

#### update(obj)
Pass an object to update the form with new values.

#### validate()
Check if the form is valid (boolean).

#### invalidate(err)
Invalidate the form passing a generic error message (string).

---

# Custom Validation Keyword

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

# Custom Validation Function

```javascript
// define custom functions,
// they must return an array with: [boolean, string];

function shouldBeEqualTo(fieldName) {
  const $fieldName = fieldName;
  return (field, fields) => {
    const fieldsAreEquals = (fields[$fieldName].getValue() === field.getValue());
    return [fieldsAreEquals, `The username should be equals to ${$fieldName}`];
  };
}

function isEmail(field) {
  const email = field.value;
  const isValid = (email.indexOf('@') > 0);
  return [isValid, 'Should be an email address.'];
}

// pass them to the field's `validate` property
// as function or as an array of functions

const fields = {
  username: {
    label: 'Username',
    value: 's.jobs@apple.com',
    validate: [isEmail, shouldBeEqualTo('email')],
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
    validate: isEmail,
  },
  ...
};
```
