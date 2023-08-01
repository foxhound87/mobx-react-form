import { Form } from "../../../../src";
import { FieldPropsEnum } from "../../../../src/models/FieldProps";
import { FormInterface } from "../../../../src/models/FormInterface";


const fields = [
    'test',
]

const hooks = {
    onInit(form: FormInterface) {
        form.$('test').set(FieldPropsEnum.disabled, true);
        form.$('test').set(FieldPropsEnum.deleted, true);
        form.$('test').set(FieldPropsEnum.type, 'number');
        form.$('test').set(FieldPropsEnum.initial, 'test');
        form.$('test').set(FieldPropsEnum.default, 'test');
        form.$('test').set(FieldPropsEnum.label, 'test');
        form.$('test').set(FieldPropsEnum.placeholder, 'test');
        form.$('test').set(FieldPropsEnum.related, ['test']);
    }
}

export default new Form({ fields }, { hooks });