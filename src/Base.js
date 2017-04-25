import { computed } from 'mobx';
import _ from 'lodash';

import {
  $isEvent,
  hasIntKeys } from './utils';

export default class Base {

  @computed get hasIncrementalNestedFields() {
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
  onClear = (e) => {
    e.preventDefault();
    this.clear(true);
  };

  /**
    Event Handler: On Reset
  */
  onReset = (e) => {
    e.preventDefault();
    this.reset(true);
  };

  /**
    Event Handler: On Submit
   */
  onSubmit = (e, o = {}) => {
    e.preventDefault();
    this.submit(o);
  };

  /**
    Event Handler: On Add
  */
  onAdd = (e, val) => {
    e.preventDefault();
    this.add($isEvent(val) ? null : val);
  };

  /**
    Event Handler: On Del
  */
  onDel = (e, path) => {
    e.preventDefault();
    this.del($isEvent(path) ? this.path : path);
  };
}
