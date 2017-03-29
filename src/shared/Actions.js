import { action } from 'mobx';
import _ from 'lodash';
import utils from '../utils';
import parser from '../parser';

/**
  Field Actions
*/
export default {

  validate(opt = {}, obj = {}) {
    const $opt = _.merge(opt, { path: this.path });
    return this.state.form.validator.validate($opt, obj);
  },

  /**
    Submit
  */
  @action
  submit(o = {}) {
    this.$submitting = true;
    const noop = () => {};
    const onSuccess = o.onSuccess || this.onSuccess || this.$onSubmit.onSuccess || noop;
    const onError = o.onError || this.onError || this.$onSubmit.onError || noop;

    const exec = isValid => isValid
      ? onSuccess.apply(this, [this])
      : onError.apply(this, [this]);

    const validate = () =>
      this.state.form.validator.validate(this.path)
        .then(({ isValid }) => exec(isValid))
        .then(action(() => (this.$submitting = false)))
        .then(() => {
          const $err = this.state.options.get('defaultGenericError');
          const $throw = this.state.options.get('submitThrowsError');
          if ($throw && $err) this.invalidate();
        })
        .then(() => this);

    return utils.isPromise(exec)
      ? exec.then(() => validate())
      : validate();
  },

  /**
   Check Field Computed Values
   */
  check(prop, deep = false) {
    utils.allowedProps('booleans', [prop]);

    return deep
      ? utils.checkPropType({
        type: utils.props.types[prop],
        data: this.deepCheck(utils.props.types[prop], prop, this.fields),
      })
      : this[prop];
  },

  deepCheck(type, prop, fields) {
    return _.reduce(fields.values(), (check, field) => {
      if (field.fields.size === 0) {
        check.push(field[prop]);
        return check;
      }
      const $deep = this.deepCheck(type, prop, field.fields);
      check.push(utils.checkPropType({ type, data: $deep }));
      return check;
    }, []);
  },

  /**
   Update Field Values recurisvely
   OR Create Field if 'undefined'
   */
  update(fields) {
    const $fields = parser.prepareFieldsData({ fields }, this.state.strict);
    this.deepUpdate($fields);
  },

  @action
  deepUpdate(fields, path = '', recursion = true) {
    _.each(fields, (field, key) => {
      const $path = _.trimStart(`${path}.${key}`, '.');
      const $field = this.select($path, null, false);
      const $container = this.select(path, null, false)
        || this.state.form.select(this.path, null, false);

      if (!_.isNil($field) && !_.isNil(field)) {
        if (_.isArray($field.values())) {
          _.each($field.fields.values(), $f =>
            $field.fields.delete($f.name));
        }
        if (_.isNil(field.fields)) {
          $field.value = field;
          return;
        }
      }

      if (!_.isNil($container)) {
        // get full path when using update() with select() - FIX: #179
        const $newFieldPath = _.trimStart([this.path, $path].join('.'), '.');
        // init field into the container field
        $container.initField(key, $newFieldPath, field, true);
      }

      if (recursion) {
        // handle nested fields if undefined or null
        const $fields = parser.pathToFieldsTree(this.state.struct(), $path);
        this.deepUpdate($fields, $path, false);
      }

      if (recursion && _.has(field, 'fields') && !_.isNil(field.fields)) {
        // handle nested fields if defined
        this.deepUpdate(field.fields, $path);
      }
    });
  },

  /**
    Get Fields Props
   */
  get(prop = null, strict = true) {
    if (_.isNil(prop)) {
      return this.deepGet([
        ...utils.props.booleans,
        ...utils.props.field,
        ...utils.props.validation,
      ], this.fields);
    }

    utils.allowedProps('all', _.isArray(prop) ? prop : [prop]);

    if (_.isString(prop)) {
      if (strict && this.fields.size === 0) {
        return parser.parseCheckFormatter(this, prop);
      }

      const value = this.deepGet(prop, this.fields);
      return parser.parseCheckArray(this, value, prop);
    }

    return this.deepGet(prop, this.fields);
  },

  /**
    Get Fields Props Recursively
   */
  deepGet(prop, fields) {
    return _.reduce(fields.values(), (obj, field) => {
      const $nested = $fields => ($fields.size !== 0)
        ? this.deepGet(prop, $fields)
        : undefined;

      Object.assign(obj, {
        [field.key]: { fields: $nested(field.fields) },
      });

      if (_.isString(prop)) {
        if (field.fields.size === 0) {
          return Object.assign(obj, {
            [field.key]: parser.parseCheckFormatter(field, prop),
          });
        }

        let value = this.deepGet(prop, field.fields);
        if (prop === 'value') value = field.$formatter(value);

        return Object.assign(obj, {
          [field.key]: parser.parseCheckArray(field, value, prop),
        });
      }

      _.each(prop, $prop =>
        Object.assign(obj[field.key], {
          [$prop]: field[$prop],
        }));

      return obj;
    }, {});
  },

  /**
   Set Fields Props
   */
  @action
  set($, data, recursion = false) {
    const $e = 'update';

    if (!recursion) {
      this.state.events.set($e, this.path || true);
    }

    // UPDATE CUSTOM PROP
    if (_.isString($) && !_.isUndefined(data)) {
      utils.allowedProps('field', [$]);
      if (_.isObject(data)) this.deepSet($, data, '', true);
      else _.set(this, `$${$}`, data);
      return;
    }

    // NO PROP NAME PROVIDED
    if (_.isNil(data)) {
      if (_.isObject($)) this.deepSet('value', $, '', true);
      else this.set('value', $);
      return;
    }

    if (!recursion) this.state.events.set($e, false);
  },

  /**
    Set Fields Props Recursively
   */
  deepSet($, data, path = '', recursion = false) {
    const err = 'You are updating a not existent field:';
    const isStrict = this.state.options.get('strictUpdate');

    _.each(data, ($val, $key) => {
      const $path = _.trimStart(`${path}.${$key}`, '.');
      // get the field by path joining keys recursively
      const field = this.select($path, null, isStrict);
      // if no field found when is strict update, throw error
      if (isStrict) utils.throwError($path, field, err);
      // update the field/fields if defined
      if (!_.isUndefined(field)) {
        // update field values or others props
        field.set($, $val, recursion);
        // update values recursively only if field has nested
        if (field.fields.size && _.isObject($val)) {
          this.deepSet($, $val, $path, recursion);
        }
      }
    });
  },

  /**
    Call field method recursively
  */
  deepAction($action, $fields, recursion = false) {
    const fields = $fields || this.fields;

    if (!recursion) {
      this.state.events.set($action, this.path || true);
    }

    if (fields.size !== 0) {
      fields.forEach((field) => {
        field[$action]();
        this.deepAction($action, field.fields, true);
      });
    }

    if (!recursion) {
      this.state.events.set($action, false);
    }
  },

  /**
   Add Field
   */
  @action
  add(value = null, opt = {}) {
    let $key;

    if (_.has(opt, 'key')) $key = opt.key;
    else $key = utils.maxKey(this.fields);

    const tree = parser.pathToFieldsTree(this.state.struct(), this.path, 0, true);
    const $path = key => _.trimStart([this.path, key].join('.'), '.');

    _.each(tree, field => this.initField($key, $path($key), field));

    if (!_.isNil(value)) {
      const field = this.select($key, null, false)
        || this.initField($key, $path($key));

      if (_.isPlainObject(value)) {
        field.update(value);
      }

      field.set('initial', value);
      field.set('default', value);
      field.set('value', value);
    }

    return $key;
  },

  /**
   Del Field
   */
  @action
  del(partialPath = null) {
    const path = parser.parsePath(partialPath || this.path);
    const keys = _.split(path, '.');
    const last = _.last(keys);
    const cpath = _.trimEnd(path, `.${last}`);
    const isStrict = this.state.options.get('strictDelete');

    const container = this.select(cpath, null, false)
      || this.state.form.select(cpath, null, false)
      || this.state.form.select(this.path, null, true);

    if (isStrict && !container.fields.has(last)) {
      const msg = `Key "${last}" not found when trying to delete field`;
      const $path = _.trim([this.path, path].join('.'), '.');
      utils.throwError($path, null, msg);
    }

    container.fields.delete(last);
  },

};
