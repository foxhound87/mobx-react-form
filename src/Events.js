import { action, observable } from 'mobx';

class Events {

  @observable $running = {
    clear: false,
    reset: false,
    update: false,
  };

  $path = {
    clear: null,
    reset: null,
    update: null,
  };

  getRunning(key = null) {
    if (key) return this.$running[key];
    return this.$running;
  }

  @action
  setRunning(key, flag, path = null) {
    this.$running[key] = flag;
    if (path) this.$path[key] = path;
  }

  path(key) {
    return this.$path[key];
  }
}

export default new Events();
