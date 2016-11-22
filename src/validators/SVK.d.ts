import * as Field from "../Field";
import {IOptions, Promises} from "../Validator";

export = SVK;

declare class SVK {
    public readonly schema: SVK.ISchema;

    public readonly options: IOptions;

    protected validate: any;
    protected promises: Promises;
    protected extend: Function|null;

    public constructor(plugin: SVK.IPluginProps, config?: SVK.IConfigProps);

    public validateField(field: Field): void;

    public loadingMessage(): string;

    protected assignInitData(plugin: SVK.IPluginProps, config?: SVK.IConfigProps): void;

    protected initAJV(plugin: SVK.IPluginProps): void;

    protected handleSyncError(field: Field): void;

    protected handleAsyncError(field: Field, errors: any): void;

    protected executeAsyncValidation(field: Field): void;

    protected parseValues(values: any): any;
}

declare namespace SVK {
    export interface IPluginProps {
        "package"?: any;
        extend?: Function;
    }
    export interface ISchema {
    }
    export interface IConfigProps {
        options?: IOptions;
        schema?: ISchema;
        promises?: Promises;
    }
}
