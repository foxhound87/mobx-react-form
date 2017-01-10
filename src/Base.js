import utils from './utils';

export default class Base {

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
  onAdd = (e, val = null) => {
    e.preventDefault();
    this.add(utils.isEvent(val) ? null : val);
  };

  /**
    Event: On Del
  */
  onDel = (e, path = null) => {
    e.preventDefault();
    this.del(utils.isEvent(path) ? this.path : path);
  };

}
