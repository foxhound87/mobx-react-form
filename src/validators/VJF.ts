import {
  ValidationPlugin,
  ValidationPluginConfig,
  ValidationPluginConstructor,
  ValidationPluginInterface,
} from "../models/ValidatorInterface";
import _ from "lodash";
import { toJS } from "mobx";

const isPromise = (obj) =>
  !!obj &&
  typeof obj.then === "function" &&
  (typeof obj === "object" || typeof obj === "function");

/**
  Vanilla JavaScript Functions

    const plugins = {
      vkf: vkf({
        package: validator,
      }),
    };

*/
export class VJF implements ValidationPluginInterface {
  promises = [];

  config = null;

  state = null;

  extend = null;

  validator = null;

  constructor({
    config,
    state = null,
    promises = [],
  }: ValidationPluginConstructor) {
    this.state = state;
    this.promises = promises;
    this.extend = config?.extend;
    this.validator = config?.package;
    this.extendValidator();
  }

  extendValidator() {
    // extend using "extend" callback
    if (typeof this.extend === 'function') {
      this.extend({
        validator: this.validator,
        form: this.state.form,
      });
    }
  }

  validate(field) {
    // exit if field does not have validation functions
    if (!field.validators) return;
    // get validators from validate property
    const $fn = field.validators;
    // map only if is an array of validator functions
    if (Array.isArray($fn)) {
      $fn.map((fn) => this.collectData(fn, field));
    }
    // it's just one function // DEPRECATED
    // if (typeof $fn === 'function') {
    //   this.collectData($fn, field);
    // }
    // execute the validation function
    this.executeValidation(field);
  }

  collectData($fn, field) {
    const res = this.handleFunctionResult($fn, field);
    // check and execute only if is a promise
    if (isPromise(res)) {
      const $p = res
        .then(($res) => field.setValidationAsyncData($res[0], $res[1]))
        .then(() => this.executeAsyncValidation(field));
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
    field.validationFunctionsData.map(
      (rule) => rule.valid === false && field.invalidate(rule.message, false)
    );
  }

  executeAsyncValidation(field) {
    if (field.validationAsyncData.valid === false) {
      field.invalidate(field.validationAsyncData.message, false, true);
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
    if (Array.isArray(res)) {
      const isValid = res[0] || false;
      const message = res[1] || "Error";
      return [isValid, message];
    }

    /**
      Handle "boolean"
    */
    if (_.isBoolean(res)) {
      return [res, "Error"];
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
    return [false, "Error"];
  }
}

export default (config?: ValidationPluginConfig): ValidationPlugin => ({
  class: VJF,
  config,
});
