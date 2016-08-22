// define a json schema
const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 20 },
    revenue: { type: 'number' },
    assets: { type: 'number' },
  },
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
};

export default { fields, schema };
