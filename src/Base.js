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
    const $val = !utils.isEvent(val) ? val : null;
    this.add($val);
  };

  /**
    Event: On Del
  */
  onDel = (e, path = null) => {
    e.preventDefault();
    const $path = !utils.isEvent(path) ? path : this.path;
    this.del($path);
  };

}
