import { Form } from "../../../../src";
import FormInterface from "../../../../src/models/FormInterface";

const fields = [
    'user.id',
    'user.name',
    'test.email',
]

const hooks = {
    onInit(form: FormInterface) {
        form.$('user.id').set('value', 'user-id');
        form.$('user.name').set('value', 'user-init');
    },
    onChange(form: FormInterface) {
        form.$('user.name').set('value', 'user-changed');
        form.$('test.email').sync('test@email');
    }
}

export default new Form(
    { fields },
    { hooks, name: "Nested-V2" }
);