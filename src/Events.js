import { action, observable } from 'mobx';

class Events {

  @observable $running = {
    clear: false,
    reset: false,
    update: false,
  };

  $path = {
    clear: false,
    reset: false,
    update: false,
  };

  @action
  getRunning(key = null) {
    if (key) return this.$running[key];
    return this.$running;
  }

  @action
  setRunning(key, flag) {
    this.$running[key] = flag;
  }
}

export default new Events();
