import * as Field from './Field';
import {ObservableMap} from 'mobx';
import * as fieldHelpers from './FieldHelpers';
import * as fieldInit from './FieldInit';
import * as fieldParser from './FieldParser';
import * as Options from './Options';
import * as State from './State';
import * as Validator from './Validator';

export = Form;

declare class Form implements fieldHelpers.Interface, fieldInit.Interface, fieldParser.Interface {

    public name: string|null;
    protected state: State;
    protected validator: Validator;
    protected $options: Options;
    protected fields: ObservableMap<Field>;
    public readonly hasError: boolean;
    public readonly isValid: boolean;
    public readonly isDirty: boolean;
    public readonly isPristine: boolean;
    public readonly isDefault: boolean;
    public readonly isEmpty: boolean;
    public readonly error: string|null;

    public constructor(initial?: {}, name?: string|null);

    protected extend(): void;

    protected initOptions(initial?: {}): void;

    protected initValidator(initial?: {}): void;

    protected initPropsState(initial?: {}): void;

    public options(options: Options.Props): Options.Props;
    public options(option: string): any;

    public on(event: string, callback: (obj: {form: Form, path: string}) => any): void;

    protected observeFields(fields?: ObservableMap<Field>): void;

    protected observeFieldsDeep(fields: ObservableMap<Field>): void;

    protected validateOnInit(): void;

    public validate(opt?: {}, obj?: {}): Promise<boolean>;

    public invalidate(message?: string|null): void;

    public clear(): void;

    public reset(): void;

    public submit(obj?: {onSubmit?: (form: Form)=>any, onError?: (form: Form)=>any}): Promise<boolean>;
    public submit<T>(obj?: {onSubmit?: (form: Form)=>T|Promise<T>, onError?: (form: Form)=>any}): Promise<T>;

    public onSubmit(event: any, obj?: {onSubmit?: (form: Form)=>any, onError?: (form: Form)=>any}): void;

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