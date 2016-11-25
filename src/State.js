export default class State {

  $struct = [];

  $form = {};

  initial = {
    props: {},
    fields: {},
  }

  current = {
    props: {},
    fields: {},
  }

  /**
    Get/Set Form
  */
  form(data = null) {
    if (data) this.$form = data;
    return this.$form;
  }

  /**
    Get/Set Fields Structure
  */
  struct(data = null) {
    if (data) this.$struct = data;
    return this.$struct;
  }

  /**
    Get Props/Fields
  */
  get(type, subtype) {
    return this[type][subtype];
  }

  /**
    Set Props/Fields
  */
  set(type, subtype, state) {
    if (type === 'initial') {
      Object.assign(this.initial[subtype], state);
      Object.assign(this.current[subtype], state);
    }

    if (type === 'current') {
      Object.assign(this.current[subtype], state);
    }
  }
}
