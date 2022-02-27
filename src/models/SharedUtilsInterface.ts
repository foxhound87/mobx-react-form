export default interface SharedUtilsInferface {
  select: (path: string, fields?: any, isStrict?: boolean) => any;
  container: (path?: string) => any;
  has: (path: string) => boolean;
  map: (cb: any) => any;
  each: (iteratee: any, fields?: any, depth?: number) => any;
}
