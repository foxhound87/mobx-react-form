declare const events: events.Events;

export = events;

export namespace events {
    export type Key = 'clear' | 'reset' | 'update' | 'validate';

    export interface Running {
        clear: boolean;
        reset: boolean;
        update: boolean;
        validate: boolean;
    }

    export interface Events {
        getRunning(key?: Key|null): boolean|Running;
        setRunning(key: Key, flag: boolean, path?: string): void;
        path(key: Key): string | null;
        running(events: Key[]): boolean;
    }
}