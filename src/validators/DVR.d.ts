import * as Field from '../Field';
import * as Form from '../Form';
import {Options, Promises} from '../Validator';

export = DVR;

declare class DVR {
    protected promises: Promises;
    protected asyncRules: string[];
    protected validator: any|null;
    protected extend: Function|null;
    protected options: Options;

    public constructor(plugin: DVR.Plugin, config?: DVR.Config);

    public validateField(field: Field, form: Form): void;

    public loadingMessage(): string;

    protected assignInitData(plugin: DVR.Plugin, config?: DVR.Config): void;

    protected extendValidator(): void;

    protected validateFieldSync(field: Field, form: Form, data: any): void;

    protected validateFieldAsync(field: Field, form: Form, data: any): void;

    protected handleAsyncPasses(field: Field, resolve: Function): void;

    protected handleAsyncFails(field: Field, validation: any, resolve: Function): void;

    protected executeAsyncValidation(field: Field): void;

    protected registerAsyncRule(key: string, callback: Function): void;

    protected rules(rules?: string|string[], type?: 'sync'|'async'): string[];
}

declare namespace DVR {
    export interface Plugin {
        'package'?: any,
        extend?: Function
    }
    export interface Config {
        options?: Options,
        promises?: Promises
    }
}