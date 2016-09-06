// define a json schema
const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 15 },
    revenue: { type: 'number' },
    assets: { type: 'number' },
  },
  required: ['name'],
};

// define fields
const fields = {
  name: {
    label: 'Company Name',
    value: 'Apple',
  },
  founded: {
    label: 'Founded - DateTimePicker (react-widgets)',
    value: new Date(1976, 3, 1),
  },
  revenue: {
    label: 'Revenue (Billion $)',
    value: '233.715',
  },
  assets: {
    label: 'Assets (Billion $)',
    value: 305.277,
  },
  productsDropdown: {
    label: 'Products - Dropdown (react-widgets)',
    value: 'iMac',
  },
  productsMultiselect: {
    label: 'Products - Multiselect (react-widgets)',
    value: ['iMac', 'iPhone'],
    rules: 'required',
  },
};

export default { fields, schema };
