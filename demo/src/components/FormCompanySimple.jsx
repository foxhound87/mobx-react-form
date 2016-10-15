import React from 'react';
import { observer } from 'mobx-react';
import Select from 'react-select';
import DebugForm from './Debug';

const products = ['iPhone', 'Watch', 'iMac', 'Mac Pro', 'MacBook Air', 'MacBook Pro'];

const productsOptions = [
  { value: 'iphone', label: 'iPhone' },
  { value: 'watch', label: 'Watch' },
  { value: 'imac', label: 'iMac' },
  { value: 'macpro', label: 'Mac Pro' },
  { value: 'macbookair', label: 'MacBook Air' },
  { value: 'macbookpro', label: 'MacBook Pro' },
];

const FormCompany = ({ form }) => (
  <div className="container normal">
    <form>
      <h2>Form Company</h2>

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
        <b>{form.$('products').label}</b>
        <i>{form.$('products').error}</i>
      </div>
      <select
        value={form.$('products').value}
        name={form.$('products').name}
        onChange={form.$('products').sync}
      >
        {products.map(val =>
          <option value={val} key={val}>{val}</option>
        )}
      </select>

      <div>
        <b>{form.$('productsMultiselect').label}</b>
        <i>{form.$('productsMultiselect').error}</i>
      </div>
      <Select
        multi
        options={productsOptions}
        value={form.$('productsMultiselect').value}
        name={form.$('productsMultiselect').name}
        onChange={form.$('productsMultiselect').sync}
        resetValue={[]}
      />

      <br />
      <br />
      <div className="ctrl">
        <button type="submit" onClick={form.onSubmit}>
          <i className="fa fa-dot-circle-o" /> Submit
        </button>
        <button type="button" onClick={form.onClear}>
          <i className="fa fa-eraser" /> Clear
        </button>
        <button type="button" onClick={form.onReset}>
          <i className="fa fa-refresh" /> Reset
        </button>
      </div>

      <p><i>{form.error}</i></p>

    </form>

    <div className="mobx-react-form-devtools">
      <DebugForm form={form} />
    </div>
  </div>
);

FormCompany.propTypes = {
  form: React.PropTypes.object,
};

export default observer(FormCompany);
