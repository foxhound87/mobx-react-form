import {ObservableMap} from "mobx";
import * as Field from "./Field";
import * as Form from "./Form";
import * as DVR from "./validators/DVR";
import * as SVK from "./validators/SVK";
import * as VJF from "./validators/VJF";

export = Validator;

declare class Validator {
    public readonly promises: Validator.Promises;
    public readonly genericErrorMessage: string|null;

    protected options: Validator.IOptions;
    protected plugins: {
        vjf: boolean|VJF.IPluginProps;
        svk: boolean|SVK.IPluginProps;
        dvr: boolean|DVR.IPluginProps;
    };
    protected validators: {
        vjf: VJF|null;
        svk: SVK|null;
        dvr: DVR|null;
    };

    public constructor(obj?: {});

    public schema(): SVK.ISchema | {};

    public validateAll(o: {form: Form, showErrors?: boolean, related?: boolean}): void;

    public validateField(o: {form?: Form|null, field?: Field|null,
        key: string, showErrors?: boolean, related?: boolean}): void;

    public getDefaultErrorMessage(): string;

    public resetGenericError(): void;

    public invalidate(message?: string|null): void;

    protected relatedFieldValidation(form: Form, fields: ObservableMap<Field>, showErrors: boolean): void;

    protected validateAllDeep(form: Form, fields: ObservableMap<Field>,
                              showErrors: boolean, related: boolean, path?: string): void;

    protected assignInitData(config?: Validator.IConfig): void;

    protected initializePlugins(config?: Validator.IConfig): void;
}

declare namespace Validator {
    export interface IConfig {
        options?: IOptions;
        plugins?: any;
    }
    export interface IOptions {
        showErrorsOnInit?: boolean;
        validateOnInit?: boolean;
        validateOnChange?: boolean;
        strictUpdate?: boolean;
        showErrorsOnUpdate?: boolean;
        defaultGenericError?: string|null;
        loadingMessage?: string|null;
        allowRequired?: boolean;
        ajv?: {};
    }
    export type Promises = Array<Promise<any>>;
}
