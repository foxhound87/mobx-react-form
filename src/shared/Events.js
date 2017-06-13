import { observe, intercept } from 'mobx';
import _ from 'lodash';
import utils from '../utils';
import parser from '../parser';

/**
  Field Events
*/
export default {

  /**
   MobX Event (observe/intercept)
   */
  MOBXEvent({ path = null, key = 'value', call, type }) {
    const $instance = this.select(path || this.path, null, null) || this;

    const $call = change => call.apply(null, [{
      change,
      form: this.state.form,
      path: $instance.path || null,
      field: $instance.path ? $instance : null,
    }]);

    let fn;
    let ffn;

    if (type === 'observer') {
      fn = observe;
      ffn = $instance.fields.observe;
    }

    if (type === 'interceptor') {
      // eslint-disable-next-line
      key = `$${key}`;
      fn = intercept;
      ffn = $instance.fields.intercept;
    }

    const $dkey = $instance.path
      ? `${key}@${$instance.path}`
      : key;

    _.merge(this.state.disposers[type], {
      [$dkey]: (key === 'fields')
        ? ffn.apply(change => $call(change))
        : fn($instance, key, change => $call(change)),
    });
  },

  /**
   Dispose MOBX Events
   */
  dispose(opt = null) {
    if (this.path && opt) return this.disposeSingle(opt);
    return this.disposeAll(opt);
  },

  /**
   Dispose All Events (observe/intercept)
   */
  disposeAll() {
    const dispose = disposer => disposer.apply();
    _.each(this.state.disposers.interceptor, dispose);
    _.each(this.state.disposers.observer, dispose);
    this.state.disposers = { interceptor: {}, observer: {} };
    return null;
  },

  /**
   Dispose Single Event (observe/intercept)
   */
  disposeSingle({ type, key = 'value', path = null }) {
    const $path = parser.parsePath(utils.$try(path, this.path));
    // eslint-disable-next-line
    if (type === 'interceptor') key = `$${key}`; // target observables
    this.state.disposers[type][`${key}@${$path}`].apply();
    delete this.state.disposers[type][`${key}@${$path}`];
  },

};

