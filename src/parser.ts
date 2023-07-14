import _ from "lodash";
import { FieldPropsEnum, SeparatedPropsMode } from "./models/FieldProps";
import {
  $try,
  isArrayOfStrings,
  isArrayOfObjects,
  hasUnifiedProps,
  allowNested,
  pathToStruct,
  isEmptyArray,
} from "./utils";

const defaultValue = ({
  type = undefined,
  value = undefined,
  isEmptyArray = false,
  fallbackValueOption = "",
}: any): null | false | 0 | [] | "" => {
  if (Array.isArray(value) || isEmptyArray) return [];
  if (_.isDate(value) || type === "date" || type === "datetime-local") return null;
  if (_.isNumber(value) || type === "number") return 0;
  if (_.isBoolean(value) || type === "checkbox") return false;
  if (_.isString(value) || type === "file") return "";
  return fallbackValueOption;
};

const parsePath = (path: string): string => {
  let $path = path;
  $path = _.replace($path, new RegExp("\\[", "g"), ".");
  $path = _.replace($path, new RegExp("\\]", "g"), "");
  return $path;
};

const parseInput = (
  input: any,
  { fallbackValueOption = "", type, isEmptyArray, separated, unified, fallback }: any
) =>
  input(
    $try(
      separated,
      unified,
      fallback,
      defaultValue({
        fallbackValueOption,
        type,
        isEmptyArray,
      })
    )
  );

const parseArrayProp = (val: any, prop: string, removeNullishValuesInArrays: boolean): any => {
  const values = _.values(val);
  const isValProp: boolean = ([
    FieldPropsEnum.value,
    FieldPropsEnum.initial,
    FieldPropsEnum.default,
  ] as string[]).includes(prop)

  if (removeNullishValuesInArrays && isValProp) {
    return _.without(values, ...[null, undefined, ""]);
  }

  return values;
};

const parseCheckArray = (field: any, value: any, prop: string, removeNullishValuesInArrays: boolean) => {
  if (field.incremental && _.isObject(value) && _.isEmpty(value)) return [];
  return field.hasIncrementalKeys ? parseArrayProp(value, prop, removeNullishValuesInArrays) : value;
}

const parseCheckOutput = (field: any, prop: string, retrieveNullifiedEmptyStrings = false) => {
  if (prop === FieldPropsEnum.value || prop.startsWith("value.")) {
    const base = field.$output ? field.$output(field[FieldPropsEnum.value]) : field[FieldPropsEnum.value]
    const value = prop.startsWith("value.") ? _.get(base, prop.substring(6)) : base
    if (_.isString(value) && _.isEmpty(value) && retrieveNullifiedEmptyStrings) return null
    return value;
  }
  return field[prop];
}

const defineFieldsFromStruct = (struct: string[], add: boolean = false) =>
  _.reduceRight(
    struct,
    ($, name) => {
      const obj: any = {};
      if (_.endsWith(name, "[]")) {
        const val = add ? [$] : [];
        obj[_.trimEnd(name, "[]")] = val;
        return obj;
      }
      // no brakets
      const prev = struct[struct.indexOf(name) - 1];
      const stop = _.endsWith(prev, "[]") && _.last(struct) === name;
      if (!add && stop) return obj;
      obj[name] = $;
      return obj;
    },
    {}
  );

const handleFieldsArrayOfStrings = ($fields: any, add = false) => {
  let fields = $fields;
  // handle array with field struct (strings)
  if (isArrayOfStrings(fields)) {
    fields = _.transform(
      fields,
      ($obj, $) => {
        const pathStruct = _.split($, ".");
        // as array of strings (with empty values)
        if (!pathStruct.length) return Object.assign($obj, { [$]: "" });
        // define flat or nested fields from pathStruct
        return _.merge($obj, defineFieldsFromStruct(pathStruct, add));
      },
      {}
    );
  }
  return fields;
};

const handleFieldsArrayOfObjects = ($fields: any) => {
  let fields = $fields;
  // handle array of objects (with unified props)
  if (isArrayOfObjects(fields)) {
    fields = _.transform(
      fields,
      ($obj, field) => {
        if (hasUnifiedProps({ fields: { field } }) && !_.has(field, FieldPropsEnum.name)) return undefined;
        return Object.assign($obj, { [field.name]: field });
      },
      {}
    );
  }
  return fields;
};

