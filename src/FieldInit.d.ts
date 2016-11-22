import {ObservableMap} from "mobx";
import * as Field from "./Field";

export = fieldInit;

declare function fieldInit(instance: {}): fieldInit.Interface;

declare namespace fieldInit {
    export interface Interface {
        initFields(initial: {}, update: boolean): void;
        initField(key: string, path: string, data: null|{}, fields?: ObservableMap<Field>, update?: boolean): void;
    }
}
