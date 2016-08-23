import React from 'react';
import { observer } from 'mobx-react';

import FormRegister from './FormRegister';
import FormCompany from './FormCompany';

const Switch = ({ menu, form }) => {
  switch (true) {

    case menu.register:
      return (<FormRegister form={form.register} />);

    case menu.company:
      return (<FormCompany form={form.company} />);

    default: return null;
  }
};

Switch.propTypes = {
  menu: React.PropTypes.object,
  form: React.PropTypes.object,
};

export default observer(Switch);
