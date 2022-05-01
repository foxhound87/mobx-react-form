export default interface SharedHelpersInterface {
  $(key: string|number): any;
  values(): any;
  errors(): any;
  labels(): any;
  placeholders(): any;
  defaults(): any;
  initials(): any;
  types(): any;
}
