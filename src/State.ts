import { observe } from "mobx";
import _ from "lodash";

import Options from "./Options";
import Bindings from "./Bindings";

import {
  props,
  hasUnifiedProps,
  hasSeparatedProps,
  checkObserve,
  isArrayOfStrings,
  $try,
} from "./utils";

import { RuntimeMode } from "./models/StateInterface";
import { StateInterface } from "./models/StateInterface";
import { OptionsInterface } from "./models/OptionsInterface";
import { BindingsInterface } from "./models/BindingsInterface";
import { FormInterface } from "./models/FormInterface";
import { OptionsEnum } from "./models/OptionsModel";
import { FieldInterface } from "./models/FieldInterface";

export default class State implements StateInterface {
  mode = RuntimeMode.mixed;

  strict = false;

  form: FormInterface;

  options: OptionsInterface;

  bindings: BindingsInterface;

  $extra: any;
  $struct: string[] = [];

  disposers = {
    interceptor: {},
    observer: {},
  };

  initial = {
    props: {},
    fields: {},
  };

  current = {
    props: {},
    fields: {},
  };

  constructor({ form, initial, options, bindings }: any) {
    this.set("form", form);
    this.initProps(initial);
    this.options = new Options();
    this.options.set(options);
    this.bindings = new Bindings();
    this.bindings.register(bindings);
    this.observeOptions();
  }

  initProps(initial: any = {}) {
    const initialProps: any = _.pick(initial, [
      ...props.separated,
      ...props.validation,
      ...props.functions,
      ...props.handlers,
    ]);

    this.set("initial", "props", initialProps);

    const $unified :boolean = hasUnifiedProps(initial);
    const $separated: boolean = hasSeparatedProps(initial);

    if (($separated || isArrayOfStrings(initial.fields)) && !$unified) {
      const struct: any = $try(initial.struct, initial.fields);
      this.struct(struct);
      this.strict = true;
      this.mode = RuntimeMode.separated;
      return;
    }

    this.struct(initial.struct);
    this.mode = RuntimeMode.unified;
  }

  /**
    Get/Set Fields Structure
  */
  struct(data: any = null): any {
    if (data) this.$struct = data;
    return this.$struct;
  }

  /**
    Get Props/Fields
  */
  get(type: string, subtype: string) {
    return (this as any)[type][subtype];
  }

  /**
    Set Props/Fields
  */
  set(type: string, subtype: any, state: any = null) {
    if (type === "form") {
      // subtype is the form here
      this.form = subtype;
    }

    if (type === "initial") {
      Object.assign((this.initial as any)[subtype], state);
      Object.assign((this.current as any)[subtype], state);
    }

    if (type === "current") {
      Object.assign((this.current as any)[subtype], state);
    }
  }

  extra(data: any | null = null): any | null {
    if (_.isString(data)) return _.get(this.$extra, data);
    if (data === null) return this.$extra;
    this.$extra = data;
    return null;
  }

  observeOptions(): void {
    // Fix Issue #201
    observe(
      this.options.options,
      checkObserve([
        {
          // start observing fields validateOnChange
          type: "update",
          key: OptionsEnum.validateOnChange,
          to: true,
          exec: () =>
            this.form.each((field: FieldInterface) => field.observeValidationOnChange()),
        },
        {
          // stop observing fields validateOnChange
          type: "update",
          key: OptionsEnum.validateOnChange,
          to: false,
          exec: () =>
            this.form.each((field: FieldInterface) => field.disposeValidationOnChange()),
        },
        {
          // start observing fields validateOnBlur
          type: "update",
          key: OptionsEnum.validateOnBlur,
          to: true,
          exec: () =>
            this.form.each((field: FieldInterface) => field.observeValidationOnBlur()),
        },
        {
          // stop observing fields validateOnBlur
          type: "update",
          key: OptionsEnum.validateOnBlur,
          to: false,
          exec: () =>
            this.form.each((field: FieldInterface) => field.disposeValidationOnBlur()),
        },
      ])
    );
  }
}
