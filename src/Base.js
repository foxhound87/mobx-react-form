import { computed } from 'mobx';
import _ from 'lodash';

import {
  $try,
  $isEvent,
  hasIntKeys } from './utils';

export default class Base {

  noop = () => {};

  execHook = (name, fallback = {}) => $try(
    fallback[name],
    this.$hooks[name],
    this.hooks && this.hooks.apply(this, [this])[name],
    this.noop,
  ).apply(this, [this]);

  execHandler = (name, args, fallback = null) => [$try(
    this.$handlers[name] && this.$handlers[name].apply(this, [this]),
    this.handlers && this.handlers.apply(this, [this])[name].apply(this, [this]),
    fallback,
    this.noop,
  ).apply(this, [...args]), this.execHook(name)];

  @computed get hasIncrementalKeys() {
    return (this.fields.size && hasIntKeys(this.fields));
  }

  @computed get hasNestedFields() {
    return (this.hasInitialNestedFields || this.fields.size !== 0);
  }

  @computed get size() {
    return this.fields.size;
  }

  /**
   Interceptor
   */
  intercept = opt =>
    this.MOBXEvent(
      _.isFunction(opt)
        ? { type: 'interceptor', call: opt }
        : { type: 'interceptor', ...opt },
    );

  /**
   Observer
   */
  observe = opt =>
    this.MOBXEvent(
      _.isFunction(opt)
        ? { type: 'observer', call: opt }
        : { type: 'observer', ...opt },
    );

  /**
    Event Handler: On Clear
  */
  onClear = (...args) =>
    this.execHandler('onClear', args, (e) => {
      e.preventDefault();
      this.clear(true);
    });

  /**
    Event Handler: On Reset
  */
  onReset = (...args) =>
    this.execHandler('onReset', args, (e) => {
      e.preventDefault();
      this.reset(true);
    });

  /**
    Event Handler: On Submit
   */
  onSubmit = (...args) =>
    this.execHandler('onSubmit', args, (e, o = {}) => {
      e.preventDefault();
      this.submit(o);
    });

  /**
    Event Handler: On Add
  */
  onAdd = (...args) =>
    this.execHandler('onAdd', args, (e, val) => {
      e.preventDefault();
      this.add($isEvent(val) ? null : val);
    });

  /**
    Event Handler: On Del
  */
  onDel = (...args) =>
    this.execHandler('onAdd', args, (e, path) => {
      e.preventDefault();
      this.del($isEvent(path) ? this.path : path);
    });
}
