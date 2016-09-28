import React from 'react';
import { observer } from 'mobx-react';
import { DropdownList, Multiselect, DateTimePicker } from 'react-widgets';
import { DebugForm } from './Debug';

const products = ['iPhone', 'Watch', 'iMac', 'Mac Pro', 'MacBook Air', 'MacBook Pro'];

const FormCompany = ({ form }) => (
  <div className="container">
    <div className="splitted-35 fixed container-left normal">
      <form>
        <h2>Form Company</h2>
        <h4>React Widgets</h4>

        <div>
          <b>{form.$('name').label}</b>
          <i>{form.$('name').error}</i>
        </div>
        <input
          type="text"
          name={form.$('name').name}
          value={form.$('name').value}
          placeholder={form.$('name').label}
          onChange={form.$('name').sync}
        />

        <div>
          <b>{form.$('founded').label}</b>
          <i>{form.$('founded').error}</i>
        </div>
        <DateTimePicker
          time={false}
          value={form.$('founded').value}
          onChange={form.$('founded').sync}
        />

        <div>
          <b>{form.$('revenue').label}</b>
          <i>{form.$('revenue').error}</i>
        </div>
        <input
          type="text"
          name={form.$('revenue').name}
          value={form.$('revenue').value}
          placeholder={form.$('revenue').label}
          onChange={form.$('revenue').sync}
        />

        <div>
          <b>{form.$('assets').label}</b>
          <i>{form.$('assets').error}</i>
        </div>
        <input
          type="text"
          name={form.$('assets').name}
          value={form.$('assets').value}
          placeholder={form.$('assets').label}
          onChange={form.$('assets').sync}
        />

        <div>
          <b>{form.$('productsDropdown').label}</b>
          <i>{form.$('productsDropdown').error}</i>
        </div>
        <DropdownList
          data={products}
          value={form.$('productsDropdown').value}
          onChange={form.$('productsDropdown').sync}
        />

        <div>
          <b>{form.$('productsMultiselect').label}</b>
          <i>{form.$('productsMultiselect').error}</i>
        </div>
        <Multiselect
          data={products}
          value={form.$('productsMultiselect').value}
          onChange={form.$('productsMultiselect').sync}
        />

        <br />
        <div className="ctrl">
          <button onClick={form.handleOnSubmit} type="submit">Submit</button>
          <button onClick={form.handleOnClear}>Clear</button>
          <button onClick={form.handleOnReset}>Reset</button>
        </div>

        <p><i>{form.error}</i></p>

      </form>
    </div>
    <div className="splitted-65 container-right">
      <DebugForm form={form} />
    </div>
  </div>
);

FormCompany.propTypes = {
  form: React.PropTypes.object,
};

export default observer(FormCompany);
