import _ from 'lodash';

export default class InitialState {

  props;

  fields;

  get(type, path = null) {
    if (_.isString(path)) {
      const $path = [_.replace(path, '.', '.fields.'), 'fields'].join('.');
      return _.get(this[type], $path);
    }

    return this[type];
  }

  set(type, state) {
    this[type] = state;
  }
}
