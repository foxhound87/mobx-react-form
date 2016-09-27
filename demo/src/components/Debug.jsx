import React from 'react';
import { observer } from 'mobx-react';
import jsonStringifySafe from 'json-stringify-safe';
import _ from 'lodash';

const merge = field => ({
  value: field.value,
  default: field.default,
  label: field.label,
  disabled: field.disabled,
  related: field.related,
  rules: field.rules,
  validate: field.validate,
  isEmpty: field.isEmpty,
  isDefault: field.isDefault,
  isPristine: field.isPristine,
  isDirty: field.isDirty,
  isValid: field.isValid,
  hasError: field.hasError,
  error: field.error,
});

const toJson = (data) => {
  const $data = jsonStringifySafe(data);
  return JSON.stringify(JSON.parse($data), null, 2);
};

const parseFormData = (form) => {
  const omit = ['schema', 'extend', 'validator', 'events'];
  return toJson(_.merge(_.omit(form, omit), merge(form)));
};

const parseFieldData = (field) => {
  const omit = [
    'name',
    '$value',
    '$related',
    '$label',
    '$rules',
    '$validate',
    '$disabled',
    'showError',
    'errorMessage',
    'initialValue',
    'defaultValue',
    'asyncErrorMessage',
    'validationAsyncData',
    'validationErrorStack',
    'validationFunctionsData',
    'validateProperty',
  ];

  return toJson(_.merge(_.omit(field, omit), merge(field)));
};

export const DebugField = observer(({ field }) => (
  <div>
    <h4>{field.label}</h4>
    <pre>
      {parseFieldData(field)}
    </pre>
  </div>
));

export const DebugForm = observer(({ form }) => (
  <div>
    <h4>Form</h4>
    <pre>
      {parseFormData(form)}
    </pre>
    <hr />
  </div>
));
