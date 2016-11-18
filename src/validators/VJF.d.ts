import * as Field from '../Field';
import * as Form from '../Form';
import {Options, Promises} from '../Validator';

export = VJF;

declare class VJF {
    protected validator: any|null;
    protected options: Options;

    public constructor(plugin: VJF.Plugin, config: VJF.Config);

    public validateField(field: Field, form: Form): void;

    public loadingMessage(): string;

    protected collectData($fn: Function, field: Field, form: Form): void;

    protected executeValidation(field: Field): void;

    protected executeAsyncValidation(field: Field): void;

    protected handleFunctionResult($fn: Function, field: Field, form: Form): void;
}

declare namespace VJF {
    export type Plugin = {}|any;
    export interface Config {
        options?: Options,
        promises?: Promises
    }
}
