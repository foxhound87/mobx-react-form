export default interface SharedInitializerInterface {
  initFields(initial: any, update: boolean): void;
  initField(key: string, path: string, data: any, update: boolean): any;
}
