import Bindings from "../Bindings";
import { FieldPropsEnum } from "./FieldProps";

import { FieldPropsType } from "./FieldProps";

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

  load: (
    field: any,
    name: string,
    props: FieldPropsType
  ) => FieldPropsType;

  register: (bindings: FieldPropsType) => Bindings;
}
