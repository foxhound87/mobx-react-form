import * as fieldHelpers from './FieldHelpers';
import * as fieldInit from './FieldInit';
import * as fieldParser from './FieldParser';
import {ObservableMap} from 'mobx';
import * as Form from './Form';
import * as State  from './State';

export = Field;

declare class Field implements fieldHelpers.Interface, fieldInit.Interface, fieldParser.Interface {
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

    protected extend(): void;

    protected initNestedFields(field?: null|{}, update?: boolean);

    protected setupField($key: string, $path: string, $field: any, props?: {}, update?: boolean);

    protected parseInitialValue(unified?: any, separated?: any): any;

    protected parseDefaultValue(unified?: any, separated?: any): any;

    protected hasIntKeys(): boolean;

    protected parseIntKeys(): number[];

    protected maxKey(): number;

    public setInvalid(message: string, async?: boolean): void;

    public setValidationAsyncData(obj?: {}): void;

    public resetValidation(deep?: boolean): void;

    public clear(deep?: boolean): void;

    public reset(deep?: boolean): void;

    public showErrors(showErrors?: boolean): void;

    public showAsyncErrors(): void;

    public readonly hasIncrementalNestedFields: boolean;
    public readonly hasNestedFields: boolean;
    public value?: any;
    public readonly label?: string;
    public readonly related?: any;
    public readonly disabled: boolean;
    public readonly 'default'?: any;
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

    public sync(e: any): void;

    public onChange(e: any): void;

    public onToggle(e: any): void;

    public onFocus(): void;

    public onBlur(): void;

    public onClear(event: any);

    public onReset(event: any);

    public onAdd(event: any, key?: string|null);

    public onDel(event: any, key?: string|null);

    ////////////////////////////////////////////////////////////////////////////
    // FieldHelpers interface

    public values(): {};

    public errors(): {};

    public labels(): {};

    public defaults(): {};

    public initials(): {};

    public init($fields?: {}): void;

    public update(fields: {}): void

    protected deepUpdate(fields: {}, path?: string): void;

    public $(key: string): Field | any[] | undefined;

    public select(path: string, fields?: ObservableMap<Field>, isStrict?: boolean): Field | undefined;

    public container(path?: string|null): Field | undefined;

    public check(computed: string, deep?: boolean): any;

    public get(prop?: null|string|string[]): {};

    public set(prop: string, data: any, recursion?: boolean): void;
    public set(data: {}): void;

    protected deepSet(prop: string, data: {}, path?: string, recursion?: boolean): void;

    protected deepGet(prop: string|string[], fields: ObservableMap<Field>): {};

    protected deepMap(prop: string, fields: ObservableMap<Field>): {};

    protected deepAction($action: string, fields: ObservableMap<Field>, recursion?: boolean): void;

    protected deepCheck($: 'some'|'every'|any, prop: string, fields: ObservableMap<Field>): boolean|any[];

    public map<T>(callback: (field: Field, index: number, fields: Field[]) => T): T[];
    public map<T>(path: string, callback: (field: Field, index: number, fields: Field[]) => T): T[];

    public forEach(iteratee: fieldHelpers.Iterator, fields?: ObservableMap<Field>, depth?: number): void;

    public add(path?: string|null): void;

    public del(path?: string|null): void;

    ////////////////////////////////////////////////////////////////////////////
    // FieldInit interface

    protected initFields(initial: {}, update: boolean): void;

    protected initField(key: string, path: string, data: null|{}, fields?: ObservableMap<Field>, update?: boolean): void;

    ////////////////////////////////////////////////////////////////////////////
    // FieldParser interface

    protected parseProp<T>($val: {}, $prop: string): T[];

    protected pathToFieldsTree(path: string, n?: number): {};

    protected prepareFieldsData(initial: {}): {};

    protected defineFieldsFromStruct(struct: any): {};

    protected handleFieldsValuesFallback(fields: any, initial: any): {};

    protected handleFieldsArrayOfStrings($fields: any): {};

    protected handleFieldsArrayOfObjects($fields: any): {};

    protected handleFieldsNested(fields: any, initial: any): {};

    protected mergeSchemaDefaults(fields: {}): {};
}