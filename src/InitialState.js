export default class InitialState {

  props = {};

  fields = {};

  get(type) {
    return this[type];
  }

  set(type, state) {
    Object.assign(this[type], state);
  }
}
