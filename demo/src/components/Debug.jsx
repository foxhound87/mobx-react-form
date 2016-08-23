import React from 'react';
import { observer } from 'mobx-react';
import jsonStringifySafe from 'json-stringify-safe';
import _ from 'lodash';

const merge = (field) => ({
  default: field.default,
  error: field.error,
  hasError: field.hasError,
  isValid: field.isValid,
  isDirty: field.isDirty,
  isPristine: field.isPristine,
  isDefault: field.isDefault,
  isEmpty: field.isEmpty,
  value: field.value,
});

const toJson = (data) => {
  const $data = jsonStringifySafe(data);
  return JSON.stringify(JSON.parse($data), null, 2);
};

const parseFormData = (form) => {
  const omit = ['fields', 'schema', 'extend', 'options'];
  return toJson(_.merge(_.omit(form, omit), merge(form)));
};

const parseFieldData = (field) => {
  const omit = [
    '$valid',
    '$value',
    'form',
    'related',
    'label',
    'name',
    'key',
    'disabled',
    'errorMessage',
    'originalValue',
    'validationFunctionsValues',
    'validateProperty',
  ];

  return toJson(_.merge(_.omit(field, omit), merge(field)));
};

export const DebugForm = observer(({ form }) => (
  <div>
    <h4>Form</h4>
    <pre>
      {parseFormData(form)}
    </pre>
  </div>
));

export const DebugField = observer(({ field }) => (
  <div>
    <h4>{field.label}</h4>
    <pre>
      {parseFieldData(field)}
    </pre>
  </div>
));
