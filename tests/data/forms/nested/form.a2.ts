
import { Form } from "../../../../src";

const fields = [
    'user',
    'user.firstname',
    'user.lastname',
];

export default new Form({ fields }, { name: "Nested-A2", options: {
    fallbackValue: null,
} });
