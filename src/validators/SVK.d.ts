import * as Field from '../Field';
import {Options, Promises} from '../Validator';

export = SVK;

declare class SVK {
    protected validate: any;
    protected promises: Promises;
    public readonly schema: SVK.Schema;
    protected extend: Function|null;
    protected options: Options;

    public constructor(plugin: SVK.Plugin, config?: SVK.Config);

    protected assignInitData(plugin: SVK.Plugin, config?: SVK.Config): void;

    protected initAJV(plugin: SVK.Plugin): void;

    public validateField(field: Field): void;

    protected handleSyncError(field: Field): void;

    protected handleAsyncError(field: Field, errors: any): void;

    protected executeAsyncValidation(field: Field): void;

    protected parseValues(values: any): any;

    public loadingMessage(): string;
}

declare namespace SVK {
    export interface Plugin {
        'package'?: any,
        extend?: Function
    }
    export interface Schema {}
    export interface Config {
        options?: Options,
        schema?: Schema,
        promises?: Promises
    }
}