const handleFieldsNested = (fields: any, strictProps: boolean = true): any =>
  _.transform(
    fields,
    (obj, field, key) => {
      if (allowNested(field, strictProps)) {
        // define nested field
        return Object.assign(obj, {
          [key]: {
            fields: isEmptyArray(field) ? [] : handleFieldsNested(field),
          },
        });
      }
      return Object.assign(obj, { [key]: field });
    },
    {}
  );

/* mapNestedValuesToUnifiedValues

FROM:

{
  street: '123 Fake St.',
  zip: '12345',
}

TO:

[{
  name: 'street'
  value: '123 Fake St.',
}, {
  name: 'zip'
  value: '12345',
}]

*/
const mapNestedValuesToUnifiedValues = (data: object): any =>
  _.isPlainObject(data)
    ? _.map(data, (value, name) => ({ value, name }))
    : undefined;

/* reduceValuesToUnifiedFields

FROM:

{
  name: 'fatty',
  address: {
    street: '123 Fake St.',
    zip: '12345',
  },
};

TO:

{
  name: {
    value: 'fatty',
    fields: undefined
  },
  address: {
    value: {
      street: '123 Fake St.',
      zip: '12345'
    },
    fields: [ ... ]
  },
};

*/
const reduceValuesToUnifiedFields = (values: object): object =>
  _.transform(
    values,
    (obj, value, key) =>
      Object.assign(obj, {
        [key]: {
          value,
          fields: mapNestedValuesToUnifiedValues(value),
        },
      }),
    {}
  );

/*
  Fallback Unified Props to Separated Mode
*/
const handleFieldsPropsFallback = (
  fields: any,
  initial: any,
  fallback: any
) => {
  if (!_.has(initial, SeparatedPropsMode.values)) return fields;
  // if the 'values' object is passed in constructor
  // then update the fields definitions
  let { values } = initial;
  if (hasUnifiedProps({ fields: initial.fields })) {
    values = reduceValuesToUnifiedFields(values);
  }
  return _.merge(
    fields,
    _.transform(
      values,
      (result: any, v, k) => {
        if (Array.isArray(fields[k])) result[k] = v;
        if (!(k in fields) && (!isNaN(Number(k)) || fallback)) result[k] = v;
      },
      {}
    )
  );
};

const mergeSchemaDefaults = (fields: any, validator: any) => {
  if (validator) {
    const schema = _.get(validator.plugins, "svk.config.schema");
    if (_.isEmpty(fields) && schema && !!schema.properties) {
      _.each(schema.properties, (prop, key) => {
        _.set(fields, key, {
          value: prop.default,
          label: prop.title,
        });
      });
    }
  }
  return fields;
};

const prepareFieldsData = (
  initial: any,
  strictProps: boolean = true,
  fallback: boolean = true,
) => {
  let fields = _.merge(
    handleFieldsArrayOfStrings(initial.fields, false),
    handleFieldsArrayOfStrings(initial.struct, false)
  );

  fields = handleFieldsArrayOfObjects(fields);
  fields = handleFieldsPropsFallback(fields, initial, fallback);
  fields = handleFieldsNested(fields, strictProps);

  return fields;
};

const pathToFieldsTree = (
  struct: string[],
  path: string,
  n: number = 0,
  add: boolean = false
) => {
  const structPath = pathToStruct(path);
  const structArray = _.filter(struct, (item) =>
    _.startsWith(item, structPath)
  );
  const $tree = handleFieldsArrayOfStrings(structArray, add);
  const $struct = _.replace(structPath, new RegExp("\\[]", "g"), `[${n}]`);
  const fields = handleFieldsNested(_.get($tree, $struct));

  // fix issues #614 & #615
  struct.length && struct
    .filter(s => s.startsWith(path + '[]'))
    .map(s => s.substring((path + '[].').length))
    .filter(s => s.endsWith('[]'))
    .map(s => s.substring(0, s.length - 2))
    .forEach(s => {
      const ss = s.split('.')
      let t = fields[0]?.fields
      for (let i = 0; i < ss.length; i++) {
        t = t?.[ss[i]]?.[FieldPropsEnum.fields]
        if (!t) break;
      }
      if (t)
        delete t[0]
    });

  return fields;
};

export {
  defaultValue,
  parseInput,
  parsePath,
  parseArrayProp,
  parseCheckArray,
  parseCheckOutput,
  mergeSchemaDefaults,
  handleFieldsNested,
  handleFieldsArrayOfStrings,
  prepareFieldsData,
  pathToFieldsTree,
};
