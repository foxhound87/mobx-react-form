import OptionsModel from "./OptionsModel";

export default interface OptionsInterface {
  options: OptionsModel;
  get: (key: string, instance?: any) => any;
  set: (options: OptionsModel) => void;
}
