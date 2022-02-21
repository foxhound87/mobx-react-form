export default interface BaseInterface {
  $submitted: number;
  $submitting: boolean;
  $validated: number;
  $validating: boolean;
  submitted: number;
  submitting: boolean;
  validated: number;
  validating: boolean;
  hasIncrementalKeys: boolean;
  hasNestedFields: boolean;
  size: number;
  execHook(name: string, fallback: any): any;
  execHandler(name: string, args: any, fallback: any): any;
  intercept(opt: any): any;
  observe(opt: any): any;
  onClear(args: any): any;
  onReset(args: any): any;
  onSubmit(args: any): any;
  onAdd(args: any): any;
  onDel(args: any): any;

  // shared initializer
  initFields?(initial: any, update: boolean): void;
  initField?(key: string, path: string, data: any, update: boolean): any;

  // shared utils
  select?: (path: string, fields?: any, isStrict?: boolean) => any;
  container?: (path: string) => any;
  has?: (path: string) => boolean;
  map?: (cb: any) => any;
  each?: (iteratee: any, fields?: any, depth?: number) => any;

  // shared actions
  validate?(opt: any, obj: any): void;
  submit?(options: any): Promise<any>;
  check?(prop: string, deep: boolean): boolean;
  deepCheck?(type: string, prop: string, fields: any): any;
  update?(fields: any): void;
  deepUpdate?(fields: any, path: string, recursion: boolean): void;
  get?(prop: any, strict: boolean): any;
  deepGet?(prop: any, fields: any): any;
  set?(prop: any, data: any): void;
  deepSet?(prop: any, data: any, path: string, recursion: boolean): void;
  add?(obj: any): any;

  // shared events
  MOBXEvent?(config: any): void;
  dispose?(config: any): void;
  disposeAll?(): void;
  disposeSingle?(config: any): void;

  // shared helpers
  $?(key: string): any;
  values?(): any;
  errors?(): any;
  labels?(): any;
  placeholders?(): any;
  defaults?(): any;
  initials?(): any;
  types?(): any;
}
