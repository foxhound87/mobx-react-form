import { Form, Field } from "../../src";
import { FieldConstructor } from "../../src/models/FieldInterface";

export enum FieldPaths {
  standardField = "standardField",
  nestedCustomField = "standardField.nestedCustomField",
  customField = "customField",
  nestedStandardField = "customField.nestedStandardField",
}

export class CustomField extends Field {}

export const $SEPARATED = new Form({
  fields: Object.values(FieldPaths),
  classes: {
    [FieldPaths.customField]: CustomField,
    [FieldPaths.nestedCustomField]: CustomField,
  },
});

export const $UNIFIED = new Form({
  fields: [
    {
      name: "standardField",
      fields: [
        {
          name: "nestedCustomField",
          class: CustomField,
        },
      ],
    },
    {
      name: "customField",
      class: CustomField,
      fields: [
        {
          name: "nestedStandardField",
        },
      ],
    },
  ],
});

export class OverrideCustomField extends Field {}

export class OverrideForm extends Form {
  setup() {
    return {
      fields: Object.values(FieldPaths),
      classes: {
        [FieldPaths.customField]: CustomField,
      },
    };
  }

  makeField(data: FieldConstructor, FieldClass: typeof Field = Field) {
    switch (data.path) {
      case FieldPaths.nestedCustomField: {
        return new OverrideCustomField(data);
      }
      default: {
        return super.makeField(data, FieldClass);
      }
    }
  }
}

export const $OVERRIDE = new OverrideForm();
