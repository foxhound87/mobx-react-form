import _ from 'lodash';
import { expect, assert } from 'chai';

import $forms from './data';

describe('Check validate() returns promise', () => {
  _.each($forms, (form, key) => it(`${key} validate() is promise`, () =>
    expect(form.validate()).to.be.a('promise')));
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

describe('Check defaults() returns object', () => {
  _.each($forms, (form, key) => it(`${key} defaults() is object`, () =>
    assert.isObject(form.defaults(), `${key}.defaults() is not object`)));
});

describe('Check initials() returns object', () => {
  _.each($forms, (form, key) => it(`${key} initials() is object`, () =>
    assert.isObject(form.initials(), `${key}.initials() is not object`)));
});

describe('Check eventsRunning() returns boolean', () => {
  _.each($forms, (form, key) => it(`${key} eventsRunning() is boolean`, () =>
    assert.isBoolean(form.eventsRunning(), `${key}.eventsRunning() is not boolean`)));
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
