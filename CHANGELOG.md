# 6.7.5 (master)
- better handling of `deep` argument for `showErrors()` & `invalidate()` methods.
- removed `mixed` mode warning

# 6.7.4 (master)
- Fix: extend hooks and handlers on form instance using set()

# 6.7.3 (master)
- Fix: reset validation action for mobx strict mode

# 6.7.2 (master)
- Fix: mobx strict mode for hooks and handlers

# 6.7.1 (master)
- Fix: #632 observable hooks and handlers

# 6.7.0 (master)
- Feat: introduced `class`/`classes` props to handle `Field` extension in Fields Definitions.

# 6.6.1 (master)
- Fix: added missing bind method to field interface

# 6.6.0 (master)
- Introduced ZOD validation driver
- Added SVK support for array of objects
- Fix: #404

# 6.5.0 (master)
- Deprecatad: `setHooks()` & `getHooks()` methods.
- Handle `set()/get()` for `hooks` and `handlers`

# 6.4.0 (master)
- Feat: ability to define or override hooks after initialization.
- Feat: Introduced `setHooks()` & `getHooks()` methods.

# 6.3.7 (master)
- Fix: handle `onSubmit` hook return promise

# 6.3.6 (master)
- Fix: composer `error()` method.
- Fix: default models/interfaces have now named exports.
- Fix: check event w/ `isEvent()` to call `preventDefault()` for native support.

# 6.3.5 (master)
- Fix: `parseCheckArray` checks for `incremental` field status.
- Updated `semantic-release`

# 6.3.4 (master)
- Fix: `isEmptyArray` reimplemented in `isArrayFromStruct` util function;
- Removed lodash `_.isArray()` with `Array.isArray()`
- Introduced `struct` prop in `makeField` method.

# 6.3.3 (master)
- Fix: `get('value')` retrieve empty array removed by `update()`
- Fix: `composer` returned in `validate/submit` instead of single methods.

# 6.3.2 (master)
- Fix: `preserveDeletedFieldsValues` on `add()` action to handle `fields` prop.

# 6.3.1 (master)
- Introduced field `computed` prop. To handle nested array fields computed values.

# 6.3.0 (master)
- Introduced Forms Composer
- Introduced Functional Computed Field Props
- Introduced `strictSelect` and `strictSet` form options.
- Form option `strictUpdate` behavior changed (now applied on `update()` action).
- Field prop `validators` does not accept anymore a single function, an array of functions is needed.

# 6.2.3 (master)
- Introduced `applyInputConverterOnInit`, `applyInputConverterOnSet`, `applyInputConverterOnUpdate` form options.
- Introduced `converter` function applied on `set value`.
- Fix: `input` function removed from `set value`.

# 6.2.2 (master)
- Fix: mobx cycle detected in computation (get() strict mode)

# 6.2.1 (master) - DEPRECATED
- Refactored set value with input function
- Deprecated input function on `initial` and `default` props.
- Fix: input function applied 2 times when using `set()`

# 6.2.0 (master)
- Feat: #433 (File input append mode)

# 6.1.1 (master)
- Fix: #624 (defaults() helpers)

# 6.1.0 (master)
- Introduced `fallbackValue` and `retrieveNullifiedEmptyStrings` form options.
- Fix: `get()` strict mode improved
- Fix: default type file value;

# 6.0.0 (master)
- stable typescript release

# 5.10.1 (next)
- `set()` will apply `input` function also to `initial` and `default` props.
- Fix: #519

# 5.10.0 (next)
- Introduced Field `trim()` method.
- Introduced `validateTrimmedValue` form option.
- Introduced `resetValidationBeforeValidate` form option.
- `validationOrder` form option renamed to `validationPluginsOrder`.
- Added computed `validating` & `submitting` in allowed props guard.
- Fix: `clearing` and `resetting` observable mutation.
- Updated Issue: #283

# 5.9.1 (next)
Fix: using `autoTrimValue` option will not trigger `onChange` Event Hook

# 5.9.0 (next)

- Introduced `inputMode` Field property.
- Introduced `autoTrimValue` form option (can be also enabled on single field).
- Fix: #283

# 5.8.0 (next)

- `set()` method will increase `changed` prop and trigger `onChange` Event Hook
- Mobx events (observe/intercept) allowed props guarded.
- Introduced `onSync` Hook (triggered on `onChange` Event Handler)
- Introduced `validateOnSubmit` form option (active by default).
- Fix: `ref` prop for separated props mode renamed to `refs` (plural)
- Fix: #337
# 5.7.1 (next)

- fix: allow `ref` prop on `set()`
- fix: `ref` computed accessible (before was accessed by $ref)
# 5.7.0 (next)

- Introduced `ref` Field prop. (handle React Refs);
- `ref` is auto-binded with the input when using `bind()` or can be defined/changed with `set()`
- `autoFocus` bheavior changed, now can be defined in field definitions or can be assigned with `set()`.
- `focus()` method reimplemented using auto-ref (fixed).
- Introduced Field `blur()` method (using auto-ref).
- Fix: #529 #250 #524

