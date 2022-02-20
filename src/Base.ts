import { observable, computed, toJS, makeObservable } from "mobx";
import _ from "lodash";
import { $try, $isEvent, hasIntKeys } from "./utils";
import Actions from "./shared/Actions";
import BaseInterface from "./models/BaseInterface";

export default class Base extends Actions implements BaseInterface {
  noop = () => {};

  $submitted = 0;
  $submitting = false;

  $validated = 0;
  $validating = false;

  execHook = (name: string, fallback: any = {}): any =>
    $try(
      fallback[name],
      (this as any).$hooks[name],
      (this as any).hooks && (this as any).hooks.apply(this, [this])[name],
      this.noop
    ).apply(this, [this]);

  execHandler = (name: string, args: any, fallback: any = null): any => [
    $try(
      (this as any).$handlers[name] &&
        (this as any).$handlers[name].apply(this, [this]),
      (this as any).handlers &&
        (this as any).handlers.apply(this, [this])[name] &&
        (this as any).handlers.apply(this, [this])[name].apply(this, [this]),
      fallback,
      this.noop
    ).apply(this, [...args]),
    this.execHook(name),
  ];

  constructor() {
    super();
    makeObservable(this, {
      $submitted: observable,
      $submitting: observable,
      $validated: observable,
      $validating: observable,
      submitted: computed,
      submitting: computed,
      validated: computed,
      validating: computed,
      hasIncrementalKeys: computed,
      hasNestedFields: computed,
      size: computed,
    });
  }

  get submitted(): number {
    return toJS(this.$submitted);
  }

  get submitting(): boolean {
    return toJS(this.$submitting);
  }

  get validated(): number {
    return toJS(this.$validated);
  }

  get validating(): boolean {
    return toJS(this.$validating);
  }

  get hasIncrementalKeys(): boolean {
    return (this as any).fields.size && hasIntKeys((this as any).fields);
  }

  get hasNestedFields(): boolean {
    return (this as any).fields.size !== 0;
  }

  get size(): number {
    return (this as any).fields.size;
  }

  /**
    Interceptor
  */
  intercept = (opt: any): any =>
    (this as any).MOBXEvent(
      _.isFunction(opt)
        ? { type: "interceptor", call: opt }
        : { type: "interceptor", ...opt }
    );

  /**
    Observer
  */
  observe = (opt: any): any =>
    (this as any).MOBXEvent(
      _.isFunction(opt)
        ? { type: "observer", call: opt }
        : { type: "observer", ...opt }
    );

  /**
    Event Handler: On Clear
  */
  onClear = (...args: any): any =>
    this.execHandler("onClear", args, (e: Event) => {
      e.preventDefault();
      (this as any).clear(true);
    });

  /**
    Event Handler: On Reset
  */
  onReset = (...args: any): any =>
    this.execHandler("onReset", args, (e: Event) => {
      e.preventDefault();
      (this as any).reset(true);
    });

  /**
    Event Handler: On Submit
   */
  onSubmit = (...args: any): any =>
    this.execHandler("onSubmit", args, (e: Event, o = {}) => {
      e.preventDefault();
      this.submit(o);
    });

  /**
    Event Handler: On Add
  */
  onAdd = (...args: any): any =>
    this.execHandler("onAdd", args, (e: Event, val: any) => {
      e.preventDefault();
      this.add($isEvent(val) ? null : val);
    });

  /**
    Event Handler: On Del
  */
  onDel = (...args: any): any =>
    this.execHandler("onDel", args, (e: Event, path: string) => {
      e.preventDefault();
      this.del($isEvent(path) ? (this as any).path : path);
    });
}
