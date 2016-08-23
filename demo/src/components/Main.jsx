import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Menu from './Menu';
import Switch from './Switch';

import form from '../forms/_.forms';

const menu = observable({
  register: true,
  company: false,
});

const Main = () => (
  <div>
    <Menu data={menu} />
    <Switch menu={menu} form={form} />
  </div>
);

export default observer(Main);
