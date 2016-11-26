import { action } from 'mobx';
import _ from 'lodash';
import utils from '../utils';
import parser from '../parser';

/**
  Field Initializer
*/
export default {

  initFields(initial, update) {
    const $path = key => _.trimStart([this.path, key].join('.'), '.');

    let fields;
    fields = parser.prepareFieldsData(initial);
    fields = parser.mergeSchemaDefaults(fields, this.validator);

    // create fields
    _.each(fields, (field, key) =>
      _.isNil(this.select($path(key), null, false))
      && this.initField(key, $path(key), field, null, update));
  },

  @action
  initField(key, path, data, fields = null, update = false) {
    const $fields = fields || this.fields;
    const initial = this.state.get('current', 'props');

    // try to get props from separated objects
    const $try = prop => _.get(initial[prop], utils.pathToStruct(path));

    const props = {
      $value: $try('values'),
      $label: $try('labels'),
      $default: $try('defaults'),
      $disabled: $try('disabled'),
      $related: $try('related'),
      $validate: $try('validate'),
      $rules: $try('rules'),
    };

    $fields.merge({
      [key]: this.state.form.makeField({
        key, path, data, props, update, state: this.state,
      }),
    });
  },

};
