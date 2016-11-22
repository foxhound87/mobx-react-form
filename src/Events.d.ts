export = Events;

declare const Events: Events.IEvents;

declare namespace Events {
    export type Key = "clear" | "reset" | "update" | "validate";

    export interface IRunning {
        clear: boolean;
        reset: boolean;
        update: boolean;
        validate: boolean;
    }

    export interface IEvents {
        getRunning(key?: Key|null): boolean|IRunning;
        setRunning(key: Key, flag: boolean, path?: string): void;
        path(key: Key): string | null;
        running(events: Key[]): boolean;
    }
}
