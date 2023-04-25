import { expect } from "chai";
import { Form } from "../../../../src";

export default new Form(
    {
      fields: [
        "products[].name",
        "products[].qty",
        "products[].amount",
        "products[].total",
        "total"
      ],
      computed: {
				'products[].total': ({ field }) => {
					const qty = field.container()?.$('qty')?.value;
					const amount = field.container()?.$('amount')?.value;
					return qty * amount;
				},

        'total': ({ form }) =>
            form.$("products")?.reduce((acc, field) => acc + field.$("total").value, 0),

      },
      labels: {
        "products[].name": "Product Name",
        "products[].qty": "Quantity",
        "products[].amount": "Amount $"
      },
      placeholders: {
        "products[].name": "Insert Product Name"
      },
      types: {
        "products[].qty": "number",
        "products[].amount": "number",
        "products[].total": "number"
      },
    },
    {
      name: '$x',
      options: {
        strictSelect: false,
        autoParseNumbers: true,
      },
      hooks: {
        onInit(form) {
            form.$("products").add();
            form.$("products").add();
            form.$("products[0].qty").set(2);
            form.$("products[0].amount").set(5);
            form.$("products[1].qty").set(3);
            form.$("products[1].amount").set(5);

            describe("Check computed values", () => {
                it("form $x products[0].total value", () =>
                  expect(form.$('products[0].total').value).to.be.equal(10));

								it("form $x products[1].total value", () =>
                  expect(form.$('products[1].total').value).to.be.equal(15));

								it("form $x total value", () =>
                  expect(form.$('total').value).to.be.equal(25));
            });
        }
      }
    }
  );