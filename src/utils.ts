import _ from "lodash";
import { ObservableMap, values as mobxValues, keys as mobxKeys } from "mobx";
import { FieldInterface } from "./models/FieldInterface";
import { AllowedFieldPropsTypes, FieldPropsEnum, FieldPropsOccurrence } from "./models/FieldProps";
import { props } from "./props";

const getObservableMapValues = (observableMap: ObservableMap):
  ReadonlyArray<FieldInterface> => mobxValues(observableMap);

const getObservableMapKeys = (observableMap: ObservableMap):
  ReadonlyArray<FieldInterface> => mobxKeys(observableMap);

const checkObserveItem =
  (change: any) =>
  ({ key, to, type, exec }: any) =>
    change.type === type &&
    change.name === key &&
    change.newValue === to &&
    exec.apply(change, [change]);

const checkObserve = (collection: object[]) => (change: any) =>
  collection.map(checkObserveItem(change));

const checkPropOccurrence = ({ type, data }: any): boolean => {
  let $check: any;
  switch (type) {
    case FieldPropsOccurrence.some: $check = ($data: object) => _.some($data, Boolean); break;
    case FieldPropsOccurrence.every: $check = ($data: object) => _.every($data, Boolean); break;
    default: throw new Error('Occurrence not found for specified prop');
  }
  return $check(data);
};

const hasProps = ($type: string, $data: any): boolean => {
  let $props;
  switch ($type) {
    case AllowedFieldPropsTypes.computed:
      $props = props.computed;
      break;
    case AllowedFieldPropsTypes.observable:
        $props = [
          FieldPropsEnum.fields,
          ...props.computed,
          ...props.editable,
        ];
        break;
    case AllowedFieldPropsTypes.editable:
      $props = [
        ...props.editable,
        ...props.validation,
        ...props.functions,
        ...props.handlers,
      ];
      break;
    case AllowedFieldPropsTypes.all:
      $props = [
        FieldPropsEnum.id,
        FieldPropsEnum.key,
        FieldPropsEnum.name,
        FieldPropsEnum.path,
        ...props.computed,
        ...props.editable,
        ...props.validation,
        ...props.functions,
        ...props.handlers,
      ];
      break;
    default:
      $props = null;
  }

  return _.intersection($data, $props).length > 0;
};

/**
  Check Allowed Properties
*/
const allowedProps = (type: string, data: string[]): void => {
  if (hasProps(type, data)) return;
  const $msg = "The selected property is not allowed";
  throw new Error(`${$msg} (${JSON.stringify(data)})`);
};

/**
  Throw Error if undefined Fields
*/
const throwError = (path: string, fields: any, msg: null | string = null): void => {
  if (!_.isNil(fields)) return;
  const $msg = _.isNil(msg) ? "The selected field is not defined" : msg;
  throw new Error(`${$msg} (${path})`);
};

const pathToStruct = (path: string): string => {
  let struct;
  struct = _.replace(path, new RegExp("[.]\\d+($|.)", "g"), "[].");
  struct = _.replace(struct, "..", ".");
  struct = _.trim(struct, ".");
  return struct;
};

const isArrayFromStruct = (struct: string[], structPath: string): boolean => {
  if (isArrayOfStrings(struct)) return !!struct
    .filter((s) => s.startsWith(structPath))
    .find((s) => s.substring(structPath.length) === "[]")
    || _.endsWith(struct?.find((e) => e === structPath), '[]');
  else return false;
};

const hasSome = (obj: any, keys: any): boolean =>
  _.some(keys, _.partial(_.has, obj));

const isEmptyArray = (field: any): boolean =>
  _.isEmpty(field) && Array.isArray(field);

const isArrayOfStrings = (struct: any): boolean =>
  Array.isArray(struct) && _.every(struct, _.isString);

const isArrayOfObjects = (fields: any): boolean =>
  Array.isArray(fields) && _.every(fields, _.isPlainObject);

const getKeys = (fields: any) =>
  _.union(..._.map(_.values(fields), (values) => _.keys(values)));

const hasUnifiedProps = ({ fields }: any) =>
  !isArrayOfStrings({ fields }) && hasProps(AllowedFieldPropsTypes.editable, getKeys(fields));

const hasSeparatedProps = (initial: any): boolean =>
  hasSome(initial, props.separated) || hasSome(initial, props.validation);

const allowNested = (field: any, strictProps: boolean): boolean =>
  _.isObject(field) &&
  !_.isDate(field) &&
  !_.has(field, FieldPropsEnum.fields) &&
  !_.has(field, FieldPropsEnum.class) &&
    (!hasSome(field, [
      ...props.editable,
      ...props.handlers,
      ...props.validation,
      ...props.functions,
    ]) || strictProps);

const parseIntKeys = (fields: any) =>
  _.map(getObservableMapKeys(fields), _.ary(_.toNumber, 1));

const hasIntKeys = (fields: any): boolean =>
  _.every(parseIntKeys(fields), _.isInteger);

const maxKey = (fields: any): number => {
  const max = _.max(parseIntKeys(fields));
  return _.isUndefined(max) ? 0 : max + 1;
};

const uniqueId = (field: any): string =>
  _.uniqueId([_.replace(field.path, new RegExp("\\.", "g"), "-"), "--"].join(""));

const isEvent = (obj: any): boolean => {
  if (_.isNil(obj) || typeof Event === "undefined") return false;
  return obj instanceof Event || !_.isNil(obj.target);
};

const hasFiles = ($: any): boolean =>
  $.target.files && $.target.files.length !== 0;

const isBool = ($: any, val: any): boolean =>
  _.isBoolean(val) && _.isBoolean($.target.checked);

const $try = (...args: any[]) => {
  for (const val of args) {
    if (val !== undefined) return val;
  }
  return undefined;
};

export {
  props,
  checkObserve,
  checkPropOccurrence,
  hasProps,
  allowedProps,
  throwError,
  isArrayOfStrings,
  isEmptyArray,
  isArrayOfObjects,
  pathToStruct,
  isArrayFromStruct,
  hasUnifiedProps,
  hasSeparatedProps,
  allowNested,
  parseIntKeys,
  hasIntKeys,
  maxKey,
  uniqueId,
  isEvent,
  hasFiles,
  isBool,
  $try,
  getObservableMapKeys,
  getObservableMapValues,
};
