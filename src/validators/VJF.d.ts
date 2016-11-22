import * as Field from "../Field";
import * as Form from "../Form";
import {IOptions, Promises} from "../Validator";

export = VJF;

declare class VJF {
    protected validator: any|null;
    protected options: IOptions;

    public constructor(plugin: VJF.IPluginProps, config: VJF.IConfigProps);

    public validateField(field: Field, form: Form): void;

    public loadingMessage(): string;

    protected collectData($fn: Function, field: Field, form: Form): void;

    protected executeValidation(field: Field): void;

    protected executeAsyncValidation(field: Field): void;

    protected handleFunctionResult($fn: Function, field: Field, form: Form): void;
}

declare namespace VJF {
    export type IPluginProps = {}|any;
    export interface IConfigProps {
        options?: IOptions;
        promises?: Promises;
    }
}
