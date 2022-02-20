import OptionsModel from "./OptionsModel";

export default interface OptionsInterface {
  options: OptionsModel;
  get: (key: string, field: any) => OptionsModel;
  set: (options: OptionsModel) => void;
}
