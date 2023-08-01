import { action, observable, makeObservable } from "mobx";
import _ from "lodash";
import { $try } from "./utils";
import ValidatorInterface, {
  DriversMap,
  ValidationPluginInterface,
  ValidationPlugins,
} from "./models/ValidatorInterface";
import { FormInterface } from "./models/FormInterface";
import { FieldInterface } from "./models/FieldInterface";
import { OptionsEnum } from "./models/OptionsModel";

export default class Validator implements ValidatorInterface {
  promises: Promise<any>[] = [];

  form: FormInterface = null;

  drivers: DriversMap = {};

  plugins: ValidationPlugins = {
    vjf: undefined,
    dvr: undefined,
    svk: undefined,
    yup: undefined,
  };

  error: string | null = null;

  constructor(obj: any = {}) {
    makeObservable(this, {
      error: observable,
      validate: action,
      validateField: action,
    });
    _.merge(this.plugins, obj.plugins);
    this.form = obj.form;

    this.initDrivers();
    this.checkSVKValidationPlugin();
  }

  initDrivers(): void {
    _.map(
      this.plugins,
      (driver, key) =>
        (this.drivers[key] =
          driver &&
          _.has(driver, "class") &&
          new driver.class({
            config: driver.config,
            state: this.form.state,
            promises: this.promises,
          }))
    );
  }

  validate(opt: any = {}, obj: any = {}): Promise<any> {
    const path = $try(opt.path, opt);
    const instance = $try(opt.field, this.form.select(path, null, false), this.form);
    const related = $try(opt.related, obj.related, true);
    const showErrors = $try(opt.showErrors, obj.showErrors, false);
    instance.$validating = true;
    instance.$validated += 1;

    this.error = null;

    return new Promise((resolve) => {
      // validate instance (form or filed)
      if (instance.path || _.isString(path)) {
        this.validateField({
          field: instance,
          showErrors,
          related,
          path,
        });
      }

      // validate nested fields
      instance.each((field: any) =>
        this.validateField({
          path: field.path,
          field: field,
          showErrors,
          related,
        })
      );

      // wait all promises
      resolve(Promise.all(this.promises));
    })
      .then(
        action(() => {
          instance.$validating = false;
          instance.$clearing = false;
          instance.$resetting = false;
        })
      )
      .catch(
        action((err) => {
          instance.$validating = false;
          instance.$clearing = false;
          instance.$resetting = false;
          throw err;
        })
      )
      .then(() => instance);
  }

  validateField({
    showErrors = false,
    related = false,
    field = null,
    path,
  }: any): void {
    const instance = field || this.form.select(path);
    const { options } = this.form.state;
    // check if the field is a valid instance
    if (!instance.path) throw new Error("Validation Error: Invalid Field Instance");
    // do not validate soft deleted fields
    if (instance.deleted && !options.get(OptionsEnum.validateDeletedFields, instance)) return;
    // do not validate disabled fields
    if (instance.disabled && !options.get(OptionsEnum.validateDisabledFields, instance)) return;
    // do not validate pristine fields
    if (instance.isPristine && !options.get(OptionsEnum.validatePristineFields, instance)) return;
    // reset validation before validate
    if (options.get(OptionsEnum.resetValidationBeforeValidate, instance)) instance.resetValidation();
    // trim string value before validation
    if (options.get(OptionsEnum.validateTrimmedValue, instance)) instance.trim();

    // get stop on error
    const stopOnError = options.get(
      OptionsEnum.stopValidationOnError,
      instance
    );

    // get validation plugin order
    const validationPluginOrder = options.get(
      OptionsEnum.validationPluginsOrder,
      instance
    );

    const drivers = validationPluginOrder
      ? validationPluginOrder.map((n: string) => this.drivers[n])
      : this.drivers;

    // validate with all enabled drivers
    _.each(drivers, (driver: ValidationPluginInterface) => {
      driver && driver.validate(instance);
      if (stopOnError && instance.hasError) {
        return false;
      }
    });

    // send error to the view
    instance.showErrors(showErrors);

    // related validation
    if (related) this.validateRelatedFields(instance, showErrors);
  }

  /**
    Validate 'related' fields if specified
    and related validation allowed (recursive)
  */
  validateRelatedFields(field: FieldInterface, showErrors: boolean): void {
    if (!field.related || !field.related.length) return;

    _.each(field.related, (path) =>
      this.validateField({
        related: false,
        showErrors,
        path,
      })
    );
  }

  checkSVKValidationPlugin(): void {
    if (_.isNil(this.drivers.svk) && _.get(this.plugins, "svk.config.schema")) {
      const form = (this as any).state.form.name
        ? `Form: ${(this as any).state.form.name}`
        : "";
      throw new Error(
        `The SVK validation schema is defined but no plugin provided (SVK). ${form}`
      );
    }
  }
}
