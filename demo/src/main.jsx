import React from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

import 'react-widgets/lib/less/react-widgets.less';
import 'react-select/dist/react-select.css';

import './style.css';
import './style.devtools.css';

import Main from './components/Main';

momentLocalizer(moment);
injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <Main />
  </MuiThemeProvider>
);

render(
  <App />,
  document.querySelector('#app') // eslint-disable-line
);
