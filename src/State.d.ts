export = State;

declare class State {
    protected $struct: string[];
    protected initial: State.Substate;
    protected current: State.Substate;
    public struct(): string[];
    public struct(data: string[]): void;
    public get(type: 'initial'|'current', subtype: 'props' | 'fields'): {};
    public set(type: 'initial'|'current', subtype: 'props' | 'fields', state: {});
}

declare namespace State {
    export interface Substate {
        readonly props: {},
        readonly fields: {}
    }
}