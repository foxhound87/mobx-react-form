export = Options;

declare class Options {
    protected options: Options.Props;
    public get(key?: string|null): string|null|boolean|undefined|Options.Props;
    public set(options: Options.Props): void;
}

declare namespace Options {
    export interface Props {
        showErrorsOnInit?: boolean; //false
        validateOnInit?: boolean; //true
        validateOnChange?: boolean; //true
        strictUpdate?: boolean; //false
        showErrorsOnUpdate?: boolean; //true
        defaultGenericError?: string|null; //null
        loadingMessage?: string|null; //null
        allowRequired?: boolean; //false
    }
}