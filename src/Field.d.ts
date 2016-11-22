import {ObservableMap} from "mobx";
import * as fieldHelpers from "./FieldHelpers";
import * as fieldInit from "./FieldInit";
import * as fieldParser from "./FieldParser";
import * as Form from "./Form";
import * as State from "./State";

export = Field;

declare class Field implements fieldHelpers.Interface, fieldInit.Interface, fieldParser.Interface {

    public readonly hasIncrementalNestedFields: boolean;

    public readonly hasNestedFields: boolean;
    public value?: any;
    public readonly label?: string;
    public readonly related?: any;
    public readonly disabled: boolean;
    public readonly "default"?: any;
    public readonly initial?: any;
    public readonly focus: boolean;
    public readonly touched: boolean;
    public readonly rules?: any;
    public readonly validate?: any;
    public readonly error: string|null;
    public readonly hasError: boolean;
    public readonly isValid: boolean;
    public readonly isDirty: boolean;
    public readonly isPristine: boolean;
    public readonly isDefault: boolean;
    public readonly isEmpty: boolean;

    protected fields: ObservableMap<Field>;
    protected incremental: boolean;

    protected form?: Form|null;
    protected state?: State|null;
    protected path?: string;
    protected key?: string;
    protected name?: string;

    protected $rules?: any;
    protected $validate?: any;
    protected $related?: any;

    protected $label?: string;
    protected $value?: any;
    protected $default?: any;
    protected $initial?: any;
    protected $disabled: boolean;
    protected $focus: boolean;
    protected $touched: boolean;
    protected errorSync: string | null;
    protected errorAsync: string | null;
    protected showError: boolean;
    protected validationErrorStack: string[];
    protected validationFunctionsData: any[];
    protected validationAsyncData: {};

    public constructor($key: string, $path: string, $field: any, props?: {}, update?: boolean, form?: Form);

    public setInvalid(message: string, async?: boolean): void;

    public setValidationAsyncData(obj?: {}): void;

    public resetValidation(deep?: boolean): void;

    public clear(deep?: boolean): void;

    public reset(deep?: boolean): void;

    public showErrors(showErrors?: boolean): void;

    public showAsyncErrors(): void;

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

    public forEach(iteratee: fieldHelpers.Iterator, fields?: ObservableMap<Field>, depth?: number): void;

    public add(path?: string|null): void;

    public del(path?: string|null): void;

    public extend(): void;

    public initNestedFields(field?: null|{}, update?: boolean): void;

    public setupField($key: string, $path: string, $field: any, props?: {}, update?: boolean): void;

    public parseInitialValue(unified?: any, separated?: any): any;

    public parseDefaultValue(unified?: any, separated?: any): any;

    public deepUpdate(fields: {}, path?: string): void;

    public deepSet(prop: string, data: {}, path?: string, recursion?: boolean): void;

    public deepGet(prop: string|string[], fields: ObservableMap<Field>): {};

    public deepMap(prop: string, fields: ObservableMap<Field>): {};

    public deepAction($action: string, fields: ObservableMap<Field>, recursion?: boolean): void;

    public deepCheck($: "some"|"every"|any, prop: string, fields: ObservableMap<Field>): boolean|any[];

    public initFields(initial: {}, update: boolean): void;

    public initField(key: string, path: string, data: null|{},
                     fields?: ObservableMap<Field>, update?: boolean): void;

    public parseProp<T>($val: {}, $prop: string): T[];

    public pathToFieldsTree(path: string, n?: number): {};

    public prepareFieldsData(initial: {}): {};

    public defineFieldsFromStruct(struct: any): {};

    public handleFieldsValuesFallback(fields: any, initial: any): {};

    public handleFieldsArrayOfStrings($fields: any): {};

    public handleFieldsArrayOfObjects($fields: any): {};

    public handleFieldsNested(fields: any, initial: any): {};

    public mergeSchemaDefaults(fields: {}): {};

    public hasIntKeys(): boolean;

    public parseIntKeys(): number[];

    public maxKey(): number;
}

declare namespace Field {
}
