import { Form } from "../../../src";

const fields = [
  "products[]",
  "products[].name",
  "products[].price",
];

const values = {
  products: [
    { name: "Alpha", price: 10 },
    { name: "Bravo", price: 20 },
    { name: "Charlie", price: 30 },
    { name: "Delta", price: 40 },
  ],
};

export function createSortForm() {
  return new Form({ fields, values }, { name: "Sort-A" });
}