# 5.5.2 (next)

- Fix: Empty Constructor (was requiring at least an empyt object if used with only class fileds definitions)

# 5.5.1 (next)

- Introduced `preserveDeletedFieldsValues` form option (disabled by default).
- Fix: after deleting and adding same field, the defined initial values will not be preserverd anymore.

# 5.5.0 (next)

- Updated add()/del()/update() actions to handle `changed` field prop.
(not triggering anymore `onChange` when using add(), use `onAdd`/`onDel` hooks instead).
- Updated `changed` computed prop behavior for nested fields and Event Hooks triggering.
- Events Hooks now are triggered also from actions if not used Event Handlers.
- fix: #585 #531

# 5.4.1 (next)

fix: #371 #399 #408

# 5.4.0 (next)

- Support for `default` Bindings Template.
- `clear()` & `reset()` methods will revert to initial validation state instead of `validate()`.
- introduced `onKeyUp` and `onKeyDown` fields Hooks and Handlers.
- introduced `validateOnClear` & `validateOnReset` form options (disabled by default).
- introduced `removeNullishValuesInArrays` form option (disabled by default).
- introduced `retrieveOnlyEnabledFieldsErrors` form option (disabled by default).
- `retrieveOnlyDirtyValues` form option renamed to `retrieveOnlyDirtyFieldsValues`.
- `retrieveOnlyEnabledFields` form option renamed to `retrieveOnlyEnabledFieldsValues`
- fix: #617 #615 #613 #614 #544 #454 #518 #376 #497 #582 #394

# 5.3.2 (next)

- fix: Support `validatedWith` with nested property of a field's value
# 5.3.1 (next)

- fix: cannot change disabled prop on fields
# 5.3.0 (next)

- nested fields trigger onchange hook on container
# 5.2.0 (next)

- trigger onChange hook on add/del
# 5.1.0 (next)

- Form level onChange hook
- introduced reducer
# 4.0.0 / 5.0.0 (next)

- Typescript support

# 3.2.0

- mobx 6.3.3 support

# 3.1.2

