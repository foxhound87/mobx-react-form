export default class FormState {

  initial = {
    props: {},
    fields: {},
  }

  current = {
    props: {},
    fields: {},
  }

  get(type, subtype) {
    return this[type][subtype];
  }

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
