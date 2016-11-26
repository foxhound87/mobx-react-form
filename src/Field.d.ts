import {ObservableMap} from "mobx";
import * as Form from "./Form";
import * as State from "./State";

export = Field;

declare class Field {
    public value?: any;
    public readonly label?: string;
    public readonly related?: any;
    public readonly disabled: boolean;
    public readonly "default"?: any;
    public readonly initial?: any;
    public readonly focus: boolean;
    public readonly touched: boolean;
    public readonly changed: boolean;
    public readonly rules?: any;
    public readonly validate?: any;
    public readonly error: string|null;
    public readonly hasError: boolean;
    public readonly isValid: boolean;
    public readonly isDirty: boolean;
    public readonly isPristine: boolean;
    public readonly isDefault: boolean;
    public readonly isEmpty: boolean;
    public readonly fields: ObservableMap<Field>;
    public readonly form?: Form|null;
    public readonly path?: string;
    public readonly key?: string;
    public readonly name?: string;

    public constructor(obj: {
        key: string,
        path: string,
        state: State,
        data?: {},
        props?: {},
        update?: boolean,
    });

    public setInvalid(message: string, async?: boolean): void;

    public resetValidation(deep?: boolean): void;

    public clear(deep?: boolean): void;

    public reset(deep?: boolean): void;

    public showErrors(showErrors?: boolean): void;

    public sync(e: any): void;

    public onChange(e: any): void;

    public onToggle(e: any): void;

    public onFocus(): void;

    public onBlur(): void;

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

    public update(fields: {}): void

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
}

declare namespace Field {
}
