import { action, computed, observe, observable, asMap } from 'mobx';
import _ from 'lodash';

import Base from './Base';
import Validator from './Validator';
import Events from './Events';
import State from './State';
import Field from './Field';

export default class Form extends Base {

  name;

  state;

  validator;

  @observable $validating = false;

  @observable fields = observable.map ? observable.map({}) : asMap({});

  constructor(setup = {}, {

    options = {},
    plugins = {},
    bindings = {},

  } = {}) {
    super();

    // load data from initializers methods
    const initial = _.each({ setup, options, plugins, bindings },
      (val, key) => _.isFunction(this[key])
      ? _.merge(val, this[key].apply(this, [this]))
      : val);

    this.name = initial.name || null;

    this.state = new State({
      form: this,
      initial: initial.setup,
      options: initial.options,
      bindings: initial.bindings,
    });

    this.validator = new Validator({
      options: this.state.options,
      plugins: initial.plugins,
      schema: initial.setup.schema,
    });

    this.initFields(initial.setup);

    this.validateOnInit();

    // execute onInit() if exist
    if (_.isFunction(this.onInit)) {
      this.onInit.apply(this, [this]);
    }
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  @computed get validating() {
    return this.$validating;
  }

  @computed get error() {
    return this.validator.genericErrorMessage;
  }

  @computed get hasError() {
    return _.isString(this.validator.genericErrorMessage)
     || this.check('hasError', true);
  }

  @computed get isValid() {
    return !_.isString(this.validator.genericErrorMessage)
      && this.check('isValid', true);
  }

  @computed get isDirty() {
    return this.check('isDirty', true);
  }

  @computed get isPristine() {
    return this.check('isPristine', true);
  }

  @computed get isDefault() {
    return this.check('isDefault', true);
  }

  @computed get isEmpty() {
    return this.check('isEmpty', true);
  }

  @computed get focus() {
    return this.check('focus', true);
  }

  @computed get touched() {
    return this.check('touched', true);
  }

  @computed get changed() {
    return this.check('changed', true);
  }

  @computed get disabled() {
    return this.check('disabled', true);
  }

  /* ------------------------------------------------------------------ */
  /* EVENTS */

  /**
    On Submit
   */
  onSubmit = (e, o = {}) => {
    e.preventDefault();
    this.submit(o);
  };
}

export const prototypes = {

  makeField(data) {
    return new Field(data);
  },

  on(event, callback) {
    observe(Events.getRunning(), ({ name, oldValue, object }) => {
      if (!event.includes('@')) return;

      const $event = _.split(event, '@');
      const $path = Events.path(name);

      if ($event[0] === name
        && $event[1] === $path
        && oldValue && !object[name]) {
        callback({ form: this, path: $path });
      }
    });
  },

  validateOnInit() {
    if (this.state.options.get('validateOnInit') === false) return;
    // execute validation on form initialization
    this.validate({ showErrors: this.state.options.get('showErrorsOnInit') });
  },

  validate(opt = {}, obj = {}) {
    action(() => (this.$validating = true))();
    this.validator.resetGenericError();

    const $path = _.has(opt, 'path') ? opt.path : opt;

    let $field = null;
    if (_.has(opt, 'field')) $field = opt.field;
    else if (_.isString($path)) $field = this.select($path);

    let showErrors = true;
    if (_.has(opt, 'showErrors')) showErrors = opt.showErrors;
    else if (_.has(obj, 'showErrors')) showErrors = obj.showErrors;

    let related = false;
    if (_.has(opt, 'related')) related = opt.related;
    else if (_.has(obj, 'related')) related = obj.related;

    Events.setRunning('validate', true, $field ? $field.path : $path);

    // look running events and choose when show errors messages
    const notShowErrorsEvents = ['clear', 'reset'];
    if (this.state.options.get('showErrorsOnUpdate') === false) notShowErrorsEvents.push('update');
    const $showErrors = showErrors && !Events.running(notShowErrorsEvents);

    if (_.isPlainObject(opt) && !_.isString($path)) {
      // validate all fields
      return new Promise((resolve) => {
        this.validator.validateAll({
          related,
          form: this,
          showErrors: $showErrors,
        });
        // wait all promises then resolve
        return Promise.all(this.validator.promises)
          .then(action(() => (this.$validating = false)))
          .then(() => Events.setRunning('validate', false))
          .then(() => resolve(this.isValid));
      });
    }

    // validate single field
    return new Promise((resolve) => {
      // validate single field by path
      this.validator
        .validateField({
          related,
          form: this,
          path: $path,
          field: $field,
          showErrors: $showErrors,
        });
      // wait all promises then resolve
      return Promise.all(this.validator.promises)
        .then(action(() => (this.$validating = false)))
        .then(() => Events.setRunning('validate', false))
        .then(() => resolve($field.isValid));
    });
  },

  invalidate(message) {
    this.validator.invalidate(message);
  },

  /* ------------------------------------------------------------------ */
  /* ACTIONS */

  /**
    Clear Form Fields
  */
  @action clear() {
    this.deepAction('clear', this.fields);
  },

  /**
    Reset Form Fields
  */
  @action reset() {
    this.deepAction('reset', this.fields);
  },

  /**
    Submit Form
  */
  @action submit(o = {}) {
    const execOnSuccess = _.has(o, 'onSuccess') ? o.onSuccess : this.onSuccess;
    const execOnError = _.has(o, 'onError') ? o.onError : this.onError;

    this.validate()
      .then(isValid => isValid
        ? execOnSuccess.apply(this, [this])
        : execOnError.apply(this, [this]));
  },

};
