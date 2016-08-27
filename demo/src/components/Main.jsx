import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import Menu from './Menu';
import Switch from './Switch';

import form from '../forms/_.forms';

const menu = observable({
  register: true,
  company: false,
});

const Main = () => (
  <div>
    <DevTools position={{ bottom: 0, right: '20px' }} />
    <Menu data={menu} />
    <Switch menu={menu} form={form} />
  </div>
);

export default observer(Main);
