# 1.32
* Validate with different props.
* Reimplemented Event Hooks & Handlers.
* Introduced new Event Hooks.
* Introduced `input`/`output` props (converters).
* Introduced `hooks` Field prop and class function.
* Introduced `handlers` Field prop and class function.
* Introduced `validatedWith` Field prop.
* Introduced `validatedValue` Field computed.
* Option `alwaysShowDefaultError` removed.
* Option `uniqueId` (Custom Function) added.
* Option `validateDisabledFields` added.
* Computed `hasIncrementalNestedFields` renamed to `hasIncrementalKeys`.
* No more manually wire `onDrop` to `onChange`.

# 1.31
* Option `validateOnBlur` added.
* Option `validateOnChange` is `false` by default.
* Option `showErrorsOnUpdate` renamed `showErrorsOnChange`.
* Option `showErrorsOnChange` is `true` by default.
* Option `retrieveAlsoDisabledFields` renamed `retrieveOnlyEnabledFields`.
* Option `retrieveOnlyEnabledFields` is `false` by default.
* Option `validationDebounceOptions` default is `{ leading: false, trailing: true }`
* `options` Field prop renamed `extra`.
* `options` Field prop handle individual **Field Options**.
* **Field Options** will fallback on **Form Options**.
* Implemented input **file** `type` handling.
* Introduced `onDrop` Field Event Handler.
* Introduced `onDrop` Field Hook.
* Introduced `files` Field prop.
* Introduced `resetting` && `clearing` computed.
* Dropzone support.
* Ability to pass `onChange` & `onToggle` in constructor.

# 1.30
* New `onClear` & `onReset` Form & Fields Hooks.
* Introduced `retrieveAlsoDisabledFields` option.
* `observe` / `intercept` now supports Form props.
* `changed` & `touched` are now **false** after `clear` / `reset`.
* Fixed **unified** mode `initial` prop handling.

# 1.29
* Event Hooks deprecated.

# 1.28
* Method `forEach()` renamed `each()`.
* Refactored & semplified `map()`.
* Introduced `has()` method.
* Introduced Form `showErrors()` method.
* Introduced `size` computed prop.
* Prop `validate` renamed `validators` for consistency.
* Fixed empty nested array element (index 0 no more added).

# 1.27
* `focus` computed renamed `focused`.
* Introduced `autoFocus` input support.
* Introduced Field `focus()` method.

# 1.26
* Introduced `retrieveOnlyDirtyValues` option

# 1.25
* Introduced `extra` data

# 1.24
* `showErrors` on `Field` is `false` by default.
* `showErrors` on `validate()` is `false` by default.
* Introduced new showErrors options.
* `showErrorsOnUpdate` is changed to `false` by default.
* `showErrorsOnBlur` is now `true` by default.
* Introduced new `observeShowErrors()` Field method.
* Introduced `debouncedValidation` on `submit`.

# 1.23
* Auto invalidate `onSubmit` > `onError` if defaultGenericError is defined.
* Validation Handlers supports Promises.
* Introduced `submitting` prop
* Introduced `submitThrowsError`. option.

# 1.22
* Introduced Sub-Form Submission.
* Register `onSubmit` callbacks with constructor.
* `validate()` resolves to object (not boolean).
* Fixed Single Field Validation.

# 1.21
* Introduced Interceptors.
* `dispose()` API changed.

# 1.20

* Introduced `debouncedValidation`.
* Introduced Form & Field `validating` mobx computed (async check).
* Events Hooks: returned Form instance (was a Field instance).
* Fixed Async error state (removed `loadingMessage`)
* Fixed Async "validating..." Message (null as default).
* `loadingMessage` option removed.

# 1.19

* Introduced Observers.
* Introduced Converters (parse & format).
* Better Array Handling.
* Optional `submit()` onSuccess/onError callbacks.
* Fixed Empty Array Handling in Field Container.
* Removed Initial Array element "0" (no more del(0)).

# 1.18

* Ability to pass 'plugins' with plugins() method
* Ability to pass 'options' with options() method
* Ability to pass 'options' as fields prop
* Ability to pass 'bindings' to Form constructor
* Form 'options' moved on the second argument of the Form constructor
* Form 'plugins' moved on the second argument of the Form constructor

# 1.17

* Updated dependencies.
* Code refactoring & optimization.
* Reimplemented del(), observe(), validate().
* Introduced field computed validators().
* Introduced form computed validating().
* Introduced alwaysShowDefaultError option.
* Introduced setup() method.
* Introduced "disabled" computed prop
* Introduced Fields Props Bindings
* Introduced initial props: types, bindings.
* Introduced field props: type, bindings.
* Introduced $try helper for bindings.

# 1.16

* Allow add() to include initial value
* Allow add() to assign custom field key
* Introduced Field invalidate() method
* Introduced Field placeholder
* Introduced unique Field ID
* Introduced autoParseNumbers option

# 1.15

* Extensible Field

# 1.14

* Computed Deep Check

# 1.13

* Nested Fields
* Nested Validation

# 1.12

* MobX as peer depdendency
* Lodash Cherry Pick
* Fixed #74 (validateOnChange option)

# 1.11

* Enhanced events handlers
* Added validateOnChange, strictUpdate, showErrorsOnUpdate options
* Define Fields Properties and Validators Separately
* Define fields as Array of Objects
* Added field set(prop, val) for edit props
* Added form onInit() event
* Added form options() get/set
* Bulk update() form properties

# 1.10

* Fixed some documentation errors
* Enabled VJF enhancement
* Support for React Select

# 1.9

* Validation Plugins
* Multiple Validation Styles
* Support for Async Validation
* Support for Material UI, React Widgets
* Package name changed from `mobx-ajv-form` to `mobx-react-form`

# 1.8

* Decoupled validator from fields

# 1.7

* Validation using mobx observe on field $value
* Display errors of related fields

# 1.5

* Custom Validation Functions

# 1.4

* Support for v5 json schema rules

# 1.3

* Updated constructor with single object
* Custom Validation Keywords
* Created API Documentation
* Added methods: isDirty();
* Renamed computed values: valid to isValid
* Added some tests

# 1.2

* Added silent mode
* Updated methods: validate(); clear(); reset();
* Clear genericErrorMessage on clear/reset

# 1.2

* Added methods: reset();
* Updated methods: clear();

# 1.1

* Fixed UMD build external libs

# 1.1

* Added UMD build/support

# 1.1

* Updated README.md

# 1.0

* First Release
