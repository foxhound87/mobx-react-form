import * as DVR from './validators/DVR';
import * as SVK from './validators/SVK';
import * as VJF from './validators/VJF';
import * as Form from './Form';
import {ObservableMap} from 'mobx';
import * as Field from './Field';

export = Validator;

declare class Validator {
    public readonly promises: Validator.Promises;
    protected options: Validator.Options;
    protected plugins: {
        vjf: boolean|VJF.Plugin;
        svk: boolean|SVK.Plugin;
        dvr: boolean|DVR.Plugin;
    };
    protected validators: {
        vjf: VJF|null;
        svk: SVK|null;
        dvr: DVR|null;
    };
    public readonly genericErrorMessage: string|null;

    public constructor(obj?: {});

    protected assignInitData(config?: Validator.Config): void;

    protected initializePlugins(config?: Validator.Config): void;

    public schema(): SVK.Schema | {};

    public validateAll(o: {form: Form, showErrors?: boolean, related?: boolean}): void;

    protected validateAllDeep(form: Form, fields: ObservableMap<Field>, showErrors: boolean, related: boolean, path?: string): void;

    public validateField(o: {form?: Form|null, field?: Field|null, key: string, showErrors?: boolean, related?: boolean}): void;

    protected relatedFieldValidation(form: Form, fields: ObservableMap<Field>, showErrors: boolean);

    public getDefaultErrorMessage(): string;

    public resetGenericError(): void;

    public invalidate(message?: string|null): void;
}

declare namespace Validator {
    export interface Config {
        options?: Options;
        plugins?: any;
    }
    export interface Options {
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
    export type Promises = Promise<any>[];
}
