import { expect } from "chai";
import { createSortForm } from "../fixtures/methods/form.sort";

describe("Form fields.move()", () => {
  let form: any;

  beforeEach(() => {
    form = createSortForm();
  });

  describe("basic moves", () => {
    it("has 4 products initially", () => {
      expect(form.$("products").fields.size).to.equal(4);
    });

    it("moves first product to last position", () => {
      const products = form.$("products");
      products.fields.move(0, 3);
      const names = products.map((f: any) => f.$("name").value);
      expect(names).to.deep.equal(["Bravo", "Charlie", "Delta", "Alpha"]);
    });

    it("moves last product to first position", () => {
      const products = form.$("products");
      products.fields.move(3, 0);
      const names = products.map((f: any) => f.$("name").value);
      expect(names).to.deep.equal(["Delta", "Alpha", "Bravo", "Charlie"]);
    });

    it("moves middle product forward", () => {
      const products = form.$("products");
      products.fields.move(1, 3);
      const names = products.map((f: any) => f.$("name").value);
      expect(names).to.deep.equal(["Alpha", "Charlie", "Delta", "Bravo"]);
    });

    it("moves middle product backward", () => {
      const products = form.$("products");
      products.fields.move(2, 0);
      const names = products.map((f: any) => f.$("name").value);
      expect(names).to.deep.equal(["Charlie", "Alpha", "Bravo", "Delta"]);
    });
  });

  describe("guard clauses", () => {
    it("does nothing when fromIndex equals toIndex", () => {
      const products = form.$("products");
      const before = products.map((f: any) => f.$("name").value);
      products.fields.move(1, 1);
      const after = products.map((f: any) => f.$("name").value);
      expect(after).to.deep.equal(before);
    });

    it("does nothing when fromIndex is out of bounds", () => {
      const products = form.$("products");
      const before = products.map((f: any) => f.$("name").value);
      products.fields.move(-1, 2);
      products.fields.move(10, 2);
      const after = products.map((f: any) => f.$("name").value);
      expect(after).to.deep.equal(before);
    });

    it("does nothing when toIndex is out of bounds", () => {
      const products = form.$("products");
      const before = products.map((f: any) => f.$("name").value);
      products.fields.move(2, -1);
      products.fields.move(2, 10);
      const after = products.map((f: any) => f.$("name").value);
      expect(after).to.deep.equal(before);
    });
  });

  describe("chained moves", () => {
    it("supports multiple moves in sequence", () => {
      const products = form.$("products");
      products.fields.move(3, 0);
      products.fields.move(2, 3);
      products.fields.move(1, 2);
      const names = products.map((f: any) => f.$("name").value);
      expect(names).to.deep.equal(["Delta", "Charlie", "Alpha", "Bravo"]);
    });
  });
});
