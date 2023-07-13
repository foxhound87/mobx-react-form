
import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";
import { expect } from "chai";

const values = { pieces: [{ id: "2", blocks: [{ id: "1" }] }] };

const removeBlocks = { pieces: [{ id: "3", blocks: [] }] };

export default new Form(
    {
			fields: [
				"pieces[]",
				"pieces[].blocks[]",
				"pieces[].blocks[].id",
				"pieces[].id"
			],
        values,
    },
    {
			name: 'Fixes-Z',
			hooks: {
				onInit(form: FormInterface) {

					form.update(removeBlocks);

					describe("Nested udpate()", () =>
						it('blocks should be empty array', () =>
							expect(form.values()).to.be.deep.equal(removeBlocks)));
				}
      }
    }
  );