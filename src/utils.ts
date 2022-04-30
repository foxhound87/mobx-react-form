import _ from "lodash";
import { values as mobxValues, keys as mobxKeys } from "mobx";

import { props } from "./props";

const getObservableMapValues = (observableMap: any) =>
  mobxValues(observableMap);

const getObservableMapKeys = (observableMap: any) => mobxKeys(observableMap);

const checkObserveItem =
  (change: any) =>
  ({ key, to, type, exec }: any) =>
    change.type === type &&
    change.name === key &&
    change.newValue === to &&
    exec.apply(change, [change]);

const checkObserve = (collection: object[]) => (change: any) =>
  collection.map(checkObserveItem(change));

const checkPropType = ({ type, data }: any) => {
  let $check: any;
  switch (type) {
    case "some":
      $check = ($data: object) => _.some($data, Boolean);
      break;
    case "every":
      $check = ($data: object) => _.every($data, Boolean);
      break;
    default:
      $check = null;
  }
  return $check(data);
};

const hasProps = ($type: any, $data: any) => {
  let $props;
  switch ($type) {
    case "computed":
      $props = props.computed;
      break;
    case "field":
      $props = [
        ...props.field,
        ...props.validation,
        ...props.functions,
        ...props.handlers,
      ];
      break;
    case "all":
      $props = [
        "id",
        ...props.computed,
        ...props.field,
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
const allowedProps = (type: string, data: string[]) => {
  if (hasProps(type, data)) return;
  const $msg = "The selected property is not allowed";
  throw new Error(`${$msg} (${JSON.stringify(data)})`);
};

/**
  Throw Error if undefined Fields
*/
const throwError = (path: string, fields: any, msg: null | string = null) => {
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

const hasSome = (obj: any, keys: any) => _.some(keys, _.partial(_.has, obj));

const isStruct = (struct: any) =>
  _.isArray(struct) && _.every(struct, _.isString);

const isEmptyArray = (field: any) => _.isEmpty(field) && _.isArray(field);

const isArrayOfObjects = (fields: any) =>
  _.isArray(fields) && _.every(fields, _.isPlainObject);

const $getKeys = (fields: any) =>
  _.union(..._.map(_.values(fields), (values) => _.keys(values)));

const hasUnifiedProps = ({ fields }: any) =>
  !isStruct({ fields }) && hasProps("field", $getKeys(fields));

const hasSeparatedProps = (initial: any) =>
  hasSome(initial, props.separated) || hasSome(initial, props.validation);

const allowNested = (field: any, strictProps: boolean): boolean =>
  _.isObject(field) &&
  !_.isDate(field) &&
  !_.has(field, "fields") &&
  (!hasSome(field, [
    ...props.field,
    ...props.validation,
    ...props.functions,
    ...props.handlers,
  ]) ||
    strictProps);

const parseIntKeys = (fields: any) =>
  _.map(getObservableMapKeys(fields), _.ary(_.toNumber, 1));

const hasIntKeys = (fields: any): boolean =>
  _.every(parseIntKeys(fields), _.isInteger);

const maxKey = (fields: any): number => {
  const max = _.max(parseIntKeys(fields));
  return _.isUndefined(max) ? 0 : max + 1;
};

const uniqueId = (field: any): string =>
  _.uniqueId(
    [_.replace(field.path, new RegExp("\\.", "g"), "-"), "--"].join("")
  );

const $isEvent = (obj: any): boolean => {
  if (_.isNil(obj) || typeof Event === "undefined") return false;
  return obj instanceof Event || !_.isNil(obj.target); // eslint-disable-line
};

const $hasFiles = ($: any): boolean =>
  $.target.files && $.target.files.length !== 0;

const $isBool = ($: any, val: any): boolean =>
  _.isBoolean(val) && _.isBoolean($.target.checked);

const $try = (...args: any) => {
  let found: any | null = null;

  args.map(
    (
      val: any // eslint-disable-line
    ) => found === null && !_.isNil(val) && (found = val)
  );

  return found;
};

export {
  props,
  checkObserve,
  checkPropType,
  hasProps,
  allowedProps,
  throwError,
  isStruct,
  isEmptyArray,
  isArrayOfObjects,
  pathToStruct,
  hasUnifiedProps,
  hasSeparatedProps,
  allowNested,
  parseIntKeys,
  hasIntKeys,
  maxKey,
  uniqueId,
  $isEvent,
  $hasFiles,
  $isBool,
  $try,
  getObservableMapKeys,
  getObservableMapValues,
};
