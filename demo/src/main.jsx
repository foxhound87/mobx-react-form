import React from 'react';
import { render } from 'react-dom';
import FormComponent from './FormComponent';
import form from './form';
import events from './form.events';

render(
  <FormComponent form={form} events={events} />,
  document.querySelector('#app') // eslint-disable-line
);
