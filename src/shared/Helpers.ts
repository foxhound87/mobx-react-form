import SharedHelpersInterface from "src/models/SharedHelpersInterface";

/**
  Field Helpers
*/
export const SharedHelper: SharedHelpersInterface = {
  /**
    Fields Selector (alias of select)
   */
  $(key: string) {
    return (this as any).select(key);
  },

  /**
    Fields Values (recursive with Nested Fields)
   */
  values() {
    return (this as any).get("value");
  },

  /**
    Fields Errors (recursive with Nested Fields)
   */
  errors() {
    return (this as any).get("error");
  },

  /**
    Fields Labels (recursive with Nested Fields)
   */
  labels() {
    return (this as any).get("label");
  },

  /**
    Fields Placeholders (recursive with Nested Fields)
   */
  placeholders() {
    return (this as any).get("placeholder");
  },

  /**
    Fields Default Values (recursive with Nested Fields)
   */
  defaults() {
    return (this as any).get("default");
  },

  /**
    Fields Initial Values (recursive with Nested Fields)
   */
  initials() {
    return (this as any).get("initial");
  },

  /**
    Fields Types (recursive with Nested Fields)
   */
  types() {
    return (this as any).get("type");
  },
};
