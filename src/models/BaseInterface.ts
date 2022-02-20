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
}
