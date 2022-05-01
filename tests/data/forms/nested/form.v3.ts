import { Form } from "../../../../src";
import FieldInterface from "../../../../src/models/FieldInterface";
import FormInterface from "../../../../src/models/FormInterface";

const fields = [
    'account[].id',
    'user[].name',
    'test[].prop',
    'final'
];

const hooks = {
    account: {
        onChange(field: FieldInterface) {
            // acccount field
            field.select(0).$('id').set('account-id');
        }
    },
    test: {
        onChange(field: FieldInterface) {
            // test field
            field.state.form.$('final').set('final-value')
        }
    }
}

const formHooks = {
    onInit(form: FormInterface) {
        form.$('account').add();
        form.$('user').add();
        form.$('test').add();
        form.$('test').del();
    },
    onChange(form: FormInterface) {
        form.$('user[0].name').set('value', 'user-changed');
    }
}

export default new Form(
    { fields, hooks },
    { hooks: formHooks, name: "Nested-V3" }
);