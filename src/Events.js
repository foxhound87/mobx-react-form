import { action, observable } from 'mobx';
import _ from 'lodash';

export default class Events {

  @observable $running = {
    clear: false,
    reset: false,
    update: false,
    validate: false,
  };

  get(key = null) {
    if (key) return this.$running[key];
    return this.$running;
  }

  @action
  set(key = null, flag) {
    this.$running[key] = flag;
  }

  // path(key) {
  //   return this.$path[key];
  // }

  running(events) {
    const running = _.keys(_.omitBy(this.get(), e => e === false));
    return _.intersection(events, running).length > 0;
  }
}
