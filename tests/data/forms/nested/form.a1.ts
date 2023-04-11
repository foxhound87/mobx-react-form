
import { Form } from "../../../../src";

const fields = [
    'user',
    'user.firstname',
    'user.lastname',
];

export default new Form({ fields }, { name: "Nested-A1", options: {
    retrieveNullifiedEmptyStrings: true,
} });