- stopValidationOnError & validationOrder options (fix #576)

# 3.1.1

- labels for DVR dependant fields for before/after rules

# 3.1.0

- mobx6.1 support

# 3.0.0

- mobx6 support

# 2.0.8

- pull #528

# 2.0.7

- pull #525

# 2.0.6

- fix #521

# 2.0.5

- fix #514 #516

# 2.0.4

- fix #507

# 2.0.3

- introduced `fallback` form option

# 2.0

- introduced `validateOnChangeAfterSubmit` form option

# 1.39

- reimplemented `initial`/`default` `isDirty`/`isPristine`

# 1.38

- introduced `validateDeletedFields` form option

# 1.37

- decoupled validation plugins drivers
- introduced `yup` validation plugin
- changed validation plugins `extend` callback props
- AJV schema definition moved to plugin setup
- introduced `softDelete` option
- introduced `submitted` & `validated` prop

# 1.35

- mobx5 support
- Introduced observable `type` field prop
- Removed `label` fallback to field `name`
- fix: #432 #415 #355 #347 #425 #429 #416

# 1.34

- Added `struct` constructor prop
- Reimplemented add() method

# 1.33

- mobx4 support

# 1.32

- Validate with different props.
- Reimplemented Event Hooks & Handlers.
- Introduced new Event Hooks.
- Introduced `input`/`output` props (converters).
- Introduced `hooks` Field prop and class function.
- Introduced `handlers` Field prop and class function.
- Introduced `validatedWith` Field prop.
- Introduced `validatedValue` Field computed.
- Option `alwaysShowDefaultError` removed.
- Option `uniqueId` (Custom Function) added.
- Option `validateDisabledFields` added.
- Computed `hasIncrementalNestedFields` renamed to `hasIncrementalKeys`.
- No more manually wire `onDrop` to `onChange`.

# 1.31

- Option `validateOnBlur` added.
- Option `validateOnChange` is `false` by default.
- Option `showErrorsOnUpdate` renamed `showErrorsOnChange`.
- Option `showErrorsOnChange` is `true` by default.
- Option `retrieveAlsoDisabledFields` renamed `retrieveOnlyEnabledFields`.
- Option `retrieveOnlyEnabledFields` is `false` by default.
- Option `validationDebounceOptions` default is `{ leading: false, trailing: true }`
- `options` Field prop renamed `extra`.
- `options` Field prop handle individual **Field Options**.
- **Field Options** will fallback on **Form Options**.
- Implemented input **file** `type` handling.
- Introduced `onDrop` Field Event Handler.
- Introduced `onDrop` Field Hook.
- Introduced `files` Field prop.
- Introduced `resetting` & `clearing` computed.
- Dropzone support.
- Ability to pass `onChange` & `onToggle` in constructor.

# 1.30

- New `onClear` & `onReset` Form & Fields Hooks.
- Introduced `retrieveAlsoDisabledFields` option.
- `observe` / `intercept` now supports Form props.
- `changed` & `touched` are now **false** after `clear` / `reset`.
- Fixed **unified** mode `initial` prop handling.

# 1.29

- Event Hooks deprecated.

# 1.28

- Method `forEach()` renamed `each()`.
- Refactored & semplified `map()`.
- Introduced `has()` method.
- Introduced Form `showErrors()` method.
- Introduced `size` computed prop.
- Prop `validate` renamed `validators` for consistency.
- Fixed empty nested array element (index 0 no more added).

# 1.27

- `focus` computed renamed `focused`.
- Introduced `autoFocus` input support.
- Introduced Field `focus()` method.

# 1.26

- Introduced `retrieveOnlyDirtyValues` option

# 1.25

- Introduced `extra` data

# 1.24

- `showErrors` on `Field` is `false` by default.
- `showErrors` on `validate()` is `false` by default.
- Introduced new showErrors options.
- `showErrorsOnUpdate` is changed to `false` by default.
- `showErrorsOnBlur` is now `true` by default.
- Introduced new `observeShowErrors()` Field method.
- Introduced `debouncedValidation` on `submit`.

# 1.23

- Auto invalidate `onSubmit` > `onError` if defaultGenericError is defined.
- Validation Handlers supports Promises.
- Introduced `submitting` prop
- Introduced `submitThrowsError`. option.

# 1.22

- Introduced Sub-Form Submission.
- Register `onSubmit` callbacks with constructor.
- `validate()` resolves to object (not boolean).
- Fixed Single Field Validation.

# 1.21

- Introduced Interceptors.
- `dispose()` API changed.

# 1.20

- Introduced `debouncedValidation`.
- Introduced Form & Field `validating` mobx computed (async check).
- Events Hooks: returned Form instance (was a Field instance).
- Fixed Async error state (removed `loadingMessage`)
- Fixed Async "validating..." Message (null as default).
- `loadingMessage` option removed.

# 1.19

- Introduced Observers.
- Introduced Converters (parse & format).
- Better Array Handling.
- Optional `submit()` onSuccess/onError callbacks.
- Fixed Empty Array Handling in Field Container.
- Removed Initial Array element "0" (no more del(0)).

# 1.18

- Ability to pass 'plugins' with plugins() method
- Ability to pass 'options' with options() method
- Ability to pass 'options' as fields prop
- Ability to pass 'bindings' to Form constructor
- Form 'options' moved on the second argument of the Form constructor
- Form 'plugins' moved on the second argument of the Form constructor

# 1.17

- Updated dependencies.
- Code refactoring & optimization.
- Reimplemented del(), observe(), validate().
- Introduced field computed validators().
- Introduced form computed validating().
- Introduced alwaysShowDefaultError option.
- Introduced setup() method.
- Introduced "disabled" computed prop
- Introduced Fields Props Bindings
- Introduced initial props: types, bindings.
- Introduced field props: type, bindings.
- Introduced $try helper for bindings.

# 1.16

- Allow add() to include initial value
- Allow add() to assign custom field key
- Introduced Field invalidate() method
- Introduced Field placeholder
- Introduced unique Field ID
- Introduced autoParseNumbers option

# 1.15

- Extensible Field

# 1.14

- Computed Deep Check

# 1.13

- Nested Fields
- Nested Validation

# 1.12

- MobX as peer depdendency
- Lodash Cherry Pick
- Fixed #74 (validateOnChange option)

# 1.11

- Enhanced events handlers
- Added validateOnChange, strictUpdate, showErrorsOnUpdate options
- Define Fields Properties and Validators Separately
- Define fields as Array of Objects
- Added field set(prop, val) for edit props
- Added form onInit() event
- Added form options() get/set
- Bulk update() form properties

# 1.10

- Fixed some documentation errors
- Enabled VJF enhancement
- Support for React Select

# 1.9

- Validation Plugins
- Multiple Validation Styles
- Support for Async Validation
- Support for Material UI, React Widgets
- Package name changed from `mobx-ajv-form` to `mobx-react-form`

# 1.8

- Decoupled validator from fields

# 1.7

- Validation using mobx observe on field $value
- Display errors of related fields

# 1.5

- Custom Validation Functions

# 1.4

- Support for v5 json schema rules

# 1.3

- Updated constructor with single object
- Custom Validation Keywords
- Created API Documentation
- Added methods: isDirty();
- Renamed computed values: valid to isValid
- Added some tests

# 1.2

- Added silent mode
- Updated methods: validate(); clear(); reset();
- Clear genericErrorMessage on clear/reset

# 1.2

- Added methods: reset();
- Updated methods: clear();

# 1.1

- Fixed UMD build external libs

# 1.1

- Added UMD build/support

# 1.1

- Updated README.md

# 1.0

- First Release
