import { observe, intercept } from "mobx";
import _ from "lodash";
import { $try } from "../utils";
import { parsePath } from "../parser";
import SharedEventsInterface from "src/models/SharedEventsInterface";

/**
  Field Events
*/
export const SharedEvents: SharedEventsInterface = {
  /**
    MobX Event (observe/intercept)
   */
  MOBXEvent({ path = null, key = "value", call, type }: any): void {
    const $instance =
      (this as any).select(path || (this as any).path, null, null) || this;

    const $call = (change: any) =>
      call.apply(null, [
        {
          change,
          form: (this as any).state.form,
          path: $instance.path || null,
          field: $instance.path ? $instance : null,
        },
      ]);

    let fn;
    let ffn;

    if (type === "observer") {
      fn = observe;
      ffn = (cb: any) => observe($instance.fields, cb);
    }

    if (type === "interceptor") {
      // eslint-disable-next-line
      key = `$${key}`;
      fn = intercept;
      ffn = $instance.fields.intercept;
    }

    const $dkey = $instance.path ? `${key}@${$instance.path}` : key;

    _.merge((this as any).state.disposers[type], {
      [$dkey]:
        key === "fields"
          ? ffn.apply((change: any) => $call(change))
          : (fn as any)($instance, key, (change: any) => $call(change)),
    });
  },

  /**
    Dispose MOBX Events
   */
  dispose(opt = null): void {
    if ((this as any).path && opt) return this.disposeSingle(opt);
    return this.disposeAll();
  },

  /**
    Dispose All Events (observe/intercept)
   */
  disposeAll() {
    const dispose = (disposer: any) => disposer.apply();
    _.each((this as any).state.disposers.interceptor, dispose);
    _.each((this as any).state.disposers.observer, dispose);
    (this as any).state.disposers = { interceptor: {}, observer: {} };
    return null;
  },

  /**
    Dispose Single Event (observe/intercept)
   */
  disposeSingle({ type, key = "value", path = null }: any) {
    const $path = parsePath(path ?? (this as any).path);
    // eslint-disable-next-line
    if (type === "interceptor") key = `$${key}`; // target observables
    (this as any).state.disposers[type][`${key}@${$path}`].apply();
    delete (this as any).state.disposers[type][`${key}@${$path}`];
  },
};
