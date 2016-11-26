import {ObservableMap} from "mobx";
import * as Field from "./Field";
import * as Options from "./Options";
import * as State from "./State";
import * as Validator from "./Validator";

export = Form;

declare class Form {

    public readonly name: string|null;
    public readonly hasError: boolean;
    public readonly isValid: boolean;
    public readonly isDirty: boolean;
    public readonly isPristine: boolean;
    public readonly isDefault: boolean;
    public readonly isEmpty: boolean;
    public readonly error: string|null;
    public readonly fields: ObservableMap<Field>;
    public readonly validator: Validator|null;

    public constructor();
    public constructor(unified: {fields: {}|Array<{}>}, name?: string|null);
    public constructor(separated: Form.ISeparatedProps, name?: string|null);
    public constructor(initial?: {}, name?: string|null);

    public options(options: Options.IOptionsProps): Options.IOptionsProps;
    public options(option: string): any;

    public on(event: string, callback: (obj: {form: Form, path: string}) => any): void;

    public validate(opt?: {}, obj?: {}): Promise<boolean>;

    public invalidate(message?: string|null): void;

    public clear(): void;

    public reset(): void;

    public submit(obj?: {onSubmit?: (form: Form) => any, onError?: (form: Form) => any}): Promise<boolean>;
    public submit<T>(obj?: {onSubmit?: (form: Form) => T|Promise<T>, onError?: (form: Form) => any}): Promise<T>;

    public onSubmit(event: any, obj?: {onSubmit?: (form: Form) => any, onError?: (form: Form) => any}): void;

    public onClear(event: any): void;

    public onReset(event: any): void;

    public onAdd(event: any, key?: string|null): void;

    public onDel(event: any, key?: string|null): void;

    public values(): {};

    public errors(): {};

    public labels(): {};

    public defaults(): {};

    public initials(): {};

    public init($fields?: {}): void;

    public update(fields: {}): void;

    public $(key: string): Field | any[] | undefined;

    public select(path: string, fields?: ObservableMap<Field>, isStrict?: boolean): Field | undefined;

    public container(path?: string|null): Field | undefined;

    public check(computed: string, deep?: boolean): any;

    public get(prop?: null|string|string[]): {};

    public set(prop: string, data: any, recursion?: boolean): void;
    public set(data: {}): void;

    public map<T>(callback: (field: Field, index: number, fields: Field[]) => T): T[];
    public map<T>(path: string, callback: (field: Field, index: number, fields: Field[]) => T): T[];

    public forEach(iteratee: (field: Field, index: number, depth: number) => any,
                   fields?: ObservableMap<Field>,
                   depth?: number): void;

    public add(path?: string|null): void;

    public del(path?: string|null): void;

    public makeField(obj: {
        key: string,
        path: string,
        state: State,
        data?: {},
        props?: {},
        update?: boolean,
    }): Field;
}

declare namespace Form {
    export interface ISeparatedProps {
        fields?: {}|string[];
        values?: {};
        labels?: {};
        defaults?: {};
        disabled?: {};
        related?: {};
        validate?: {};
        rules?: {};
        schema?: {};
    }
}
