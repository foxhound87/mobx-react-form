import { computed } from 'mobx';
import utils from './utils';

export default class Base {

  @computed get hasIncrementalNestedFields() {
    return (utils.hasIntKeys(this.fields) && this.fields.size);
  }

  @computed get hasNestedFields() {
    return (this.fields.size !== 0);
  }

  /**
    Event: On Clear
  */
  onClear = (e) => {
    e.preventDefault();
    this.clear(true);
  };

  /**
    Event: On Reset
  */
  onReset = (e) => {
    e.preventDefault();
    this.reset(true);
  };

  /**
    Event: On Add
  */
  onAdd = (e, val) => {
    e.preventDefault();
    this.add(utils.isEvent(val) ? null : val);
  };

  /**
    Event: On Del
  */
  onDel = (e, path) => {
    e.preventDefault();
    this.del(utils.isEvent(path) ? this.path : path);
  };

}
