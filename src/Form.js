import { action, computed, observe, observable, asMap } from 'mobx';
import _ from 'lodash';
import Validator from './Validator';
import Options from './Options';
import Events from './Events';
import InitialState from './InitialState';
import fieldsInitializer from './FieldsInit';
import fieldHelpers from './FieldHelpers';

export default class Form {

  name;

  state;

  validator;

  @observable fields = asMap({});

  constructor(initial = {}, name = null) {
    this.name = name;

    this.assignFieldHelpers();
    this.assignInitData(initial);
    this.assignFieldsInitializer();
    this.initValidator(initial);
    this.initPropsState(initial);
    this.initFields(initial);
    this.observeFields();
    this.validateOnInit();

    // execute onInit if exist
    if (_.isFunction(this.onInit)) this.onInit(this);
  }

  assignInitData(initial) {
    Options.set(Options.defaults);
    Options.set(initial.options);
  }

  assignFieldHelpers() {
    Object.assign(this, fieldHelpers(this));
  }

  assignFieldsInitializer() {
    Object.assign(this, fieldsInitializer(this));
  }

  initValidator(obj = {}) {
    this.validator = new Validator(obj);
  }

  initPropsState(initial) {
    const initialPropsState = _.omit(initial, [
      'fields', 'options', 'plugins',
    ]);

    this.state = new InitialState();
    this.state.set('props', initialPropsState);
  }

  options(options = null) {
    if (!_.isObject(options)) Options.set(options);
    if (!_.isString(options)) return Options.get(options);
    return Options.get();
  }

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
  }

  observeFields() {
    if (Options.get('validateOnChange') === false) return;
    // deep observe and validate each field
    this.observeFieldsDeep(this.fields);
  }

  observeFieldsDeep(fields) {
    fields.forEach((field, key) => {
      observe(fields.get(key), '$value', () =>
        this.validate({ key, field, showErrors: true, related: true }));
      // recursive observe and validate each field
      if (field.fields.size) this.observeFieldsDeep(field.fields);
    });
  }

  validateOnInit() {
    if (Options.get('validateOnInit') === false) return;
    // execute validation on form initialization
    this.validate({ showErrors: Options.get('showErrorsOnInit') });
  }

  validate(opt = {}, obj = {}) {
    this.validator.resetGenericError();

    const $key = _.has(opt, 'key') ? opt.key : opt;
    const $field = _.has(opt, 'field') ? opt.field : null;
    const showErrors = _.has(opt, 'showErrors') ? opt.showErrors : obj.showErrors || true;
    const related = _.has(opt, 'related') ? opt.related : obj.related || false;

    Events.setRunning('validate', true, $field ? $field.path : null);

    // look running events and choose when show errors messages
    const notShowErrorsEvents = ['clear', 'reset'];
    if (Options.get('showErrorsOnUpdate') === false) notShowErrorsEvents.push('update');
    const $showErrors = showErrors && !Events.running(notShowErrorsEvents);

    if (_.isObject(opt) && !_.isString($key)) {
      // validate all fields
      return new Promise((resolve) => {
        this.validator.validateAll({
          related,
          form: this,
          showErrors: $showErrors,
        });
        // wait all promises then resolve
        return Promise.all(this.validator.promises)
          .then(() => Events.setRunning('validate', false))
          .then(() => resolve(this.isValid));
      });
    }

    // validate single field
    return new Promise((resolve) => {
      // validate single field by key
      this.validator
        .validateField({
          related,
          form: this,
          key: $key,
          field: $field,
          showErrors: $showErrors,
        });
      // wait all promises then resolve
      return Promise.all(this.validator.promises)
        .then(() => Events.setRunning('validate', false))
        .then(() => resolve($field.isValid));
    });
  }

  invalidate(message) {
    this.validator.invalidate(message);
  }

  /* ------------------------------------------------------------------ */
  /* ACTIONS */

  @action
  clear() {
    this.deepAction('clear', this.fields);
  }

  @action
  reset() {
    this.deepAction('reset', this.fields);
  }

  @action
  submit(o = {}) {
    const execOnSuccess = _.has(o, 'onSuccess') ? o.onSuccess : this.onSuccess;
    const execOnError = _.has(o, 'onError') ? o.onError : this.onError;

    this.validate()
      .then(isValid => isValid
        ? execOnSuccess(this)
        : execOnError(this));
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  @computed
  get hasError() {
    return _.some(this.deepCheck('some', 'hasError', this.fields))
      || _.isString(this.validator.genericErrorMessage);
  }

  @computed
  get isValid() {
    return _.every(this.deepCheck('every', 'isValid', this.fields))
      && !_.isString(this.validator.genericErrorMessage);
  }

  @computed
  get isDirty() {
    return _.some(this.deepCheck('some', 'isDirty', this.fields));
  }

  @computed
  get isPristine() {
    return _.every(this.deepCheck('every', 'isPristine', this.fields));
  }

  @computed
  get isDefault() {
    return _.every(this.deepCheck('every', 'isDefault', this.fields));
  }

  @computed
  get isEmpty() {
    return _.every(this.deepCheck('every', 'isEmpty', this.fields));
  }

  @computed
  get error() {
    return this.validator.genericErrorMessage;
  }

  /* ------------------------------------------------------------------ */
  /* ACTIONS */

  /**
    Add Field
  */
  @action
  add(path = null) {
    const keys = _.split(path, '.');
    const last = _.last(keys);
    const $path = _.trimEnd(path, `.${last}`);
    this.select($path).add(last);
  }

  /**
    Del Field
  */
  @action
  del(path = null) {
    const keys = _.split(path, '.');
    const last = _.last(keys);
    const $path = _.trimEnd(path, `.${last}`);
    this.select($path).del(last);
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

  /**
    Event: On Clear
  */
  onClear = (e) => {
    e.preventDefault();
    this.clear();
  };

  /**
    Event: On Reset
  */
  onReset = (e) => {
    e.preventDefault();
    this.reset();
  };

  /**
    Event: On Add
  */
  onAdd = (e, data) => {
    e.preventDefault();
    this.add(data);
  };

  /**
    Event: On Del
  */
  onDel = (e, key) => {
    e.preventDefault();
    this.del(key);
  };
}
