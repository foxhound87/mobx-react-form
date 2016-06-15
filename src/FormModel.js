import { observable, computed, extendObservable } from 'mobx';
import Field from './Field';

class FormModel {
  @observable fields = {};
  @observable validating = false;
  @computed get valid() {
    if (this.validating) {
      return false; // consider the form invalid until the validation process finish
    }
    const keys = Object.keys(this.fields);
    return keys.reduce((seq, key) => {
      const field = this.fields[key];
      seq = seq && field.valid; // eslint-disable-line no-param-reassign
      return seq;
    }, true);
  }

  fieldKeys() {
    return Object.keys(this.fields);
  }

  @computed get summary() {
    return this.fieldKeys().reduce((seq, key) => {
      const field = this.fields[key];
      if (field.errorMessage) {
        seq.push(field.errorMessage);
      }
      return seq;
    }, []);
  }

  validate() {
    this.validating = true;

    const p = this.fieldKeys().reduce((seq, key) => {
      const field = this.fields[key];
      return seq.then(() => field.validate(true));
    }, Promise.resolve());

    p.then(() => (this.validating = false));

    return p;
  }

  toJSON() {
    const keys = Object.keys(this.fields);
    return keys.reduce((seq, key) => {
      const field = this.fields[key];
      seq[key] = field.value; // eslint-disable-line no-param-reassign
      return seq;
    }, {});
  }

  constructor(initialState = {}, validators = {}) {
    const keys = Object.keys(initialState);

    keys.forEach((key) => {
      extendObservable(this.fields, {
        [key]: new Field(this, initialState[key], validators[key]),
      });
    });
  }
}

export function createModel(initialState, validators) {
  return new FormModel(initialState, validators);
}
