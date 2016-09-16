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
  revenue: {
    label: 'Revenue (Billion $)',
    value: '233.715',
  },
  assets: {
    label: 'Assets (Billion $)',
    value: 305.277,
  },
  products: {
    label: 'Products',
    value: 'iMac',
  },
  productsMultiselect: {
    label: 'Products - Multiselect (react-select)',
    value: { value: 'watch', label: 'Watch' },
    rules: 'required',
  },
};

export default { fields, schema };
