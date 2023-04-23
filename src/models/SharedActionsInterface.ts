export default interface SharedActionsInterface {
  validate(opt?: any, obj?: any): Promise<any>;
  submit(hooks: any, opt: { execOnSubmitHook: boolean, execValidationHooks: boolean, validate: boolean }): Promise<any>;
  check(prop: string, deep?: boolean): boolean;
  deepCheck(type: string, prop: string, fields: any): any;
  update(fields: any): void;
  deepUpdate(fields: any, path: string, recursion: boolean): void;
  get(prop?: any, strict?: boolean): any;
  deepGet(prop: any, fields: any): any;
  set(prop: any, data?: any): void;
  deepSet(prop: any, data: any, path: string, recursion: boolean): void;
  add(obj: any): any;
  del(path?: string): any;
}
