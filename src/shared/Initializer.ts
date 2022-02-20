import { action, makeObservable } from "mobx";
import _ from "lodash";
import { prepareFieldsData, mergeSchemaDefaults } from "../parser";
import { pathToStruct } from "../utils";
import SharedInitializerInterface from "src/models/SharedInitializerInterface";

/**
  Field Initializer
*/
export default class Initializer implements SharedInitializerInterface {
  constructor() {
    makeObservable(this, {
      initField: action,
    });
  }

  initFields(initial: any, update: boolean): void {
    const fallback = (this as any).state.options.get("fallback");
    const $path = (key: string) =>
      _.trimStart([(this as any).path, key].join("."), ".");

    let fields;
    fields = prepareFieldsData(initial, (this as any).state.strict, fallback);
    fields = mergeSchemaDefaults(fields, (this as any).validator);

    // create fields
    _.forIn(fields, (field, key) => {
      const path = $path(key);
      const $f = (this as any).select(path, null, false);
      if (_.isNil($f)) {
        if (fallback) {
          this.initField(key, path, field, update);
        } else {
          const structPath = pathToStruct(path);
          const struct = (this as any).state.struct();
          const found = struct
            .filter((s: any) => s.startsWith(structPath))
            .find(
              (s: any) =>
                s.charAt(structPath.length) === "." ||
                s.substr(structPath.length, 2) === "[]" ||
                s === structPath
            );

          if (found) this.initField(key, path, field, update);
        }
      }
    });
  }

  initField(
    key: string,
    path: string,
    data: any,
    update: boolean = false
  ): any {
    const initial = (this as any).state.get("current", "props");
    const struct = pathToStruct(path);
    // try to get props from separated objects
    const $try = (prop: string) => {
      const t = _.get(initial[prop], struct);
      if ((prop === "input" || prop === "output") && typeof t !== "function")
        return undefined;
      return t;
    };

    const props = {
      $value: _.get(initial["values"], path),
      $label: $try("labels"),
      $placeholder: $try("placeholders"),
      $default: $try("defaults"),
      $initial: $try("initials"),
      $disabled: $try("disabled"),
      $bindings: $try("bindings"),
      $type: $try("types"),
      $options: $try("options"),
      $extra: $try("extra"),
      $related: $try("related"),
      $hooks: $try("hooks"),
      $handlers: $try("handlers"),
      $validatedWith: $try("validatedWith"),
      $validators: $try("validators"),
      $rules: $try("rules"),
      $observers: $try("observers"),
      $interceptors: $try("interceptors"),
      $input: $try("input"),
      $output: $try("output"),
    };

    const field = (this as any).state.form.makeField({
      key,
      path,
      data,
      props,
      update,
      state: (this as any).state,
    });

    (this as any).fields.merge({ [key]: field });

    return field;
  }
}
