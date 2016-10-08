export default class InitialState {

  props;

  fields;

  get(type) {
    return this[type];
  }

  set(type, state) {
    this[type] = state;
  }
}
