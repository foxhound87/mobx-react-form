import { action, observable, toJS } from 'mobx';
import AJV from 'ajv';
import _ from 'lodash';

export default class Validator {

  ajv = null;
  schema = {};
  extend = {};
  options = {};

  @observable genericErrorMessage = null;

  constructor(obj = {}) {
    this.assignInitData(obj);
    this.initAjv();
  }

  assignInitData({ options = {}, schema = {}, extend = {} }) {
    this.options = options;
    this.schema = schema;
    this.extend = extend;
  }

  initAjv() {
    if (!this.schema) return;
    // create ajv instance
    const ajvInstance = new AJV(_.merge(this.options, {
      v5: true,
      allErrors: true,
      coerceTypes: true,
      errorDataPath: 'property',
    }));
    // extend with custom keywords
    if (this.extend) {
      _.each(this.extend, (val, key) =>
        ajvInstance.addKeyword(key, val));
    }
    // create ajvInstance validator (compiling rules)
    this.ajv = ajvInstance.compile(this.schema);
  }

  validateAll({ fields, values = null, showErrors = true, recursive = false }) {
    // validate each field recursively
    if (recursive) {
      _.each(fields, (field, key) =>
        this.validateField(fields, key, showErrors, recursive));
    }
    // Check generic validation (no recursion)
    if (values && !recursive) {
      this.checkGenericValidation(fields, values, showErrors);
    }
  }

  validateField(fields, key, showErrors = true, recursive = false) {
    const field = fields[key];
    // reset field validation
    field.setValid();
    // validate with ajv
    this.validateFieldWithAjv(field, showErrors);
    // validate with functions
    this.validateFieldWithFunctions(fields, field, showErrors);
    // recursive validation
    if (recursive) this.recursiveFieldValidation(fields, field, showErrors);
  }

  recursiveFieldValidation(fields, field, showErrors) {
    /*
      validate 'related' fields if specified
      and recursive validation allowed
    */
    if (!_.isEmpty(field.related)) {
      _.each(field.related, ($rel) =>
        this.validateField(fields, $rel, showErrors, false));
    }
  }

  validateFieldWithAjv(field, showErrors = true) {
    if (!this.ajv) return;
    const data = { [field.name]: field.value };
    const formIsValid = this.ajv(this.parseValues(data));
    if (!formIsValid) this.setAjvErrorByField(field, showErrors);
  }

  setAjvErrorByField(field, showErrors) {
    // find current field error message from ajv errors
    const fieldErrorObj = _.find(this.ajv.errors, (item) =>
      _.includes(item.dataPath, `.${field.name}`));
    // if fieldErrorObj is not undefined, the current field is invalid.
    if (!_.isUndefined(fieldErrorObj)) {
      // the current field is now invalid
      // add additional info to the message
      const message = `${field.label} ${fieldErrorObj.message}`;
      // invalidate the current field with message
      field.setInvalidWithMessage(message, showErrors);
      return;
    }
  }

  validateFieldWithFunctions(fields, field, showErrors) {
    if (!field.validateProperty) return;
    // reset field.handleValidateFunction
    _.set(field, 'validationFunctionsData', []);
    // get validators from validate property
    const $validator = toJS(field.validateProperty);
    // check if is a validator function
    if (_.isFunction($validator)) {
      const res = this.handleValidateFunction($validator, field, fields);
      field.validationFunctionsData.push({ valid: res[0], message: res[1] });
    }

    // check if is an array of validator functions
    if (_.isArray($validator)) {
      // loop validation functions
      _.each($validator, ($fn) => {
        if (_.isFunction($fn)) {
          const res = this.handleValidateFunction($fn, field, fields);
          field.validationFunctionsData.push({ valid: res[0], message: res[1] });
        }
      });
    }

    // check validate functions
    const isValid = _.every(field.validationFunctionsData, 'valid');

    if (!isValid) {
      // otherwise loop until find an error message to show
      _.each(field.validationFunctionsData, (rule) => {
        if (rule.valid === false) {
          field.setInvalidWithMessage(rule.message, showErrors);
          return;
        }
      });
    }
  }

  handleValidateFunction($validator, field, fields) {
    // executre validation function
    const res = $validator({ field, fields });

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

    return [false, 'Error'];
  }

  @action
  checkGenericValidation(fields, values, showErrors) {
    this.genericErrorMessage = null;
    // reset field validation
    _.each(fields, (field) => field.setValid());
    // validate all values against ajv schema
    if (this.ajv && !this.ajv(this.parseValues(values))) {
      const msg = 'An error occurred. Validation has failed.';
      if (showErrors) this.genericErrorMessage = msg;
    }
    // validate all fields
    _.each(fields, (field) => {
      // set ajv error if found
      if (this.ajv) this.setAjvErrorByField(field, showErrors);
      // validate with functions
      this.validateFieldWithFunctions(fields, field, showErrors);
    });
  }

  @action
  invalidate(message) {
    if (_.isString(message)) {
      this.genericErrorMessage = message;
      return;
    }
    this.genericErrorMessage = 'An error occurred sending request.';
    return;
  }

  parseValues(values) {
    if (this.options.allowRequired === true) {
      return _.omitBy(values, (_.isEmpty || _.isNull || _.isUndefined || _.isNaN));
    }
    return values;
  }
}
