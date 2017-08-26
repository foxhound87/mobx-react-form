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
    fields = parser.prepareFieldsData(initial, this.state.strict);
    fields = parser.mergeSchemaDefaults(fields, this.validator);

    // create fields
    _.each(fields, (field, key) =>
      _.isNil(this.select($path(key), null, false)) &&
        this.initField(key, $path(key), field, update));
  },

  @action
  initField(key, path, data, update = false) {
    const initial = this.state.get('current', 'props');
    const struct = utils.pathToStruct(path);
    // try to get props from separated objects
    const $try = prop => _.get(initial[prop], struct);

    const props = {
      $value: $try('values'),
      $label: $try('labels'),
      $placeholder: $try('placeholders'),
      $default: $try('defaults'),
      $initial: $try('initials'),
      $disabled: $try('disabled'),
      $bindings: $try('bindings'),
      $type: $try('types'),
      $options: $try('options'),
      $extra: $try('extra'),
      $related: $try('related'),
      $hooks: $try('hooks'),
      $handlers: $try('handlers'),
      $validatedWith: $try('validatedWith'),
      $validators: $try('validators'),
      $rules: $try('rules'),
      $observers: $try('observers'),
      $interceptors: $try('interceptors'),
      $input: $try('input'),
      $output: $try('output'),
    };

    const field = this.state.form.makeField({
      key, path, data, props, update, state: this.state,
    });

    this.fields.merge({ [key]: field });

    return field;
  },

};
