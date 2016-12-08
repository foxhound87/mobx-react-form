import _ from 'lodash';
import { expect, assert } from 'chai';

import $forms from './data/_.flat'; // FORMS

describe('Check validate() returns promise that resolves to boolean', () => {
  _.each($forms, (form, key) => (
    it(`${key} validate() is promise that resolves to boolean`, () => {
      const promise = form.validate();
      expect(promise).to.be.a('promise');
      return promise.then(result => expect(result).to.be.a('boolean'));
    })
  ));
});

describe('Check validate(key) returns promise that resolves to boolean', () => (
  _.each($forms, (form, formKey) => describe(`${formKey} form`, () => (
    form.fields.forEach((field, fieldKey) => (
      it(`validate('${fieldKey}') is promise that resolves to boolean`, () => {
        const promise = form.validate(fieldKey);
        expect(promise).to.be.a('promise');
        return promise.then(result => expect(result).to.be.a('boolean'));
      })
    ))
  )))
));

describe('Check options() returns object', () => {
  _.each($forms, (form, key) => it(`${key} options() is object`, () =>
    assert.isObject(form.options(), `${key}.options() is not object`)));
});

describe('Check get() returns object', () => {
  _.each($forms, (form, key) => it(`${key} get() is object`, () =>
    assert.isObject(form.get(), `${key}.get() is not object`)));
});

describe('Check values() returns object', () => {
  _.each($forms, (form, key) => it(`${key} values() is object`, () =>
    assert.isObject(form.values(), `${key}.values() is not object`)));
});

describe('Check errors() returns object', () => {
  _.each($forms, (form, key) => it(`${key} errors() is object`, () =>
    assert.isObject(form.errors(), `${key}.errors() is not object`)));
});

describe('Check labels() returns object', () => {
  _.each($forms, (form, key) => it(`${key} labels() is object`, () =>
    assert.isObject(form.labels(), `${key}.labels() is not object`)));
});

describe('Check placeholders() returns object', () => {
  _.each($forms, (form, key) => it(`${key} placeholders() is object`, () =>
    assert.isObject(form.placeholders(), `${key}.placeholders() is not object`)));
});

describe('Check defaults() returns object', () => {
  _.each($forms, (form, key) => it(`${key} defaults() is object`, () =>
    assert.isObject(form.defaults(), `${key}.defaults() is not object`)));
});

describe('Check initials() returns object', () => {
  _.each($forms, (form, key) => it(`${key} initials() is object`, () =>
    assert.isObject(form.initials(), `${key}.initials() is not object`)));
});

describe('Check hasError returns boolean', () => {
  _.each($forms, (form, key) => it(`${key} hasError is boolean`, () =>
    assert.isBoolean(form.hasError, `${key}.hasError is not boolean`)));
});

describe('Check isDirty returns boolean', () => {
  _.each($forms, (form, key) => it(`${key} isDirty is boolean`, () =>
    assert.isBoolean(form.isDirty, `${key}.isDirty is not boolean`)));
});

describe('Check isPristine returns boolean', () => {
  _.each($forms, (form, key) => it(`${key} isPristine is boolean`, () =>
    assert.isBoolean(form.isPristine, `${key}.isPristine is not boolean`)));
});

describe('Check isDefault returns boolean', () => {
  _.each($forms, (form, key) => it(`${key} isDefault is boolean`, () =>
    assert.isBoolean(form.isDefault, `${key}.isDefault is not boolean`)));
});

describe('Check isValid returns boolean', () => {
  _.each($forms, (form, key) => it(`${key} isValid is boolean`, () =>
    assert.isBoolean(form.isValid, `${key}.isValid is not boolean`)));
});

describe('Check isEmpty returns boolean', () => {
  _.each($forms, (form, key) => it(`${key} isEmpty is boolean`, () =>
    assert.isBoolean(form.isEmpty, `${key}.isEmpty is not boolean`)));
});

// describe('Check eventsRunning() returns boolean', () => {
//   _.each($forms, (form, key) => it(`${key} eventsRunning() is boolean`, () =>
//     assert.isBoolean(form.eventsRunning(), `${key}.eventsRunning() is not boolean`)));
// });
