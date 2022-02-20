import Form from "./Form";
import Field from "./Field";

/* shared prototype methods */
import { SharedHelper } from "./shared/Helpers";
import { SharedUtils } from "./shared/Utils";
import fieldEvents from "./shared/Events";

/**
  Extend Classes with Prototype
  - - - - - - - - - - - - - - - - - -
  Cannot use Object.assign as @action
  methods on mixins are non-enumerable
*/
const extend = ($class: any, $obj: object[]) =>
  $obj.forEach((mixin: any) =>
    Object.getOwnPropertyNames(mixin).forEach(
      (name: string) => ($class.prototype[name] = mixin[name])
    )
  );

const shared = [SharedHelper, SharedUtils, fieldEvents];

extend(Form, shared);
extend(Field, shared);

export default Form;
export { Form, Field };
