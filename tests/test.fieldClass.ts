import { Field } from "../src";
import {
  $OVERRIDE,
  $SEPARATED,
  $UNIFIED,
  CustomField,
  OverrideCustomField,
  FieldPaths,
} from "./data/forms/forms.fieldClass";
import { expect } from "chai";

describe("FieldClass", () => {
  describe("when form has separate definition", () => {
    describe("when class is not specified", () => {
      it("the field as an instance of Field class", () => {
        expect($SEPARATED.$(FieldPaths.standardField)).to.be.an.instanceOf(
          Field,
        );
        expect(
          $SEPARATED.$(FieldPaths.nestedStandardField),
        ).to.be.an.instanceOf(Field);
      });
    });
    describe("when class is specified", () => {
      it("the field is an instance of the specified class", () => {
        expect($SEPARATED.$(FieldPaths.customField)).to.be.an.instanceOf(
          CustomField,
        );
        expect($SEPARATED.$(FieldPaths.nestedCustomField)).to.be.an.instanceOf(
          CustomField,
        );
      });
    });
  });

  describe("when form has unified definition", () => {
    describe("when class is not specified", () => {
      it("the field as an instance of Field class", () => {
        expect($UNIFIED.$(FieldPaths.standardField)).to.be.an.instanceOf(Field);
        expect($UNIFIED.$(FieldPaths.nestedStandardField)).to.be.an.instanceOf(
          Field,
        );
      });
    });
    describe("when class is specified", () => {
      it("the field is an instance of the specified class", () => {
        expect($UNIFIED.$(FieldPaths.customField)).to.be.an.instanceOf(
          CustomField,
        );
        expect($UNIFIED.$(FieldPaths.nestedCustomField)).to.be.an.instanceOf(
          CustomField,
        );
      });
    });
  });

  describe("when form has override of makeField", () => {
    it("adheres to the makeField logic", () => {
      expect($OVERRIDE.$(FieldPaths.standardField)).to.be.an.instanceOf(Field);
      expect($OVERRIDE.$(FieldPaths.nestedStandardField)).to.be.an.instanceOf(
        Field,
      );
      expect($OVERRIDE.$(FieldPaths.customField)).to.be.an.instanceOf(
        CustomField,
      );
      expect($OVERRIDE.$(FieldPaths.nestedCustomField)).to.be.an.instanceOf(
        OverrideCustomField,
      );
    });
  });
});
