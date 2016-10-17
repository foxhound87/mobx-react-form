import React from 'react';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import Dock from 'react-dock';
import Draggable from 'react-draggable';
import ReactTooltip from 'react-tooltip';
import JSONTree from 'react-json-tree';
import cx from 'classnames';
import _ from 'lodash';

const tools = observable({
  open: true,
  heading: {
    name: true,
    sub: true,
  },
});

const dock = observable({
  visible: true,
  fluid: true,
  size: 0.30,
  position: 'right',
  mode: 'none',
  style: {
    background: '#2b303b',
  },
});

const theme = {
  scheme: 'ocean',
  author: 'chris kempson (http://chriskempson.com)',
  base00: '#2b303b',
  base01: '#343d46',
  base02: '#4f5b66',
  base03: '#65737e',
  base04: '#a7adba',
  base05: '#c0c5ce',
  base06: '#dfe1e8',
  base07: '#eff1f5',
  base08: '#bf616a',
  base09: '#d08770',
  base0A: '#ebcb8b',
  base0B: '#a3be8c',
  base0C: '#96b5b4',
  base0D: '#8fa1b3',
  base0E: '#b48ead',
  base0F: '#ab7967',
};

const fieldPropsToPick = [
  'path',
  'default',
  'initial',
  'value',
  'label',
  'disabled',
  'focus',
  'touched',
  'hasError',
  'isValid',
  'isEmpty',
  'isDefault',
  'isPristine',
  'isDirty',
  'error',
  'related',
];

const parseFormData = form =>
  toJS(_.pick(form, [
    'hasError',
    'isValid',
    'isEmpty',
    'isDefault',
    'isPristine',
    'isDirty',
  ]));

const parseFieldsData = fields =>
  _.reduce(fields.values(), (obj, field) => {
    const $nested = $fields => ($fields.size !== 0)
      ? parseFieldsData($fields)
      : undefined;

    const data = toJS(_.pick(field, fieldPropsToPick));

    Object.assign(obj, {
      [field.key]: Object.assign(data, {
        fields: $nested(field.fields),
      }),
    });

    return obj;
  }, {});

const handleOnSizeChange = action('size-change', (size) => {
  _.set(dock, 'size', size);
  _.set(tools, 'heading.name', (size > 0.22));
  _.set(tools, 'heading.sub', (size > 0.11));
});

const handleOnCloseTools = action('close-tools', (e) => {
  e.preventDefault();
  _.set(tools, 'open', false);
});

const handleOnOpenTools = action('open-tools', (e) => {
  e.preventDefault();
  _.set(tools, 'open', true);
});

const handleOnOpenDoc = action('open-tools', (e) => {
  e.preventDefault();
  window.open('https://foxhound87.github.io/mobx-react-form/', '_blank'); // eslint-disable-line
});

export default observer(({ form }) => (
  <Dock
    defaultSize={tools.open ? dock.size : 0}
    size={tools.open ? dock.size : 0}
    onSizeChange={handleOnSizeChange}
    position={dock.position}
    fluid={dock.fluid}
    isVisible={dock.visible}
    dimMode={dock.mode}
    dockStyle={dock.style}
  >
    <ReactTooltip />
    <Draggable
      axis="y"
      handle=".handle"
      zIndex={99999999999}
      defaultPosition={{ x: 0, y: 0 }}
    >
      <div className={cx('draggable', { hidden: tools.open })}>
        <div className="handle" data-tip="DRAG">
          <i className="fa fa-bars" />
        </div>
        <button onClick={handleOnOpenTools} data-tip="OPEN">
          <i className="fa fa-chevron-left" />
        </button>
        <button onClick={handleOnOpenDoc} data-tip="DOCS">
          <i className="fa fa-book" />
        </button>
      </div>
    </Draggable>
    <div className="tools">
      <div className="heading clearfix">
        <div className="left">
          <i className={cx({ hidden: !tools.heading.name })}>mobx-react-form</i>
          <b className={cx({ hidden: !tools.heading.sub })}>DEVTOOLS</b>
        </div>
        <button className="right" onClick={handleOnCloseTools} data-tip="CLOSE">
          <i className="fa fa-chevron-circle-right" />
        </button>
        <button className="right" onClick={handleOnOpenDoc} data-tip="DOCS">
          <i className="fa fa-book" />
        </button>
      </div>

      <h4><i className="fa fa-th" /> Form</h4>
      <JSONTree
        hideRoot
        data={parseFormData(form)}
        theme={theme}
        isLightTheme={false}
      />

      <h4><i className="fa fa-bars" /> Fields</h4>
      <JSONTree
        hideRoot
        data={parseFieldsData(form.fields)}
        theme={theme}
        isLightTheme={false}
      />
    </div>
  </Dock>
));
