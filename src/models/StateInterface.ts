import BindingsInterface from "./BindingsInterface";
import OptionsInterface from "./OptionsInterface";

export enum RuntimeMode {
  mixed = "mixed",
  unified = "unified",
  separated = "separated",
}

export default interface StateInterface {
  mode: RuntimeMode;
  strict: boolean;
  form: any;
  options: OptionsInterface;
  bindings: BindingsInterface;

  $struct: string[];
  $extra: any;

  disposers: {
    interceptor: any;
    observer: any;
  };

  initial: {
    props: any;
    fields: any;
  };

  current: {
    props: any;
    fields: any;
  };

  initProps(initial: any): void;
  struct(data?: string[]): string[];
  get(type: any, subtype: any): any;
  set(type: string, subtype: string, state: any): void;
  extra(data?: any): any | null;
  observeOptions(): void;
}
