import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip';
import DevTools from 'mobx-react-devtools';

import Menu from './Menu';
import Switch from './Switch';

import form from '../forms/_.forms';
import menu from '../menu';

const Main = () => (
  <div>
    <ReactTooltip />
    <DevTools position={{ bottom: 0, left: '50px' }} />
    <Menu data={observable(menu)} />
    <Switch menu={menu} form={form} />
  </div>
);

export default observer(Main);
