import { observe } from 'mobx';
import _ from 'lodash';

import Options from './Options';
import Bindings from './Bindings';
import Events from './Events';
import utils from './utils';

export default class State {

  strict = false;

  form;

  mode;

  options;

  bindings;

  events;

  disposers = {
    interceptor: {},
    observer: {},
  };

  $struct = [];

  initial = {
    props: {},
    fields: {},
  };

  current = {
    props: {},
    fields: {},
  };

  constructor({ form, initial, options, bindings }) {
    this.set('form', form);
    this.initProps(initial);
    this.initOptions(options);
    this.initBindings(bindings);
    this.initEvents();
    this.observeOptions();
  }

  initOptions(options) {
    this.options = new Options();
    this.options.set(options);
  }

  initProps(initial) {
    const initialProps = _.pick(initial, [
      ...utils.props.separated,
      ...utils.props.validation,
      ...utils.props.function,
    ]);

    this.set('initial', 'props', initialProps);

    const isStruct = utils.isStruct(initial);
    const $unified = utils.hasUnifiedProps(initial);
    const $separated = utils.hasSeparatedProps(initial);

    if ($unified && $separated) {
      console.warn( // eslint-disable-line
        'WARNING:',
        'Your mobx-react-form instance is running in MIXED Mode',
        '(Unified + Separated) for defining fields properties.',
        'Run it at your own risk, or use only one mode.',
      );
    }

    if (($separated || isStruct) && !$unified) {
      this.strict = true;
      this.mode = 'separated';
      this.struct(initial.fields);
      return;
    }

    this.mode = 'unified';
  }

  initBindings(bindings) {
    this.bindings = new Bindings();
    this.bindings.register(bindings);
  }

  initEvents() {
    this.events = new Events();
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
  set(type, subtype, state = null) {
    if (type === 'form') {
      // subtype is the form here
      this.form = subtype;
    }

    if (type === 'initial') {
      Object.assign(this.initial[subtype], state);
      Object.assign(this.current[subtype], state);
    }

    if (type === 'current') {
      Object.assign(this.current[subtype], state);
    }
  }

  observeOptions() {
    // Fix Issue #201
    observe(this.options.options, utils.checkObserve([{
      // start observing fields
      type: 'update',
      key: 'validateOnChange',
      to: true,
      exec: () => this.form.forEach(field => field.observeValidation()),
    }, {
      // stop observing fields
      type: 'update',
      key: 'validateOnChange',
      to: false,
      exec: () => this.form.forEach(field => field.disposeValidation()),
    }]));
  }
}
