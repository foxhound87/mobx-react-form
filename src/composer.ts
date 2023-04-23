import { FieldPropsEnum } from "./models/FieldProps";
import FormInterface from "./models/FormInterface";

export const composer = (forms: { [key in string]: FormInterface }) => {

    const instances = (): { [key in string]: FormInterface } => forms;

    const select = (key: string): FormInterface => forms[key];

    const check = (prop: string): any => Object
        .entries(forms)
        .reduce((acc: object, entry: any) =>
            Object.assign(acc, {
                [entry[0]]: (entry[1] as FormInterface).check(prop)
            }), {});

    const get = (prop: string): any => Object
        .entries(forms)
        .reduce((acc: object, entry: any) =>
            Object.assign(acc, {
                [entry[0]]: (entry[1] as FormInterface).get(prop)
            }), {});

    const valid = () => Object.values(check(FieldPropsEnum.isValid))
       .every(((val: boolean) => val === true));

    const error = () => Object.values(check(FieldPropsEnum.hasError))
       .every(((val: boolean) => val === true));

    const clear = ({ deep = true, execHook = false }
        : { deep?: boolean, execHook?: boolean } = {
            deep: true, execHook: false,
        }): void[] => Object.values(forms).map((form: FormInterface) => form.clear(deep, execHook));

    const reset = ({ deep = true, execHook = false }
        : { deep?: boolean, execHook?: boolean } = {
            deep: true, execHook: false,
        }): void[] => Object.values(forms).map((form: FormInterface) => form.reset(deep, execHook));

    const validate = ({ showErrors = true }
        : { showErrors?: boolean } = {
            showErrors: true,
        }): Promise<any> =>
            Promise.all(Object.values(forms)
                .map((form: FormInterface) => form.validate({ showErrors })))
                .then(() => ({
                    get, check, select, instances, clear, reset,
                    valid: valid(),
                    error: error(),
                    errors: get('error'),
                    values: get('value'),
                }));

    const submit = ({ validate = true, execOnSubmitHook = false, execValidationHooks = false }
        : { validate?: boolean, execOnSubmitHook?: boolean, execValidationHooks?: boolean  } = {
            validate: true, execOnSubmitHook: false, execValidationHooks: false,
        }): Promise<any> =>
            Promise.all(Object.values(forms)
                .map((form: FormInterface) => form.submit({},
                    { execOnSubmitHook, execValidationHooks , validate }
                )))
                .then(() => ({
                    get, check, select, instances, clear, reset,
                    valid: valid(),
                    error: error(),
                    errors: get('error'),
                    values: get('value'),
                }));

    return {
        instances,
        select,
        check,
        get,
        validate,
        submit,
        clear,
        reset,
    }
}