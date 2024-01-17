import { expect } from "chai";
import validatorjs from "validatorjs";
import { Form } from "../../../../src";
import { FormInterface } from "../../../../src/models/FormInterface";
import { ValidationPlugins } from "../../../../src/models/ValidatorInterface";
import vjf from "../../../../src/validators/VJF";
import dvr from "../../../../src/validators/DVR";

const plugins: ValidationPlugins = {
    vjf: vjf(),
    dvr: dvr({ package: validatorjs })
};

const weekValidator = ({ field, form }) => {
    // form.invalidate(); // <--- need to work without calling invalidate()
    return [false, "Error ..."];
};

const fields = [
    {
      name: "week",
      label: "week",
      validators: [weekValidator],
      fields: [
        {
          name: "MONDAY",
          label: "MONDAY",
          disabled: true,
          fields: [
            {
              name: "start",
              label: "start",
            //   validators: [timeValidator]
            },
            {
              name: "end",
              label: "end",
            //   validators: [timeValidator]
            }
          ],
        },
        {
          name: "TUESDAY",
          label: "TUESDAY",
          disabled: true,
          fields: [
            {
              name: "start",
              label: "start"
            },
            {
              name: "end",
              label: "end"
            }
          ],
        }
        // ...other days
      ]
    }
  ];

  const hooks = {
    onInit(form) {
        form.submit();
    },
  };

const form = new Form({ fields }, {
    plugins,
    hooks,
    name: '$519',
    options: {
        validateOnInit: true,
        showErrorsOnInit: true,
        retrieveOnlyEnabledFieldsValues: true,
        validateDisabledFields: false
    }});

form.set('hooks', {
  onSuccess(form: FormInterface) {},
  onError(form: FormInterface) {}
})

export default form;