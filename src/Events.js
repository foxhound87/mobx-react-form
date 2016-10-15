import { action, observable } from 'mobx';
import _ from 'lodash';

class Events {

  @observable $running = {
    clear: false,
    reset: false,
    update: false,
    validate: false,
  };

  $path = {
    clear: null,
    reset: null,
    update: null,
    validate: null,
  };

  getRunning(key = null) {
    if (key) return this.$running[key];
    return this.$running;
  }

  @action
  setRunning(key, flag, path = null) {
    this.$running[key] = flag;
    if (path) this.$path[key] = path;
    else this.$path[key] = null;
  }

  path(key) {
    return this.$path[key];
  }

  running(events) {
    const running = _.keys(_.omitBy(this.getRunning(), e => e === false));
    return _.intersection(events, running).length > 0;
  }
}

export default new Events();
