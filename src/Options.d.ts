export = Options;

declare class Options {
    protected options: Options.IOptionsProps;

    public get(key?: string|null): any|Options.IOptionsProps;

    public set(options: Options.IOptionsProps): void;
}

declare namespace Options {
    export interface IOptionsProps {
        showErrorsOnInit?: boolean; // false
        validateOnInit?: boolean; // true
        validateOnChange?: boolean; // true
        strictUpdate?: boolean; // false
        showErrorsOnUpdate?: boolean; // true
        defaultGenericError?: string|null; // null
        loadingMessage?: string|null; // null
        allowRequired?: boolean; // false
    }
}
