import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import JSONTree from 'react-json-tree';
import _ from 'lodash';

const fieldPropsToPick = [
  'path',
  'value',
  'label',
  'disabled',
  'default',
  'initial',
  'hasError',
  'isValid',
  'isEmpty',
  'isDefault',
  'isPristine',
  'isDirty',
  'error',
  'related',
];

const parseFormData = form =>
  toJS(_.pick(form, [
    'hasError',
    'isValid',
    'isEmpty',
    'isDefault',
    'isPristine',
    'isDirty',
  ]));

const parseFieldsData = fields =>
  _.reduce(fields.values(), (obj, field) => {
    const $nested = $fields => ($fields.size !== 0)
      ? parseFieldsData($fields)
      : undefined;

    const data = toJS(_.pick(field, fieldPropsToPick));

    Object.assign(obj, {
      [field.key]: Object.assign(data, {
        fields: $nested(field.fields),
      }),
    });

    return obj;
  }, {});

export default observer(({ form }) => (
  <div>
    <h3>Form</h3>
    <JSONTree data={parseFormData(form)} />
    <h3>Fields</h3>
    <JSONTree data={parseFieldsData(form.fields)} />
  </div>
));
