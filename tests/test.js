import $forms from './data';
import computed from './computed';
import promises from './promises';

computed.isValid($forms);
computed.hasError($forms);
computed.isDirty($forms);
computed.isEmpty($forms);
computed.isPristine($forms);
computed.isPristine($forms);

promises.validate($forms);
