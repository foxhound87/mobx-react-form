export default interface SharedEventsInterface {
  MOBXEvent(config: any): void;
  dispose(config: any): void;
  disposeAll(): void;
  disposeSingle(config: any): void;
}
