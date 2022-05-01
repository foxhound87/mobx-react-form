import { Form } from "../../../../src";
import FieldInterface from "../../../../src/models/FieldInterface";
import FormInterface from "../../../../src/models/FormInterface";

const fields = {
    user: {
        fields: {
            id: {},
            email: {},
        },
        hooks: {
            onChange(field: FieldInterface) {
                field.$('email').sync('user@email')
            }
        }
    }
}


const hooks = {
    onInit(form: FormInterface) {
        // form.$('user.id').sync(1)
        form.$('user').update({
            id: 1
        })
    },
}

export default new Form(
    { fields },
    { hooks, name: "Nested-V4" }
);