export = fieldParser;

declare function fieldParser(instance: {}): fieldParser.Interface;

declare namespace fieldParser {
  export interface Interface {
    parseProp<T>($val: {}, $prop: string): T[];
    pathToFieldsTree(path: string, n?: number): {};
    prepareFieldsData(initial: {}): {};
    defineFieldsFromStruct(struct: any): {};
    handleFieldsValuesFallback(fields: any, initial: any): {};
    handleFieldsArrayOfStrings($fields: any): {};
    handleFieldsArrayOfObjects($fields: any): {};
    handleFieldsNested(fields: any, initial: any): {};
    mergeSchemaDefaults(fields: {}): {};
  }
}