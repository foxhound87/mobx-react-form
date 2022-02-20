import { FieldPropsEnum } from "./FieldProps";

export default interface BindingsInterface {
  templates: {
    [index: string]: {
      [key: string]: ({ field, props, keys }: any) => any;
    };
  };
  rewriters: {
    [index: string]: {
      [key: string]: FieldPropsEnum;
    };
  };
}
