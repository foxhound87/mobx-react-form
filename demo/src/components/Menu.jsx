import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import _ from 'lodash';

const switchTo = action((e, menu, key) => {
  e.preventDefault();
  _.map(menu, ($val, $key) => _.set(menu, $key, false));
  _.set(menu, key, true);
});

const Menu = ({ data }) => (
  <div className="menu clearfix">
    <a
      href="https://www.npmjs.com/package/mobx-ajv-form"
      className="right"
    > mobx-ajv-form (npm &#10140;)
    </a>
    <span className="left">SELECT DEMO:</span>
    <a
      onClick={(e) => switchTo(e, data, 'register')}
      className="left"
    > Register
    </a>
    <a
      onClick={(e) => switchTo(e, data, 'company')}
      className="left"
    > Company
    </a>
  </div>
);

Menu.propTypes = {
  data: React.PropTypes.object,
};

export default observer(Menu);
