export = State;

declare class State {
    protected $struct: State.Struct;
    protected initial: State.Substate;
    protected current: State.Substate;
    public struct(): State.Struct;
    public struct(data: State.Struct): void;
    public get(type: 'initial'|'current', subtype: 'props' | 'fields'): {};
    public set(type: 'initial'|'current', subtype: 'props' | 'fields', state: {});
}

declare namespace State {
    export type Struct = string[];
    export interface Substate {
        readonly props: {},
        readonly fields: {}
    }
}