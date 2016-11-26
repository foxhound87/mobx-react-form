import * as Form from "./Form";
import * as Options from "./Options";

export = State;

declare class State {
    protected $struct: State.IStruct;
    protected initial: State.ISubstate;
    protected current: State.ISubstate;
    protected form: Form;
    protected options: Options;

    public struct(): State.IStruct;
    public struct(data: State.IStruct): void;

    public get(type: "initial"|"current", subtype: "props" | "fields"): {};

    public set(type: "initial"|"current", subtype: "props" | "fields", state: {}): void;
}

declare namespace State {
    export type IStruct = string[];

    export interface ISubstate {
        readonly props: {};
        readonly fields: {};
    }
}
