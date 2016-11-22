import {ObservableMap} from "mobx";
import * as Field from "./Field";
import * as fieldHelpers from "./FieldHelpers";
import * as fieldInit from "./FieldInit";
import * as fieldParser from "./FieldParser";
import * as Options from "./Options";
import * as State from "./State";
import * as Validator from "./Validator";

export = Form;

declare class Form implements fieldHelpers.Interface, fieldInit.Interface, fieldParser.Interface {

    public name: string|null;
    public readonly hasError: boolean;
    public readonly isValid: boolean;
    public readonly isDirty: boolean;
    public readonly isPristine: boolean;
    public readonly isDefault: boolean;
    public readonly isEmpty: boolean;
    public readonly error: string|null;

    protected state: State;
    protected validator: Validator;
    protected $options: Options;
    protected fields: ObservableMap<Field>;

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

    public forEach(iteratee: fieldHelpers.Iterator, fields?: ObservableMap<Field>, depth?: number): void;

    public add(path?: string|null): void;

    public del(path?: string|null): void;

    public extend(): void;

    public initOptions(initial?: {}): void;

    public initValidator(initial?: {}): void;

    public initPropsState(initial?: {}): void;

    public observeFields(fields?: ObservableMap<Field>): void;

    public observeFieldsDeep(fields: ObservableMap<Field>): void;

    public validateOnInit(): void;

    public deepUpdate(fields: {}, path?: string): void;

    public deepSet(prop: string, data: {}, path?: string, recursion?: boolean): void;

    public deepGet(prop: string|string[], fields: ObservableMap<Field>): {};

    public deepMap(prop: string, fields: ObservableMap<Field>): {};

    public deepAction($action: string, fields: ObservableMap<Field>, recursion?: boolean): void;

    public deepCheck($: "some"|"every"|any, prop: string, fields: ObservableMap<Field>): boolean|any[];

    public initFields(initial: {}, update: boolean): void;

    public initField(key: string, path: string, data: null|{}, fields?: ObservableMap<Field>, update?: boolean): void;

    public parseProp<T>($val: {}, $prop: string): T[];

    public pathToFieldsTree(path: string, n?: number): {};

    public prepareFieldsData(initial: {}): {};

    public defineFieldsFromStruct(struct: any): {};

    public handleFieldsValuesFallback(fields: any, initial: any): {};

    public handleFieldsArrayOfStrings($fields: any): {};

    public handleFieldsArrayOfObjects($fields: any): {};

    public handleFieldsNested(fields: any, initial: any): {};

    public mergeSchemaDefaults(fields: {}): {};
}

declare namespace Form {
}
