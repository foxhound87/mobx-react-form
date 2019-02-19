import _ from 'lodash';
import { toJS } from 'mobx';

const isPromise = obj => (!!obj && typeof obj.then === 'function'
  && (typeof obj === 'object' || typeof obj === 'function'));

/**
  Vanilla JavaScript Functions

    const plugins = {
      vkf: vkf({
        package: validator,
      }),
    };

*/
class VJF {

  promises = [];

  config = null;

  state = null;

  extend = null;

  validator = null;

  constructor({
    config = {},
    state = {},
    promises = []
  }) {
    this.state = state;
    this.promises = promises;
    this.extend = config.extend;
    this.validator = config.package || config;
    this.extendValidator();
  }

  extendValidator() {
    // extend using "extend" callback
    if (_.isFunction(this.extend)) {
      this.extend({
        validator: this.validator,
        form: this.state.form,
      });
    }
  }

  validateField(field) {
    // exit if field does not have validation functions
    if (!field.validators) return;
    // get validators from validate property
    const $fn = toJS(field.validators);
    // map only if is an array of validator functions
    if (_.isArray($fn)) {
      $fn.map(fn => this.collectData(fn, field));
    }
    // it's just one function
    if (_.isFunction($fn)) {
      this.collectData($fn, field);
    }
    // execute the validation function
    this.executeValidation(field);
  }

  collectData($fn, field) {
    const res = this.handleFunctionResult($fn, field);
    // check and execute only if is a promise
    if (isPromise(res)) {
      const $p = res
        .then($res => field.setValidationAsyncData($res[0], $res[1]))
        .then(() => this.executeAsyncValidation(field))
        .then(() => field.showAsyncErrors());
      // push the promise into array
      this.promises.push($p);
      return;
    }
    // is a plain function
    field.validationFunctionsData.unshift({
      valid: res[0],
      message: res[1],
    });
  }

  executeValidation(field) {
    // otherwise find an error message to show
    field.validationFunctionsData
      .map(rule => (rule.valid === false)
        && field.invalidate(rule.message));
  }

  executeAsyncValidation(field) {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message, true);
    }
  }

  handleFunctionResult($fn, field) {
    // executre validation function
    const res = $fn({
      validator: this.validator,
      form: this.state.form,
      field,
    });

    /**
      Handle "array"
    */
    if (_.isArray(res)) {
      const isValid = res[0] || false;
      const message = res[1] || 'Error';
      return [isValid, message];
    }

    /**
      Handle "boolean"
    */
    if (_.isBoolean(res)) {
      return [res, 'Error'];
    }

    /**
      Handle "string"
    */
    if (_.isString(res)) {
      return [false, res];
    }

    /**
      Handle "object / promise"
    */
    if (isPromise(res)) {
      return res; // the promise
    }

    /**
      Handle other cases
    */
    return [false, 'Error'];
  }
}

export default (config) => ({
  class: VJF,
  config,
});
