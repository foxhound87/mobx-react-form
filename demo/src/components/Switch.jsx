import React from 'react';
import { observer } from 'mobx-react';

import FormRegisterMaterial from './FormRegisterMaterial';
import FormRegisterSimple from './FormRegisterSimple';
import FormCompanyWidgets from './FormCompanyWidgets';
import FormCompanySimple from './FormCompanySimple';

const Switch = ({ menu, form }) => {
  switch (true) {

    case menu.registerMaterial:
      return (<FormRegisterMaterial form={form.registerMaterial} />);

    case menu.registerSimple:
      return (<FormRegisterSimple form={form.registerSimple} />);

    case menu.companyWidgets:
      return (<FormCompanyWidgets form={form.companyWidgets} />);

    case menu.companySimple:
      return (<FormCompanySimple form={form.companySimple} />);

    default: return null;
  }
};

Switch.propTypes = {
  menu: React.PropTypes.object,
  form: React.PropTypes.object,
};

export default observer(Switch);
