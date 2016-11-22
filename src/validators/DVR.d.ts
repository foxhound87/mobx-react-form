import * as Field from "../Field";
import * as Form from "../Form";
import {IOptions, Promises} from "../Validator";

export = DVR;

declare class DVR {
    public readonly options: IOptions;

    protected promises: Promises;
    protected asyncRules: string[];
    protected validator: any|null;
    protected extend: Function|null;

    public constructor(plugin: DVR.IPluginProps, config?: DVR.IConfigProps);

    public validateField(field: Field, form: Form): void;

    public registerAsyncRule(key: string, callback: Function): void;

    public loadingMessage(): string;

    protected assignInitData(plugin: DVR.IPluginProps, config?: DVR.IConfigProps): void;

    protected extendValidator(): void;

    protected validateFieldSync(field: Field, form: Form, data: any): void;

    protected validateFieldAsync(field: Field, form: Form, data: any): void;

    protected handleAsyncPasses(field: Field, resolve: Function): void;

    protected handleAsyncFails(field: Field, validation: any, resolve: Function): void;

    protected executeAsyncValidation(field: Field): void;

    protected rules(rules?: string|string[], type?: "sync"|"async"): string[];
}

declare namespace DVR {
    export interface IPluginProps {
        "package"?: any;
        extend?: Function;
    }
    export interface IConfigProps {
        options?: IOptions;
        promises?: Promises;
    }
}
