import {ObservableMap} from "mobx";
import * as Field from "./Field";

export = fieldHelpers;

declare function fieldHelpers(instance: {}): fieldHelpers.Interface;

declare namespace fieldHelpers {
    export interface Iterator {
        (field: Field, index: number, depth: number): any;
    }

    export interface Interface {
        values(): {};
        errors(): {};
        labels(): {};
        defaults(): {};
        initials(): {};

        init($fields?: {}): void;
        update(fields: {}): void;
        deepUpdate(fields: {}, path?: string): void;

        $(key: string): Field | any[] | undefined;
        select(path: string, fields?: ObservableMap<Field>, isStrict?: boolean): Field | undefined;
        container(path?: string|null): Field | undefined;

        check(computed: string, deep?: boolean): any;
        get(prop?: null|string|string[]): {};
        set(prop: string, data: any, recursion?: boolean): void;
        set(data: {}): void;

        deepSet(prop: string, data: {}, path?: string, recursion?: boolean): void;
        deepGet(prop: string|string[], fields: ObservableMap<Field>): {};
        deepMap(prop: string, fields: ObservableMap<Field>): {};
        deepAction($action: string, fields: ObservableMap<Field>, recursion?: boolean): void;
        deepCheck($: "some"|"every"|any, prop: string, fields: ObservableMap<Field>): boolean|any[];

        map<T>(callback: (field: Field, index: number, fields: Field[]) => T): T[];
        map<T>(path: string, callback: (field: Field, index: number, fields: Field[]) => T): T[];
        forEach(iteratee: Iterator, fields?: ObservableMap<Field>, depth?: number): void;

        add(path?: string|null): void;
        del(path?: string|null): void;
    }
}
