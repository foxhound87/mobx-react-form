import { ValidationPlugins } from "./../../../../src/models/ValidatorInterface";
import ajv from "ajv";
import { Form } from "../../../../src";
import svkExtend from "../../extension/svk";
import svk from "../../../../src/validators/SVK";

const fields = {
  state: {
    label: "State",
    value: "USA",
    fields: {
      city: {
        label: "City",
        value: "New York",
        fields: {
          places: {
            label: "NY Places",
            fields: {
              centralPark: {
                label: "Central Park",
                value: true,
              },
              statueOfLiberty: {
                label: "Statue of Liberty",
                value: false,
              },
              empireStateBuilding: {
                label: "Empire State Building",
                value: true,
              },
              brooklynBridge: {
                label: "Brooklyn Bridge",
                value: true,
              },
            },
          },
        },
      },
    },
  },
};

const schema = {
  type: "object",
  properties: {
    state: {
      type: "integer",
    },
    "state.city": {
      type: "integer",
    },
  },
};

const plugins: ValidationPlugins = {
  svk: svk({
    package: ajv,
    extend: svkExtend,
    schema,
  }),
};

export default new Form({ fields }, { plugins, name: "Nested-E" });
