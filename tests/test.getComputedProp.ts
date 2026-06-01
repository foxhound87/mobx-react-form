import { expect } from "chai";
import { runInAction } from "mobx";
import Form from "../src/Form";
import { FieldInterface } from "../src/models/FieldInterface";

describe("Field.getComputedProp — @ts-ignore coverage (line 770)", () => {
  /** Test 1: value getter calls getComputedProp when _value is not a function */
  it("should return the plain value via getComputedProp when _value is not a function", () => {
    const form = new Form({
      fields: {
        username: {
          label: "Username",
          value: "john_doe",
          type: "text",
        },
      },
    });

    const field: FieldInterface = form.$("username");

    // Preconditions to hit the @ts-ignore branch:
    expect(field.hasNestedFields).to.be.false;

    // This triggers getComputedProp(FieldPropsEnum.value) which does this[`$${key}`]
    // where key = "value" → this.$value = "john_doe"
    expect(field.value).to.equal("john_doe");
  });

  /** Test 2: initial getter calls getComputedProp when $initial is falsy */
  it("should return the initial value via getComputedProp", () => {
    const form = new Form({
      fields: {
        email: {
          label: "Email",
          value: "test@example.com",
          type: "email",
        },
      },
    });

    const field: FieldInterface = form.$("email");

    // $initial is not set explicitly, so it falls back to $value
    // getComputedProp accesses this.$initial
    expect(field.initial).to.equal("test@example.com");
  });

  /** Test 3: default getter calls getComputedProp when $default is falsy */
  it("should return the default value via getComputedProp", () => {
    const form = new Form({
      fields: {
        score: {
          label: "Score",
          value: 100,
          type: "number",
        },
      },
    });

    const field: FieldInterface = form.$("score");

    // $default is not set explicitly, so it falls back to $initial/$value
    expect(field.default).to.equal(100);
  });

  /** Test 4: getComputedProp handles array values (the [].slice.call branch) */
  it("should return a shallow copy when internal value is an array", () => {
    const form = new Form({
      fields: {
        tags: {
          label: "Tags",
          value: ["a", "b", "c"],
          type: "text",
        },
      },
    });

    const field: FieldInterface = form.$("tags");
    const result = field.value;

    expect(result).to.deep.equal(["a", "b", "c"]);
    // Should be a different reference (shallow copy via [].slice.call)
    expect(result).to.not.equal(field.value); // Each time it creates a new copy via toJS
  });

  /** Test 5: getComputedProp handles the incremental path (skips @ts-ignore) */
  it("should use this.get(key) when incremental is true (skips @ts-ignore)", () => {
    const form = new Form({
      fields: {
        items: {
          fields: ["items", "items[].name"],
        },
      },
    });

    const field: FieldInterface = form.$("items");
    // hasNestedFields is true → skips @ts-ignore branch
    expect(field.hasNestedFields).to.be.true;
    // Accessing value should not throw
    expect(() => field.value).to.not.throw();
  });

  /** Test 6: getComputedProp handles the hasNestedFields path (skips @ts-ignore) */
  it("should use untracked this.get(key) when hasNestedFields is true (skips @ts-ignore)", () => {
    const form = new Form({
      fields: {
        address: {
          fields: ["address.street", "address.city"],
        },
      },
    });

    const field: FieldInterface = form.$("address");
    expect(field.hasNestedFields).to.be.true;
    expect(() => field.initial).to.not.throw();
    expect(() => field.default).to.not.throw();
  });

  /** Test 7: getComputedProp on a field defined with a simple value (not config object) */
  it("should work when field is defined as a plain value string", () => {
    const form = new Form({
      fields: {
        simpleField: "plain_value",
      },
    });

    const field: FieldInterface = form.$("simpleField");
    expect(field.hasNestedFields).to.be.false;
    expect(field.value).to.equal("plain_value");
    expect(field.initial).to.equal("plain_value");
  });

  /** Test 8: getComputedProp on a field defined with a plain number */
  it("should work when field is defined as a plain number", () => {
    const form = new Form({
      fields: {
        count: 42,
      },
    });

    const field: FieldInterface = form.$("count");
    expect(field.value).to.equal(42);
    expect(field.initial).to.equal(42);
    expect(field.default).to.equal(42);
  });

  /** Test 9: getComputedProp returns plain array from observable array value (exercises isObservableArray branch) */
  it("should return a plain array from observable array value via getComputedProp", () => {
    const form = new Form({
      fields: {
        list: {
          label: "List",
          value: [1, 2, 3],
          type: "text",
        },
      },
    });

    const field: any = form.$("list");

    // getComputedProp hits isObservableArray(val) path → [].slice.call(val)
    const result = field.value;
    expect(result).to.deep.equal([1, 2, 3]);
    // result should be a plain array, not an observable
    expect(Array.isArray(result)).to.be.true;
  });

  /** Test 10: getComputedProp with observable array replacement */
  it("should handle observable array replacement in getComputedProp", () => {
    const form = new Form({
      fields: {
        list: {
          label: "List",
          value: [1, 2, 3],
          type: "text",
        },
      },
    });

    const field: FieldInterface = form.$("list");

    // Replace the entire value
    field.value = [4, 5, 6];
    expect(field.value).to.deep.equal([4, 5, 6]);
  });

  /** Test 10: Field with initial explicitly set to a different value */
  it("should return the correct initial when explicit $initial differs from value", () => {
    const form = new Form({
      fields: {
        status: {
          label: "Status",
          initial: "pending",
          value: "active",
          type: "text",
        },
      },
    });

    const field: FieldInterface = form.$("status");
    expect(field.value).to.equal("active");
    expect(field.initial).to.equal("pending");
  });

  /** Test 11: Boolean value field */
  it("should handle boolean values through getComputedProp", () => {
    const form = new Form({
      fields: {
        active: {
          label: "Active",
          value: true,
          type: "checkbox",
        },
      },
    });

    const field: FieldInterface = form.$("active");
    expect(field.value).to.be.true;

    field.value = false;
    expect(field.value).to.be.false;
  });

  /** Test 12: Null value field */
  it("should handle null values through getComputedProp", () => {
    const form = new Form({
      fields: {
        nullableField: {
          label: "Nullable",
          value: null,
          nullable: true,
          type: "text",
        },
      },
    });

    const field: FieldInterface = form.$("nullableField");
    expect(field.value).to.be.null;
  });
});
